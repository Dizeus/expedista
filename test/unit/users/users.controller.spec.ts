import { Test, TestingModule } from "@nestjs/testing";
import { JwtModule } from "@nestjs/jwt";
import { UsersController } from "src/users/users.controller";
import { UsersService } from "src/users/users.service";
import { mockUsersService } from "test/mocks/services/mock-user-service";
import { mockAuthRequest } from "test/mocks/mock-auth-request";
import { MOCK_FILE } from "test/mocks/mock-file";
import { JwtAuthGuard } from "src/utils/guards/jwt-auth.guard";
import { mockJwtAuthGuard } from "test/mocks/guards/mock-jwt-auth-guard";

describe("UsersController", () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it("UsersController should be defined", () => {
    expect(controller).toBeDefined();
  });

  it('getAll - should return users by incoming pagination', () => {
    controller.getAll(1, 20, 'hey')

    expect(mockUsersService.findAll).toHaveBeenCalledWith(1, 20, 'hey');
  });

  it('getAll - should return users by default pagination', () => {
    controller.getAll();
    expect(mockUsersService.findAll).toHaveBeenCalledWith(1, 10, '');
  });

  it("should set an Avatar", () => {

    controller.setAvatar(mockAuthRequest, MOCK_FILE);

    expect(mockUsersService.setAvatar).toHaveBeenCalledWith(
      MOCK_FILE,
      mockAuthRequest.user.id,
    );
  });

  it("should delete self Account", () => {
    controller.deleteSelf(mockAuthRequest);
    expect(mockUsersService.remove).toHaveBeenCalledWith(
      mockAuthRequest.user.id,
    );
  });
});
