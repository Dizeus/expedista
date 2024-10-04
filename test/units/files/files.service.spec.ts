import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import * as fs from 'fs';
import { FilesService } from 'src/files/files.service';
import { LocalizationService } from 'src/localization/localization.service';
import { mockLocalizationService } from 'test/mocks/services/mock-localization-service';
import { MOCK_FILE } from 'test/mocks/mock-file';

const FILE_PATH = 'testFilePath';

describe('FilesService', () => {
  let service: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: LocalizationService,
          useValue: mockLocalizationService,
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should create file successfully and create directory if it doesn't exist", () => {
    const spyWriteFileSync = jest.spyOn(fs, 'writeFileSync');
    const spyExistsSync = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const spyMkdirSync = jest.spyOn(fs, 'mkdirSync');
    const result = service.createFile(MOCK_FILE, FILE_PATH);

    expect(result).toStrictEqual(expect.any(String));
    expect(spyWriteFileSync).toHaveBeenCalledWith(
      expect.any(String),
      MOCK_FILE.buffer,
    );
    expect(spyExistsSync).toHaveBeenCalledWith(FILE_PATH);
    expect(spyMkdirSync).toHaveBeenCalledWith(FILE_PATH, { recursive: true });
  });

  it('should throw an HttpException when creating file fails', () => {
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {
      throw new Error('File writing error');
    });

    expect(() => {
      service.createFile(MOCK_FILE, FILE_PATH);
    }).toThrow(HttpException);

    expect(mockLocalizationService.translate).toHaveBeenCalledWith(
      expect.any(String),
    );
  });
});
