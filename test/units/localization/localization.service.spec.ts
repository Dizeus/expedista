import { Test, TestingModule } from '@nestjs/testing';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nPath } from 'src/assets/generated/i18n.generated';
import { LocalizationAction } from 'src/assets/types/enums/LocalizationAction';
import { LocalizationObjects } from 'src/assets/types/enums/LocalizationObjects';
import { LocalizationService } from 'src/localization/localization.service';

const CURR_LANG = 'uk';
const KEY: I18nPath = 'translation.objects.user';
const PARAM_KEY = LocalizationObjects.USER;

const mockI18nService = {
  t: jest.fn(),
};

jest.mock('nestjs-i18n', () => ({
  I18nContext: {
    current: jest.fn(() => ({ lang: CURR_LANG }) as I18nContext),
  },
  I18nService: jest.fn(() => mockI18nService),
}));

describe('LocalizationService', () => {
  let service: LocalizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalizationService,
        {
          provide: I18nService,
          useValue: mockI18nService,
        },
      ],
    }).compile();

    service = module.get<LocalizationService>(LocalizationService);
  });

  it('LocalizationService - should be defined', () => {
    expect(service).toBeDefined();
  });

  it('translate - should call i18n.t without params', () => {
    service.translate(KEY);
    expect(mockI18nService.t).toHaveBeenCalledWith(KEY, {
      lang: CURR_LANG,
      args: [],
    });
  });

  it('translate - should call i18n.t with params', () => {
    const PARAMS = [{ text: 'Hey' }, { val: 'John' }];

    service.translate(KEY, PARAMS);
    expect(mockI18nService.t).toHaveBeenCalledWith(KEY, {
      lang: CURR_LANG,
      args: PARAMS,
    });
  });

  it('action - should return translated action', () => {
    const ACTION_KEY = LocalizationAction.CREATED;

    const translateSpy = jest
      .spyOn(service, 'translate')
      .mockReturnValue('t-object');

    service.action(ACTION_KEY, PARAM_KEY);
    expect(translateSpy.mock.calls).toEqual([
      ['translation.objects.' + PARAM_KEY],
      [
        'translation.actions.' + ACTION_KEY,
        [
          {
            object: expect.any(String),
          },
        ],
      ],
    ]);
  });

  it('notFound - should return translated notFound', () => {
    const PARAM = 'id123';

    const translateSpy = jest
      .spyOn(service, 'translate')
      .mockReturnValue('t-object');

    service.notFound(PARAM_KEY, PARAM);
    expect(translateSpy.mock.calls).toEqual([
      ['translation.objects.' + PARAM_KEY],
      [
        'translation.error.notFound',
        [
          {
            object: expect.any(String),
          },
          {
            param: PARAM,
          },
        ],
      ],
    ]);
  });
});
