import { ArgumentMetadata } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import * as classValidator from 'class-validator';
import { LocalizationService } from 'src/localization/localization.service';
import { ValidationPipe } from 'src/utils/pipes/validation.pipe';
import { mockLocalizationService } from 'test/mocks/services/mock-localization-service';

jest.mock('class-transformer');
jest.mock('class-validator');
jest.mock('src/utils/helpers/parse-translation', () => ({
  parseTranslation: jest.fn(() => 'translated Text'),
}));
jest.mock('src/utils/exceptions/validation.exception', () => ({
  ValidationException: jest.fn().mockImplementation((message: string) => {
    const error = new Error(message);
    error.name = 'ValidationException';
    return error;
  }),
}));
const validationErrors = [
  {
    property: 'property',
    constraints: { someConstraint: 'Validation failed' },
  },
];
const value = { property: 'valid' };
const metadata: ArgumentMetadata = {
  type: 'body',
  metatype: jest.fn(),
};

const emptyMetadata: ArgumentMetadata = {
  type: 'body',
};

describe('ValidationPipe', () => {
  let validationPipe: ValidationPipe;

  beforeEach(() => {
    validationPipe = new ValidationPipe(
      mockLocalizationService as unknown as LocalizationService,
    );
  });

  it('should be defined', () => {
    expect(validationPipe).toBeDefined();
  });

  it('should return the value if metatype is missed or not toValidate', async () => {
    const mockPlainToInstance = plainToInstance as jest.Mock;
    const mockValidate = classValidator.validate as jest.Mock;

    expect(await validationPipe.transform(value, emptyMetadata)).toEqual(value);

    expect(mockPlainToInstance).not.toHaveBeenCalled();
    expect(mockValidate).not.toHaveBeenCalled();
  });

  it('should transform the value successfully if validation passes', async () => {
    const mockPlainToInstance = plainToInstance as jest.Mock;
    const mockValidate = classValidator.validate as jest.Mock;

    mockValidate.mockResolvedValueOnce([]);
    mockPlainToInstance.mockReturnValueOnce(value);

    expect(await validationPipe.transform(value, metadata)).toEqual(value);

    expect(mockPlainToInstance).toHaveBeenCalledWith(metadata.metatype, value);
    expect(mockValidate).toHaveBeenCalledWith(value);
  });

  it('should throw ValidationException if validation fails', async () => {
    const mockToInstance = plainToInstance as jest.Mock;
    const mockValidate = classValidator.validate as jest.Mock;

    mockToInstance.mockReturnValueOnce(value);
    mockValidate.mockResolvedValueOnce(validationErrors);

    await expect(validationPipe.transform(value, metadata)).rejects.toThrow(
      Error,
    );

    expect(mockToInstance).toHaveBeenCalledWith(metadata.metatype, value);
    expect(mockValidate).toHaveBeenCalledWith(value);
  });
});
