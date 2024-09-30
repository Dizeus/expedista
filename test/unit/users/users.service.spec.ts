import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import * as path from 'path';
import { LocalizationObjects } from 'src/assets/types/enums/LocalizationObjects';
import { FilesService } from 'src/files/files.service';
import { LocalizationService } from 'src/localization/localization.service';
import { UsersRepository } from 'src/users/users.repository';
import { UsersService } from 'src/users/users.service';
import { mockDtoRegistration } from 'test/mocks/dto/mock-dto-registration';
import mockClientUser from 'test/mocks/mock-client-user';
import { MOCK_FILE } from 'test/mocks/mock-file';
import { mockUser } from 'test/mocks/mock-user';
import { mockFileService } from 'test/mocks/services/mock-files-service';
import { mockLocalizationService } from 'test/mocks/services/mock-localization-service';

const mockUserRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  totalCount: jest.fn(),
  setAvatar: jest.fn(),
  findOneByEmail: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUserRepository,
        },
        {
          provide: FilesService,
          useValue: mockFileService,
        },
        {
          provide: LocalizationService,
          useValue: mockLocalizationService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('UsersService - should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create - should create a user', async () => {
    mockUserRepository.findOneByEmail.mockResolvedValue(null);
    const mockBcrypt = jest.spyOn(bcrypt, 'hash');
    mockBcrypt.mockImplementation(() => '');

    await service.create(mockDtoRegistration);

    expect(mockUserRepository.findOneByEmail).toHaveBeenCalledWith(
      mockDtoRegistration.email,
    );

    expect(mockBcrypt).toHaveBeenCalledWith(mockDtoRegistration.password, 10);

    expect(mockUserRepository.create).toHaveBeenCalledWith(
      mockDtoRegistration,
      expect.any(String),
    );
  });
  it('create - should throw error if email already in use', async () => {
    mockUserRepository.findOneByEmail.mockResolvedValue(mockUser);
    try {
      await service.create(mockDtoRegistration);
      fail('Expected exception to be thrown, but none was thrown.');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(mockUserRepository.findOneByEmail).toHaveBeenCalledWith(
        mockDtoRegistration.email,
      );
      expect(mockLocalizationService.translate).toHaveBeenCalledWith(
        'translation.error.emailExist',
        [{ type: 'email' }, { value: mockDtoRegistration.email }],
      );
    }
  });

  it('findAll - should find all specified users', async () => {
    await service.findAll(1, 10, '');

    expect(mockUserRepository.findAll).toHaveBeenCalledWith(0, 10, '');
    expect(mockUserRepository.totalCount).toHaveBeenCalledWith('');
  });

  it('findOne - should return the existing user', async () => {
    mockUserRepository.findOne.mockResolvedValue(mockClientUser);
    await service.findOne(mockClientUser.id);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith(mockClientUser.id);
  });

  it('findOne - should throw an Exception when user not found', async () => {
    try {
      mockUserRepository.findOne.mockResolvedValue(null);
      await service.findOne(mockClientUser.id);
      fail('Expected exception to be thrown, but none was thrown.');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(mockLocalizationService.notFound).toHaveBeenCalledWith(
        LocalizationObjects.USER,
        mockClientUser.id,
      );
    }
  });
  
  it('findOneByEmail - should find user by email', async () => {
    await service.findOneByEmail(mockClientUser.email);
    expect(mockUserRepository.findOneByEmail).toHaveBeenCalledWith(mockClientUser.email);
  });

  it('remove - should remove user', async () => {
    jest.spyOn(service as any, 'findOne').mockResolvedValue(mockClientUser);

    expect(await service.remove(mockClientUser.id)).toEqual({
      message: undefined,
    });
    expect(mockUserRepository.remove).toHaveBeenCalledWith(mockClientUser.id);
  });

  it('setAvatar - should set Avatar', async () => {
    const filePath = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'static',
      'avatars',
    );
    await service.setAvatar(MOCK_FILE, mockUser.id);
    expect(mockFileService.createFile).toHaveBeenCalledWith(
      MOCK_FILE,
      filePath,
    );
    expect(mockUserRepository.setAvatar).toHaveBeenCalledWith(
      expect.any(String),
      mockUser.id,
    );
  });
});
