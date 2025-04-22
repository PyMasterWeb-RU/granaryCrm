// src/telegram/telegram.module.ts
import { Module } from '@nestjs/common';
import { TelegramService } from '../notifications/telegram/telegram.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [TelegramService, PrismaService],
})
export class TelegramModule {}
