import { Module } from '@nestjs/common';
import { EmailInboxController } from './email-inbox.controller';
import { PrismaService } from '../prisma/prisma.service';
import { EmailInboxService } from './email-inbox.service';

@Module({
  controllers: [EmailInboxController],
  providers: [EmailInboxService, PrismaService],
})
export class EmailInboxModule {}
