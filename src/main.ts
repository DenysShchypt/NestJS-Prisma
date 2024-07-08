import { NestFactory } from '@nestjs/core';

import * as cookieParser from 'cookie-parser';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  await app.listen(4000);
}
bootstrap();
