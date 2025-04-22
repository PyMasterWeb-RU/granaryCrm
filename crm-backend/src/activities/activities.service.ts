import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AutomationService } from '../automation/automation.service';
import { TelegramService } from '../notifications/telegram/telegram.service';
import { CustomFieldsService } from '../custom-fields/custom-fields.service';

@Injectable()
export class ActivitiesService {
  constructor(
    private prisma: PrismaService,
    private automationService: AutomationService,
    private telegramService: TelegramService,
    private customFieldsService: CustomFieldsService, // ← добавлено
  ) {}

  async create(data: {
    title: string;
    type: string;
    status: string;
    description?: string;
    date: Date;
    ownerId: string;
    accountId?: string;
    contactId?: string;
    dealId?: string;
    customFields?: Record<string, any>; // ← добавлено
  }) {
    const { customFields, ...activityData } = data;

    const activity = await this.prisma.activity.create({ data: activityData });

    // 💾 Сохраняем кастомные поля
    if (customFields) {
      await this.customFieldsService.saveValues('activity', activity.id, customFields);
    }

    // 🔁 Автоматизация
    await this.automationService.run('activity', 'on_create', activity);

    // 📲 Telegram-уведомление
    const user = await this.prisma.user.findUnique({ where: { id: activity.ownerId } });
    if (user?.telegramId) {
      await this.telegramService.sendNotification(user.id, `🗓 Новая задача: ${activity.title}`);
    }

    return activity;
  }

  findAll() {
    return this.prisma.activity.findMany({
      include: {
        owner: true,
        account: true,
        contact: true,
        deal: true,
      },
      orderBy: { date: 'asc' },
    });
  }

  findById(id: string) {
    return this.prisma.activity.findUnique({
      where: { id },
      include: { account: true, contact: true, deal: true },
    });
  }

  async update(id: string, data: Partial<Omit<Parameters<typeof this.create>[0], 'ownerId'>>) {
    const { customFields, ...activityData } = data;

    const old = await this.prisma.activity.findUnique({ where: { id } });
    if (!old) throw new NotFoundException('Активность не найдена');

    const updated = await this.prisma.activity.update({ where: { id }, data: activityData });

    // 💾 Обновляем кастомные поля
    if (customFields) {
      await this.customFieldsService.saveValues('activity', id, customFields);
    }

    // 🔁 Автоматизация
    await this.automationService.run('activity', 'on_update', updated, old);

    return updated;
  }

  delete(id: string) {
    return this.prisma.activity.delete({ where: { id } });
  }

  async moveToStatus(id: string, status: string) {
    const activity = await this.prisma.activity.findUnique({ where: { id } });
    if (!activity) throw new NotFoundException('Задача не найдена');

    const updated = await this.prisma.activity.update({
      where: { id },
      data: { status },
    });

    // 🔁 Автоматизация
    await this.automationService.run('activity', 'on_update', updated, activity);

    return updated;
  }

  async getKanbanActivities() {
    return this.prisma.activity.findMany({
      orderBy: { date: 'asc' },
    });
  }

  async getCalendar(from: Date, to: Date, userId?: string) {
    return this.prisma.activity.findMany({
      where: {
        date: {
          gte: from,
          lte: to,
        },
        ...(userId && { ownerId: userId }),
      },
      include: {
        account: true,
        contact: true,
        deal: true,
      },
      orderBy: { date: 'asc' },
    });
  }
}
