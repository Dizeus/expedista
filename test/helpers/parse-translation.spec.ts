import { ValidationError } from 'class-validator';
import { LocalizationService } from 'src/localization/localization.service';
import { parseTranslation } from 'src/utils/helpers/parse-translation';
import { mockLocalizationService } from 'test/mocks/services/mock-localization-service';

const ERROR: ValidationError = {
  property: '',
  constraints: {
    email: 'translation.validation.isEmail|{"field":"Email", "minLength": 5}',
  },
};

describe('parseTranslation', () => {
  it('should call token with valid header', () => {
    parseTranslation(
      ERROR,
      mockLocalizationService as unknown as LocalizationService,
    );
    expect(mockLocalizationService.translate).toHaveBeenCalledWith(
      'translation.validation.isEmail',
      [{ field: 'Email' }, { minLength: 5 }],
    );
  });
});
