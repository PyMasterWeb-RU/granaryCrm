import { Module } from '@nestjs/common';
import { ImapService } from './imap.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailSyncTask } from './sync.task'

@Module({
  providers: [ImapService, PrismaService, EmailSyncTask],
  exports: [ImapService],
})
export class ImapModule {}
