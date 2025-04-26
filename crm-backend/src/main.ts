import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Префикс для всех маршрутов
  app.setGlobalPrefix('api');

  // ✅ Разрешение CORS для фронтенда на localhost:3000
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // ✅ Валидация
  app.useGlobalPipes(new ValidationPipe());

  const reflector = app.get(Reflector);
  const prismaService = app.get(PrismaService);

  // ✅ Глобальные Guard'ы
  app.useGlobalGuards(
    new JwtAuthGuard(reflector),
    new RolesGuard(reflector, prismaService),
  );

  await app.listen(4200);
}
bootstrap();
