import { ValidationError } from 'class-validator';
import { I18nPath } from 'src/assets/generated/i18n.generated';
import { LocalizationService } from 'src/localization/localization.service';

export const parseTranslation = (
  err: ValidationError,
  localizationService: LocalizationService,
) => {
  return Object.values(err.constraints as { [type: string]: string })
    .map((string: I18nPath) => {
      const [path, stringParams] = string.split('|');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { constraints, value, ...parsedParams } = JSON.parse(stringParams);
      const params = Object.keys(parsedParams).map((key: string) => ({
        [key]: parsedParams[key],
      }));
      return localizationService.translate(path as I18nPath, params);
    })
    .join(',');
};
