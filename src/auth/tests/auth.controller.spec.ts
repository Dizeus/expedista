import { AuthController } from '../auth.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
import { mockAuthRequest } from 'src/assets/mocks/mock-auth-request';
import { mockJwtAuthGuard } from 'src/assets/mocks/mock-jwt-auth-guard';
import { mockDtoLogin } from 'src/assets/mocks/mock-dto-login';
import { mockDtoRegistration } from 'src/assets/mocks/mock-dto-registration';

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
