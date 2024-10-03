import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common';
import { LocalizationService } from 'src/localization/localization.service';
import { mockLocalizationService } from 'test/mocks/services/mock-localization-service';
import { USER_ROLE } from 'src/assets/constants/roles';
import { RoleGuard } from 'src/utils/guards/role.guard';

jest.mock('src/utils/helpers/get-token', () => ({
  getToken: jest.fn(() => 'validToken'),
}));

const contextNotValidToken: ExecutionContext = {
  switchToHttp: jest.fn().mockReturnValue({
    getRequest: jest.fn().mockReturnValue({
      headers: {
        authorization: 'notValidToken',
      },
    }),
  }),
  getClass: jest.fn(),
  getHandler: jest.fn(),
} as unknown as ExecutionContext;

const contextValidToken: ExecutionContext = {
  switchToHttp: jest.fn().mockReturnValue({
    getRequest: jest.fn().mockReturnValue({
      headers: {
        authorization: 'Bearer validToken',
      },
    }),
  }),
  getClass: jest.fn(),
  getHandler: jest.fn(),
} as unknown as ExecutionContext;

const ADMIN_ROLE = 'admin';

const admin = {
  role: ADMIN_ROLE,
};

const user = {
  role: USER_ROLE,
};

const mockReflector = {
  getAllAndOverride: jest.fn(),
};

const mockJwtService = {
  verify: jest.fn(() => user),
};

describe('RoleGuard', () => {
  let guard: RoleGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleGuard,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
        {
          provide: LocalizationService,
          useValue: mockLocalizationService,
        },
      ],
    }).compile();

    guard = module.get<RoleGuard>(RoleGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true with USER_ROLE', () => {
    (mockReflector.getAllAndOverride as jest.Mock).mockReturnValue(USER_ROLE);
    expect(guard.canActivate(contextNotValidToken)).toBeTruthy();
  });

  it('should throw HttpException with invalid auth', () => {
    (mockReflector.getAllAndOverride as jest.Mock).mockReturnValue(ADMIN_ROLE);
    (mockJwtService.verify as jest.Mock).mockImplementationOnce(() => {
      throw new UnauthorizedException();
    });
    try {
      expect(guard.canActivate(contextNotValidToken)).toThrow(HttpException);
      fail('Expected exception to be thrown, but none was thrown.');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(mockLocalizationService.translate).toHaveBeenCalledWith(
        'translation.error.forbidden',
      );
      expect(mockReflector.getAllAndOverride).toHaveBeenCalledTimes(1);
    }
  });

  it('should return false with not matching role', () => {
    (mockReflector.getAllAndOverride as jest.Mock).mockReturnValue(ADMIN_ROLE);
    expect(guard.canActivate(contextValidToken)).toBeFalsy();
    expect(mockReflector.getAllAndOverride).toHaveBeenCalledTimes(1);
    expect(mockJwtService.verify).toHaveBeenCalledTimes(1);
  });

  it('should return true with valid auth and matching role', () => {
    (mockReflector.getAllAndOverride as jest.Mock).mockReturnValue(ADMIN_ROLE);
    (mockJwtService.verify as jest.Mock).mockReturnValue(admin);
    expect(guard.canActivate(contextValidToken)).toBeTruthy();
    expect(mockReflector.getAllAndOverride).toHaveBeenCalledTimes(1);
    expect(mockJwtService.verify).toHaveBeenCalledTimes(1);
  });
});
