import { IsEmail, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/assets/generated/i18n.generated';

export class LoginAuthDto {
  @IsEmail(
    {},
    {
      message: i18nValidationMessage<I18nTranslations>(
        'translation.validation.isEmail',
      ),
    },
  )
  readonly email: string;

  @IsString({
    message: i18nValidationMessage<I18nTranslations>(
      'translation.validation.isString',
      { field: 'Password' },
    ),
  })
  readonly password: string;
}
