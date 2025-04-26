// src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import * as cookieParser from 'cookie-parser'; // ← импортируем
import { AppModule } from './app.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Парсим куки, чтобы res.cookie()/req.cookies работали
  app.use(cookieParser()); // ← добавляем

  // Префикс для всех маршрутов
  app.setGlobalPrefix('api');

  // CORS для фронтенда на localhost:3000, с куки
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Валидация DTO
  app.useGlobalPipes(new ValidationPipe());

  const reflector = app.get(Reflector);
  const prismaService = app.get(PrismaService);

  // Глобальные guard'ы: JWT + роли
  app.useGlobalGuards(
    new JwtAuthGuard(reflector),
    new RolesGuard(reflector, prismaService),
  );

  await app.listen(4200);
}
bootstrap();
