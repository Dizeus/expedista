import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LocalizationService } from 'src/localization/localization.service';
import { AllExceptionsFilter } from 'src/utils/filters/all-exception.filter';
import { mockLocalizationService } from 'test/mocks/services/mock-localization-service';

describe('AllExceptionsFilter', () => {
  let allExceptionsFilter: AllExceptionsFilter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AllExceptionsFilter,
        {
          provide: LocalizationService,
          useValue: mockLocalizationService,
        },
      ],
    }).compile();

    allExceptionsFilter = module.get<AllExceptionsFilter>(AllExceptionsFilter);
  });
  it('should be defined', () => {
    expect(allExceptionsFilter).toBeDefined();
  });

  it('should catch and handle HttpException', async () => {
    const exception = new HttpException('notFound', HttpStatus.BAD_REQUEST);
    const mockJson = jest.fn();
    const mockHost = {
      switchToHttp: jest.fn(() => ({
        getResponse: jest.fn().mockReturnValue({
          status: jest.fn().mockReturnThis(),
          json: mockJson,
        }),
        getRequest: jest.fn(() => ({ url: 'url' })),
      })),
    } as unknown as ArgumentsHost;

    allExceptionsFilter.catch(exception, mockHost);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'notFound',
      timestamp: expect.any(String),
      path: 'url',
    });
    expect(mockLocalizationService.translate).not.toHaveBeenCalled();
  });

  it('should catch and handle all other Exceptions', async () => {
    const exception = new Error('Internal Server Error');

    const mockJson = jest.fn();
    const mockHost = {
      switchToHttp: jest.fn(() => ({
        getResponse: jest.fn().mockReturnValue({
          status: jest.fn().mockReturnThis(),
          json: mockJson,
        }),
        getRequest: jest.fn(() => ({ url: 'url' })),
      })),
    } as unknown as ArgumentsHost;

    allExceptionsFilter.catch(exception, mockHost);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: 500,
      message: undefined,
      timestamp: expect.any(String),
      path: 'url',
    });
    expect(mockLocalizationService.translate).toHaveBeenCalled();
  });
});
