import { IsEmail, IsString, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/assets/generated/i18n.generated';
import {
  USER_FULLNAME_MIN_LENGTH,
  USER_PASSWORD_MIN_LENGTH,
} from '../../assets/constants/config';

export class CreateUserDto {
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
      { field: 'Fullname' },
    ),
  })
  @MinLength(USER_FULLNAME_MIN_LENGTH, {
    message: i18nValidationMessage<I18nTranslations>(
      'translation.validation.minLength',
      { field: 'Fullname', minLength: USER_FULLNAME_MIN_LENGTH },
    ),
  })
  readonly fullname: string;
  @IsString({
    message: i18nValidationMessage<I18nTranslations>(
      'translation.validation.isString',
      { field: 'Password' },
    ),
  })
  @MinLength(USER_PASSWORD_MIN_LENGTH, {
    message: i18nValidationMessage<I18nTranslations>(
      'translation.validation.isString',
      { field: 'Password', minLength: USER_PASSWORD_MIN_LENGTH },
    ),
  })
  readonly password: string;
}
