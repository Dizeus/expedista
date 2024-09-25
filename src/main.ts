import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LocalizationService } from './localization/localization.service';
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
dotenvExpand.expand(dotenv.config());

async function bootstrap() {
  const PORT = process.env.PORT || 6000;
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });
  console.log(process.env.NODE_ENV)
  console.log(process.env.DATABASE_URL);
  const loacalization = app.get<LocalizationService>(LocalizationService);
  await app.listen(PORT, () =>
    console.log(`Server started on port = ${PORT}`),
  );
}
bootstrap();
