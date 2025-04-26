// src/telegram/telegram.module.ts
import { Module } from '@nestjs/common';
import { TelegramService } from '../notifications/telegram/telegram.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module'
import { CustomFieldsModule } from 'src/custom-fields/custom-fields.module'

@Module({
  imports: [
      PrismaModule,
      CustomFieldsModule,
    ],
  providers: [TelegramService, PrismaService],
  exports: [TelegramService]
})
export class TelegramModule {}
