import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { simpleParser } from 'mailparser';
import { ImapFlow } from 'imapflow';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class ImapService {
  constructor(private prisma: PrismaService) {}

  async syncInbox(userId: string) {
    const account = await this.prisma.emailAccount.findFirst({ where: { userId } });
    if (!account) throw new Error('Нет IMAP учётной записи');

    const client = new ImapFlow({
      host: account.smtpHost.replace('smtp', 'imap'),
      port: 993,
      secure: true,
      auth: {
        user: account.email,
        pass: account.password,
      },
    });

    await client.connect();
    await client.mailboxOpen('INBOX');

    const uploadDir = join(process.cwd(), 'uploads', 'email');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    for await (const msg of client.fetch('1:*', { envelope: true, source: true, flags: true, uid: true })) {
      const parsed = await simpleParser(msg.source);
      const exists = await this.prisma.emailInboxMessage.findFirst({
        where: { messageId: parsed.messageId || '' },
      });

      if (exists) continue;

      const attachmentList = [];

      for (const att of parsed.attachments || []) {
        const filePath = join('uploads', 'email', att.filename);
        writeFileSync(filePath, att.content);

        attachmentList.push({
          filename: att.filename,
          contentType: att.contentType,
          size: att.size,
          path: filePath,
        });
      }

      await this.prisma.emailInboxMessage.create({
        data: {
          userId,
          from: parsed.from?.text || '',
          to: parsed.to?.text || '',
          subject: parsed.subject || '',
          text: parsed.text || '',
          html: parsed.html || '',
          date: parsed.date || new Date(),
          folder: 'inbox',
          messageId: parsed.messageId || '',
          seen: msg.flags?.includes('\\Seen') || false,
          flagged: msg.flags?.includes('\\Flagged') || false,
          attachments: attachmentList,
        },
      });
    }

    await client.logout();
  }
}
