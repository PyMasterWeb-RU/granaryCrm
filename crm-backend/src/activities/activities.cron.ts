import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { addDays, addMonths, addWeeks, isBefore } from 'date-fns';
import { TelegramService } from '../notifications/telegram/telegram.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivitiesCron {
  constructor(
    private prisma: PrismaService,
    private telegramService: TelegramService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateRecurringTasks() {
    const today = new Date();

    const recurring = await this.prisma.activity.findMany({
      where: {
        repeat: true,
        date: { lte: today },
        repeatUntil: { gte: today },
      },
    });

    for (const task of recurring) {
      const nextDate =
        task.repeatPattern === 'daily'
          ? addDays(task.date, task.repeatInterval || 1)
          : task.repeatPattern === 'weekly'
            ? addWeeks(task.date, task.repeatInterval || 1)
            : task.repeatPattern === 'monthly'
              ? addMonths(task.date, task.repeatInterval || 1)
              : null;

      if (
        nextDate &&
        isBefore(nextDate, task.repeatUntil || new Date(9999, 0))
      ) {
        await this.prisma.activity.create({
          data: {
            ...task,
            id: undefined, // Новый ID
            date: nextDate,
            repeat: false, // Повтор создаётся один раз
            parentId: task.id,
          },
        });
      }
    }
  }

  @Cron('*/5 * * * *') // проверка каждые 5 минут
  async sendUpcomingReminders() {
    const now = new Date();
    const fiveMinutesLater = new Date(now.getTime() + 5 * 60 * 1000);

    const activities = await this.prisma.activity.findMany({
      where: {
        remindAt: {
          gte: now,
          lte: fiveMinutesLater,
        },
      },
      include: { owner: true },
    });

    for (const activity of activities) {
      if (activity.owner?.telegramId) {
        await this.telegramService.sendNotification(
          activity.owner.id,
          `🔔 Напоминание: "${activity.title}" запланировано на ${activity.date.toLocaleString()}`,
        );
      }
    }
  }
}
