import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from "@nestjs/common";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.useGlobalPipes(new ValidationPipe());
  const logger = new Logger('Bootstrap');
  await app.listen(3000, '0.0.0.0', (err, address) => {
    if (err) {
      logger.error(`Failed to start server: ${err}`);
      process.exit(1);
    }
    logger.log(`Server listening on ${address}`);
  });
}
bootstrap();
