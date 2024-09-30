import { Test, TestingModule } from "@nestjs/testing";
import { mockPrismaService } from "test/mocks/services/mock-prisma-service";
import { mockDtoRegistration } from "test/mocks/dto/mock-dto-registration";
import { clientUserSelection } from "src/utils/selections/client-user-selection";
import { UsersRepository } from "src/users/users.repository";
import { PrismaService } from "src/prisma/prisma.service";
import { USER_ROLE } from "src/assets/constants/roles";
import { mockUser } from "test/mocks/mock-user";

const TEST_PARAMS = { skip: 0, count: 10, query: "R" };

describe("UserRepository", () => {
  let repository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
  });


  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  it("should create user", async () => {
    const hashedPassword = "21EFNU1231#41";
    await repository.create(mockDtoRegistration, hashedPassword);

    expect(mockPrismaService.user.create).toHaveBeenCalledWith({
      data: {
        ...mockDtoRegistration,
        id: expect.any(String),
        password: hashedPassword,
        role: USER_ROLE,
        avatar: null,
      },
      select: clientUserSelection
    });
  });

  it("should find all specified users", async () => {
    await repository.findAll(
      TEST_PARAMS.skip,
      TEST_PARAMS.count,
      TEST_PARAMS.query,
    );

    expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
      skip: TEST_PARAMS.skip,
      take: TEST_PARAMS.count,
      where: {
        fullname: { contains: TEST_PARAMS.query, mode: 'insensitive' },
      },
    });
  });

  it('totalCount - should return total count of users', async () => {
    await repository.totalCount(TEST_PARAMS.query)
    expect(mockPrismaService.user.count).toHaveBeenCalledWith({
      where: {
        fullname: { contains: TEST_PARAMS.query, mode: 'insensitive' },
      },
    });
  });

  it('findOneByEmail - should found user by mail', async () => {
    await repository.findOneByEmail(mockUser.email)

    expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
      where: { email: mockUser.email },
    });
  });


  it("should found user by id", async () => {
    await repository.findOne(mockUser.id)

    expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      select: clientUserSelection
    });
  });

  it("should remove user", async () => {
    await repository.remove(mockUser.id)

    expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
      where: { id: mockUser.id },
    });
  });

  it("should set Avatar", async () => {
    const filename = 'filename.jpg'
    await repository.setAvatar(filename, mockUser.id)
    expect(mockPrismaService.user.update).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      data: { avatar: 'avatars/filename.jpg' },
      select: clientUserSelection
    });
  });

});
