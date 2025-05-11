import { Module } from '@nestjs/common';
import { InternalService } from 'src/notifications/internal/internal.service';
import { InternalModule } from '../notifications/internal/internal.module';
import { PrismaService } from '../prisma/prisma.service';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';

@Module({
  imports: [InternalModule],
  controllers: [ChatsController],
  providers: [ChatsService, PrismaService, InternalService],
})
export class ChatsModule {}
