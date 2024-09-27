import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
import { mockAuthRequest } from 'test/mocks/mock-auth-request';
import { mockJwtAuthGuard } from 'test/mocks/guards/mock-jwt-auth-guard';
import { mockDtoLogin } from 'test/mocks/dto/mock-dto-login';
import { mockDtoRegistration } from 'test/mocks/dto/mock-dto-registration';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';

const mockAuthService = {
  refresh: jest.fn(),
  login: jest.fn(),
  registration: jest.fn(),
};

describe('AuthController tests', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('AuthController should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should refersh user token', () => {
    controller.refresh(mockAuthRequest);
    expect(mockAuthService.refresh).toHaveBeenCalledWith(
      mockAuthRequest.user.id,
    );
  });

  it('Should login user', () => {
    controller.login(mockDtoLogin);

    expect(mockAuthService.login).toHaveBeenCalledWith(mockDtoLogin);
  });

  it('Should registrate user', () => {
    controller.registration(mockDtoRegistration);
    expect(mockAuthService.registration).toHaveBeenCalledWith(
      mockDtoRegistration,
    );
  });
});
