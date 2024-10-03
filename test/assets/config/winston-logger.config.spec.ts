import { WinstonModule } from 'nest-winston';
import { WinstonConfig } from 'src/assets/configs/winston-logger.config';
import { transports, format } from 'winston';

jest.mock('winston', () => ({
  transports: {
    DailyRotateFile: jest.fn(),
    Console: jest.fn(),
  },
  format: {
    combine: jest.fn(() => 'combine'),
    timestamp: jest.fn(() => 'timestamp'),
    json: jest.fn(() => 'json'),
    cli: jest.fn(() => 'cli'),
    splat: jest.fn(() => 'splat'),
    printf: jest.fn(),
  },
}));

jest.mock('nest-winston', () => ({
  WinstonModule: {
    createLogger: jest.fn(() => ({
      log: jest.fn(),
      error: jest.fn(),
    })),
  },
}));

jest.mock('winston-daily-rotate-file');

describe('WinstonConfig', () => {
  it('should create a logger with DailyRotateFile and Console transports', () => {
    const createLoggerSpy = jest.spyOn(WinstonModule, 'createLogger');

    WinstonConfig.logger;

    expect(createLoggerSpy).toHaveBeenCalled();

    expect(transports.DailyRotateFile).toHaveBeenCalledTimes(2);

    expect(transports.DailyRotateFile).toHaveBeenCalledWith({
      filename: `logs/%DATE%/%DATE%-error.log`,
      level: 'error',
      format: 'combine',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxFiles: '30d',
    });

    expect(transports.DailyRotateFile).toHaveBeenCalledWith({
      filename: `logs/%DATE%/%DATE%-combined.log`,
      format: 'combine',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxFiles: '30d',
    });

    expect(transports.Console).toHaveBeenCalledWith({
      format: 'combine',
    });
  });

  it('should use the correct formats in the logger', () => {
    expect(format.combine).toHaveBeenCalledWith(
      format.timestamp(),
      format.json(),
    );

    expect(format.printf).toHaveBeenCalledWith(expect.any(Function));
  });
});
