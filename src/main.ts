import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { setupSwagger } from './utils/swagger.util';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Відкидає властивості, яких немає в DTO
      transform: true, // Автоматично трансформує вхідні дані до типів DTO
      transformOptions: {
        enableImplicitConversion: true, // Дозволяє неявне перетворення типів
      },
    }),
  );
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;

  setupSwagger(app);
  await app.listen(port);
  console.log(`Server running on port ${port}`);
}
bootstrap();
