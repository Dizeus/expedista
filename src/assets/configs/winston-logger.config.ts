import { WinstonModule } from 'nest-winston';
import { formatInfo } from 'src/utils/helpers/format-info';
import { transports, format } from 'winston';
import 'winston-daily-rotate-file';

export const WinstonConfig = {
  logger: WinstonModule.createLogger({
    transports: [
      new transports.DailyRotateFile({
        filename: `logs/%DATE%/%DATE%-error.log`,
        level: 'error',
        format: format.combine(format.timestamp(), format.json()),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: false,
        maxFiles: '30d',
      }),
      new transports.DailyRotateFile({
        filename: `logs/%DATE%/%DATE%-combined.log`,
        format: format.combine(format.timestamp(), format.json()),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: false,
        maxFiles: '30d',
      }),
      new transports.Console({
        format: format.combine(
          format.cli(),
          format.splat(),
          format.timestamp(),
          format.printf(formatInfo),
        ),
      }),
    ],
  }),
};
