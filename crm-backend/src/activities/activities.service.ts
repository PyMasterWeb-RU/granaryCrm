import { Injectable, NotFoundException } from '@nestjs/common';
import { AutomationService } from '../automation/automation.service';
import { CustomFieldsService } from '../custom-fields/custom-fields.service';
import { TelegramService } from '../notifications/telegram/telegram.service';
import { PrismaLoggedService } from '../prisma-logged/prisma-logged.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivitiesService {
  constructor(
    private prisma: PrismaService,
    private automationService: AutomationService,
    private telegramService: TelegramService,
    private customFieldsService: CustomFieldsService,
    private prismaLogged: PrismaLoggedService,
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
    parentId?: string;
    tagIds?: string[];
    customFields?: Record<string, any>;
  }) {
    const { customFields, tagIds = [], ...activityData } = data;

    const activity = await this.prisma.activity.create({
      data: {
        ...activityData,
        tags: {
          connect: tagIds.map((id) => ({ id })),
        },
      },
      include: {
        tags: true,
      },
    });

    if (customFields) {
      await this.customFieldsService.saveValues(
        'activity',
        activity.id,
        customFields,
      );
    }

    await this.automationService.run('activity', 'on_create', activity);

    const user = await this.prisma.user.findUnique({
      where: { id: activity.ownerId },
    });

    if (user?.telegramId) {
      await this.telegramService.sendNotification(
        user.id,
        `🗓 Новая задача: ${activity.title}`,
      );
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
        tags: true,
      },
      orderBy: { date: 'asc' },
    });
  }

  findById(id: string) {
    return this.prisma.activity.findUnique({
      where: { id },
      include: {
        account: true,
        contact: true,
        deal: true,
        tags: true,
      },
    });
  }

  async update(
    id: string,
    data: Partial<{
      title: string;
      type: string;
      status: string;
      description?: string;
      date: Date;
      accountId?: string;
      contactId?: string;
      dealId?: string;
      parentId?: string;
      tagIds?: string[];
      customFields?: Record<string, any>;
    }>,
  ) {
    const { customFields, tagIds, ...activityData } = data;

    const old = await this.prisma.activity.findUnique({ where: { id } });
    if (!old) throw new NotFoundException('Активность не найдена');

    const updated = await this.prismaLogged.updateWithLog(
      'activity',
      id,
      old.ownerId,
      activityData,
      () => this.prisma.activity.findUnique({ where: { id } }),
      () =>
        this.prisma.activity.update({
          where: { id },
          data: {
            ...activityData,
            ...(tagIds && {
              tags: {
                set: tagIds.map((id) => ({ id })),
              },
            }),
          },
          include: {
            tags: true,
          },
        }),
    );

    if (customFields) {
      await this.customFieldsService.saveValues('activity', id, customFields);
    }

    await this.automationService.run('activity', 'on_update', updated, old);

    return updated;
  }

  async delete(id: string) {
    const activity = await this.prisma.activity.findUnique({ where: { id } });
    if (!activity) throw new NotFoundException('Задача не найдена');

    return this.prismaLogged.deleteWithLog(
      'activity',
      id,
      activity.ownerId,
      () => this.prisma.activity.delete({ where: { id } }),
    );
  }

  async moveToStatus(id: string, status: string) {
    const activity = await this.prisma.activity.findUnique({ where: { id } });
    if (!activity) throw new NotFoundException('Задача не найдена');

    const updated = await this.prismaLogged.updateWithLog(
      'activity',
      id,
      activity.ownerId,
      { status },
      () => this.prisma.activity.findUnique({ where: { id } }),
      () => this.prisma.activity.update({ where: { id }, data: { status } }),
    );

    await this.automationService.run(
      'activity',
      'on_update',
      updated,
      activity,
    );

    return updated;
  }

  async getKanbanActivities() {
    return this.prisma.activity.findMany({
      where: { type: 'task' },
      include: { tags: true },
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
        tags: true,
      },
      orderBy: { date: 'asc' },
    });
  }

  async getTaskTree(parentId?: string) {
    return this.prisma.activity.findMany({
      where: {
        type: 'task',
        parentId: parentId ?? null,
      },
      include: {
        tags: true,
        subtasks: {
          include: {
            tags: true,
            subtasks: {
              include: { tags: true },
            },
          },
        },
      },
      orderBy: { date: 'asc' },
    });
  }
}
