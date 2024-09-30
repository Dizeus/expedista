import { Test, TestingModule } from "@nestjs/testing";
import { ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedException } from "@nestjs/common";
import { JwtAuthGuard } from "src/utils/guards/jwt-auth.guard";
import { LocalizationService } from "src/localization/localization.service";
import { mockLocalizationService } from "test/mocks/services/mock-localization-service";

const contextEmpty: ExecutionContext = {
  switchToHttp: jest.fn().mockReturnValue({
    getRequest: jest.fn().mockReturnValue({
      headers: {},
    }),
  }),
} as unknown as ExecutionContext;

const contextAuth: ExecutionContext = {
  switchToHttp: jest.fn().mockReturnValue({
    getRequest: jest.fn().mockReturnValue({
      headers: {
        authorization: "Bearer validToken",
      },
    }),
  })
} as unknown as ExecutionContext;

const contextNotValid: ExecutionContext = {
  switchToHttp: jest.fn().mockReturnValue({
    getRequest: jest.fn().mockReturnValue({
      headers: {
        authorization: 'InvalidToken',
      },
    }),
  }),
} as unknown as ExecutionContext;

const mockJwtService = {
  verify: jest.fn((token: string) => {}),
};
describe("JwtAuthGuard", () => {
  let guard: JwtAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
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

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(guard).toBeDefined();
  });

  it("should return true with valid auth", () => {
    (mockJwtService.verify as jest.Mock).mockReturnValue({ userId: "123" });

    expect(guard.canActivate(contextAuth)).toBeTruthy();
    expect(contextAuth.switchToHttp).toHaveBeenCalledTimes(1);
    expect(mockJwtService.verify).toHaveBeenCalledWith("validToken");
  });

  it("should throw UnauthorizedException with invalid auth", () => {
    (mockJwtService.verify as jest.Mock).mockImplementation(() => {
      throw new UnauthorizedException();
    });
    expect(() => guard.canActivate(contextNotValid)).toThrow(
      UnauthorizedException,
    );
    expect(contextNotValid.switchToHttp).toHaveBeenCalledTimes(1);
    expect(mockJwtService.verify).not.toHaveBeenCalled();
  });

  it("should throw UnauthorizedException without auth", () => {
    expect(() => guard.canActivate(contextEmpty)).toThrowError(
      UnauthorizedException,
    );
    expect(contextEmpty.switchToHttp).toHaveBeenCalledTimes(1);
  });
});
