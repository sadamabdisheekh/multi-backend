import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import * as express from 'express';
import { SeederService } from './seeder/seeder.service';
import * as dotenv from 'dotenv';
dotenv.config(); // Load .env file

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
  );
  if (process.env.NODE_ENV === 'development') {
    const seeder = app.get(SeederService);
    try {
      await seeder.seed();
      console.log('Database seeding completed!');
    } catch (error) {
      console.error('Database seeding failed:', error);
      process.exit(1);
    }
  }
  app.use('/uploads', express.static('uploads'));
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  await app.listen(3000, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
