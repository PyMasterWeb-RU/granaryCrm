import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailInboxService {
  constructor(private prisma: PrismaService) {}

  async getInbox(userId: string) {
    return this.prisma.emailInboxMessage.findMany({
      where: { userId, folder: 'inbox' },
      orderBy: { date: 'desc' },
    });
  }

  async getByFolder(userId: string, folder: string) {
    return this.prisma.emailInboxMessage.findMany({
      where: { userId, folder },
      orderBy: { date: 'desc' },
    });
  }

  async getById(id: string) {
    const message = await this.prisma.emailInboxMessage.findUnique({
      where: { id },
    });

    if (!message) throw new Error('Письмо не найдено');
    return message;
  }

  async getAttachment(messageId: string, filename: string) {
    const message = await this.getById(messageId);

    const file = (message.attachments as any[]).find((a) => a.filename === filename);
    if (!file) throw new Error('Файл не найден');

    return {
      filename: file.filename,
      contentType: file.contentType,
      path: file.path,
    };
  }

  async search(userId: string, query: string) {
    return this.prisma.emailInboxMessage.findMany({
      where: {
        userId,
        OR: [
          { subject: { contains: query, mode: 'insensitive' } },
          { from: { contains: query, mode: 'insensitive' } },
          { text: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { date: 'desc' },
    });
  }
}
