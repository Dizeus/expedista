import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nPath, I18nTranslations } from '../assets/generated/i18n.generated';
import { LocalizationAction } from 'src/assets/types/enums/LocalizationAction';
import { LocalizationObjects } from 'src/assets/types/enums/LocalizationObjects';

@Injectable()
export class LocalizationService {
  constructor(private readonly i18n: I18nService<I18nTranslations>) {}

  translate(key: I18nPath, params: object | object[] = []): string {
    return this.i18n.t(key, {
      lang: I18nContext.current()?.lang,
      args: params,
    });
  }

  action(actionKey: LocalizationAction, paramKey: LocalizationObjects) {
    return this.translate(('translation.actions.' + actionKey) as I18nPath, [
      {
        object: this.translate(('translation.objects.' + paramKey) as I18nPath),
      },
    ]);
  }

  notFound(paramKey: LocalizationObjects, param: string) {
    return this.translate('translation.error.notFound', [
      {
        object: this.translate(('translation.objects.' + paramKey) as I18nPath),
      },
      {
        param,
      },
    ]);
  }
}
