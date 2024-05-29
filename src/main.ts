import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from "@nestjs/common";
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,

  );
  app.use('/uploads', express.static('uploads'));
  app.useGlobalPipes(new ValidationPipe());
  const logger = new Logger('Bootstrap');
  await app.listen(3000, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
