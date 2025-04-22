import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { TelegramService } from '../notifications/telegram/telegram.service';
import { ActivitiesService } from '../activities/activities.service';

// Типы для action и condition
interface AutomationCondition {
  equals?: string | number | boolean;
}

type AutomationAction =
  | {
      type: 'email';
      to?: string;
      templateId: string;
    }
  | {
      type: 'telegram';
      message: string;
    }
  | {
      type: 'create_task';
      title: string;
    };

@Injectable()
export class AutomationService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private telegramService: TelegramService,
    private activitiesService: ActivitiesService,
  ) {}

  async run(entity: string, trigger: string, payload: any, previous?: any) {
    const rules = await this.prisma.automationRule.findMany({
      where: {
        entity,
        trigger,
        enabled: true,
      },
    });

    for (const rule of rules) {
      const condition = rule.condition as AutomationCondition;
      const action = rule.action as AutomationAction;
      const field = rule.field;

      // Проверка условия
      if (field && condition?.equals !== undefined) {
        const newValue = payload[field];
        const oldValue = previous?.[field];

        if (trigger === 'on_update' && newValue === oldValue) continue;
        if (newValue !== condition.equals) continue;
      }

      // Выполнение действия
      switch (action.type) {
        case 'email':
          await this.emailService.sendTemplate({
            to: action.to || payload.email,
            templateId: action.templateId,
            data: payload,
          });
          break;

        case 'telegram':
          await this.telegramService.sendNotification(payload.ownerId, action.message);
          break;

        case 'create_task':
          await this.activitiesService.create({
            title: action.title,
            type: 'task',
            status: 'ожидается',
            ownerId: payload.ownerId,
            date: new Date(Date.now() + 3600 * 1000), // через 1 час
          });
          break;

        default:
          console.warn(`[Automation] Неизвестное действие:`, action);
      }
    }
  }
}
