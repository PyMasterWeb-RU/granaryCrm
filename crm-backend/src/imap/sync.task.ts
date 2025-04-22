import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ImapService } from './imap.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailSyncTask {
  constructor(private imapService: ImapService, private prisma: PrismaService) {}

  @Cron('*/5 * * * *') // каждые 5 минут
  async handleCron() {
    const accounts = await this.prisma.emailAccount.findMany();
    for (const account of accounts) {
      await this.imapService.syncInbox(account.userId);
    }
  }
}
