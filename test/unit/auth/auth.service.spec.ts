import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LocalizationService } from 'src/localization/localization.service';
import { mockUsersService } from 'test/mocks/services/mock-user-service';
import * as bcrypt from 'bcrypt';
import { mockUser } from 'test/mocks/mock-user';
import { mockDtoLogin } from 'test/mocks/dto/mock-dto-login';
import { HttpException } from '@nestjs/common';
import mockClientUser from 'test/mocks/mock-client-user';
import { mockDtoRegistration } from 'test/mocks/dto/mock-dto-registration';
import { mockLocalizationService } from 'test/mocks/services/mock-localization-service';
import { AuthService } from 'src/auth/auth.service';

const mockJwtService = {
  sign: jest.fn(() => ''),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: LocalizationService,
          useValue: mockLocalizationService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('validateUser - should return user if the credentials are correct', async () => {
    const mockBcrypt = jest.spyOn(bcrypt, 'compare');
    mockBcrypt.mockImplementation(() => true);
    mockUsersService.findOneByEmail.mockResolvedValue(mockUser);
    expect(await service.validateUser(mockDtoLogin)).toEqual(mockClientUser);
    expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(
      mockDtoLogin.email,
    );
    expect(mockBcrypt).toHaveBeenCalledWith(
      mockDtoLogin.password,
      mockUser.password,
    );
  });

  it('validateUser - should throw error if password is wrong', async () => {
    const mockBcrypt = jest.spyOn(bcrypt, 'compare');
    mockBcrypt.mockImplementation(() => false);
    try {
      expect(await service.validateUser(mockDtoLogin)).toEqual(mockUser);
      fail('Expected exception to be thrown, but none was thrown.');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(
        mockDtoLogin.email,
      );
      expect(mockLocalizationService.translate).toHaveBeenCalledWith(
        'translation.error.auth',
        [{ user: false }],
      );
      expect(mockBcrypt).toHaveBeenCalledWith(
        mockDtoLogin.password,
        mockUser.password,
      );
    }
    mockBcrypt.mockRestore();
  });

  it('validateUser - should throw error if email is wrong', async () => {
    const mockBcrypt = jest.spyOn(bcrypt, 'compare');
    mockBcrypt.mockImplementation(() => true);
    mockUsersService.findOneByEmail.mockResolvedValue(null);
    try {
      expect(await service.validateUser(mockDtoLogin)).toEqual(mockUser);
      fail('Expected exception to be thrown, but none was thrown.');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(mockLocalizationService.translate).toHaveBeenCalledWith(
        'translation.error.auth',
        [{ user: true }],
      );
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(
        mockUser.email,
      );
      expect(mockBcrypt).not.toHaveBeenCalled();
    }
    mockBcrypt.mockRestore();
  });

  it('generateToken - should generate token', async () => {
    expect(await service.generateToken(mockClientUser)).toEqual({
      token: '',
      user: mockClientUser,
    });
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      email: mockClientUser.email,
      id: mockClientUser.id,
      role: mockClientUser.role,
    });
  });

  it('login - should login user', async () => {
    jest.spyOn(service as any, 'validateUser').mockResolvedValue(() => {});
    jest.spyOn(service as any, 'generateToken').mockResolvedValue(() => {});

    await service.login(mockDtoLogin);

    expect(service.validateUser).toHaveBeenCalledWith(mockDtoLogin);
    expect(service.generateToken).toHaveBeenCalled();
  });

  it('registration - should register user', async () => {
    jest.spyOn(service as any, 'generateToken').mockResolvedValue(() => {});

    await service.registration(mockDtoRegistration);
    expect(mockUsersService.create).toHaveBeenCalledWith(mockDtoRegistration);
    expect(service.generateToken).toHaveBeenCalled();
  });

  it('refresh - should refresh user token', async () => {
    jest.spyOn(service as any, 'generateToken').mockResolvedValue(() => {});

    await service.refresh('123');
    expect(mockUsersService.findOne).toHaveBeenCalledWith('123');
    expect(service.generateToken).toHaveBeenCalled();
  });
});
