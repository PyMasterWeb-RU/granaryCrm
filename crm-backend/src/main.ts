import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { PrismaService } from './prisma/prisma.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Парсим куки
  app.use(cookieParser());

  // Префикс для всех маршрутов
  app.setGlobalPrefix('api');

  // CORS для фронтенда
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Валидация DTO
  app.useGlobalPipes(new ValidationPipe());

  // Настройка статических файлов
  const uploadsPath = join(process.cwd(), 'uploads');
  console.log('Serving static files from:', uploadsPath);
  app.useStaticAssets(uploadsPath, { prefix: '/uploads/' });

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