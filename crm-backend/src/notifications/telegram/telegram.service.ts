// src/notifications/telegram.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramService {
  private bot: Telegraf;

  constructor(private prisma: PrismaService) {
    this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
  }

  async sendNotification(userId: string, message: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.telegramId && user.notificationsEnabled) {
      await this.bot.telegram.sendMessage(user.telegramId, message);
    }
  }

  getBot() {
    return this.bot;
  }
}
