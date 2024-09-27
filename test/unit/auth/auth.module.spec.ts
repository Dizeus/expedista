import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { mockUsersService } from 'test/mocks/services/mock-user-service';
import { LocalizationService } from 'src/localization/localization.service';
import { mockLocalizationService } from 'test/mocks/services/mock-localization-service';
import { UsersModule } from 'src/users/users.module';
import { LocalizationModule } from 'src/localization/localization.module';
import { AuthService } from 'src/auth/auth.service';
import { AuthController } from 'src/auth/auth.controller';
import { AuthModule } from 'src/auth/auth.module';

describe('AuthModule', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        AuthModule,
        JwtModule.register({
          secret: 'testSecret',
          signOptions: { expiresIn: '1w' },
        }),
      ],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .overrideProvider(LocalizationService)
      .useValue(mockLocalizationService)
      .compile();
  });

  it('should compile the AuthModule', async () => {
    expect(moduleRef).toBeDefined();
  });

  it('should provide AuthService', () => {
    const authService = moduleRef.get<AuthService>(AuthService);
    expect(authService).toBeDefined();
  });

  it('should have AuthController', () => {
    const authController = moduleRef.get<AuthController>(AuthController);
    expect(authController).toBeDefined();
  });

  it('should import UsersModule', () => {
    const usersModule = moduleRef.get(UsersModule);
    expect(usersModule).toBeDefined();
  });

  it('should import LocalizationModule', () => {
    const localizationModule = moduleRef.get(LocalizationModule);
    expect(localizationModule).toBeDefined();
  });

  it('should export AuthService', () => {
    const exportedAuthService = moduleRef.get<AuthService>(AuthService);
    expect(exportedAuthService).toBeDefined();
  });
});
