import { Injectable } from '@nestjs/common';
import { TelegramService } from '../notifications/telegram/telegram.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private telegramService: TelegramService,
  ) {}

  async createComment(data: {
    entity: string;
    entityId: string;
    text: string;
    userId: string;
    fileIds?: string[];
  }) {
    const { entity, entityId, text, userId, fileIds = [] } = data;

    const mentions = await this.extractMentionedUserIds(text);

    const comment = await this.prisma.comment.create({
      data: {
        entity,
        entityId,
        text,
        userId,
        mentions,
        files: {
          connect: fileIds.map((id) => ({ id })),
        },
      },
      include: {
        user: true,
        files: true,
      },
    });

    // 📣 Telegram уведомления упомянутым
    for (const mentionedId of mentions) {
      const mentionedUser = await this.prisma.user.findUnique({
        where: { id: mentionedId },
      });
      if (mentionedUser?.telegramId) {
        await this.telegramService.sendNotification(
          mentionedUser.id,
          `💬 Вас упомянули в комментарии: "${text.slice(0, 150)}..."`,
        );
      }
    }

    return comment;
  }

  async getComments(entity: string, entityId: string) {
    return this.prisma.comment.findMany({
      where: { entity, entityId },
      include: {
        user: true,
        files: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async extractMentionedUserIds(text: string): Promise<string[]> {
    const usernames = (text.match(/@(\w+)/g) || []).map((u) =>
      u.replace('@', ''),
    );

    if (!usernames.length) return [];

    const users = await this.prisma.user.findMany({
      where: {
        name: {
          in: usernames,
          mode: 'insensitive',
        },
      },
      select: { id: true },
    });

    return users.map((u) => u.id);
  }
}
