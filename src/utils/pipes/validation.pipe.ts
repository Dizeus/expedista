import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ValidationException } from '../exceptions/validation.exception';
import { LocalizationService } from 'src/localization/localization.service';
import { parseTranslation } from '../helpers/parse-translation/parse-translation';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  constructor(private localizationService: LocalizationService) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
      return value;
    }
    const obj = plainToInstance(metadata.metatype, value);
    const errors = await validate(obj);
    if (errors.length) {
      const message = errors
        .map((err, i) => this.generateErrorMessage(err, i))
        .join(', ');
      throw new ValidationException(message);
    }

    return value;
  }
  private generateErrorMessage(err: ValidationError, index: number): string {
    return `${++index}. ${parseTranslation(err, this.localizationService)} - ${err.value}`;
  }
  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
