import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,

  );
  app.useGlobalPipes(new ValidationPipe());
  const logger = new Logger('Bootstrap');
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
