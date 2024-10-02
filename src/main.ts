import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LocalizationService } from './localization/localization.service';
import { AllExceptionsFilter } from './utils/filters/all-exception.filter';
import { WinstonConfig } from './assets/configs/winston-logger.config';
import { ValidationPipe } from './utils/pipes/validation.pipe';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
dotenvExpand.expand(dotenv.config());

async function bootstrap() {
  const PORT = process.env.PORT || 6000;
  const app = await NestFactory.create(AppModule, WinstonConfig);
  app.enableCors({
    origin: process.env.CLIENT_API_URL,
    credentials: true,
  });

  const loacalization = app.get<LocalizationService>(LocalizationService);
  app.useGlobalPipes(new ValidationPipe(loacalization));
  app.useGlobalFilters(new AllExceptionsFilter(loacalization));
  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}
bootstrap();
