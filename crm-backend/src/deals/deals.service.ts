import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FolderStorageService } from '../folder-storage/folder-storage.service';
import { AutomationService } from '../automation/automation.service';
import { TelegramService } from '../notifications/telegram/telegram.service';
import { CustomFieldsService } from '../custom-fields/custom-fields.service';

@Injectable()
export class DealsService {
  constructor(
    private prisma: PrismaService,
    private folderStorageService: FolderStorageService,
    private automationService: AutomationService,
    private telegramService: TelegramService,
    private customFieldsService: CustomFieldsService, // ⬅️ подключили сервис
  ) {}

  async create(data: {
    title: string;
    amount: number;
    stage: string;
    probability: number;
    closeDate: Date;
    accountId?: string;
    contactId?: string;
    ownerId: string;
    customFields?: Record<string, any>; // ⬅️ добавили поле
  }) {
    const { customFields, ...dealData } = data;

    const deal = await this.prisma.deal.create({
      data: dealData,
      include: { account: true },
    });

    // 💾 Сохраняем кастомные поля
    if (customFields) {
      await this.customFieldsService.saveValues('deal', deal.id, customFields);
    }

    // 📁 Автоматическое создание папки сделки
    if (deal.accountId && deal.account) {
      const accountFolder = await this.folderStorageService.findOrCreateAccountFolder(
        deal.accountId,
        deal.account.name,
        deal.ownerId,
      );

      await this.folderStorageService.findOrCreateDealFolder(
        deal.id,
        deal.title,
        deal.ownerId,
        accountFolder.id,
      );
    }

    // 🔁 Автоматизация
    await this.automationService.run('deal', 'on_create', deal);

    // 📲 Уведомление в Telegram
    const user = await this.prisma.user.findUnique({ where: { id: deal.ownerId } });
    if (user?.telegramId) {
      await this.telegramService.sendNotification(user.id, `📌 Новая сделка: ${deal.title}`);
    }

    return deal;
  }

  findAll() {
    return this.prisma.deal.findMany({
      include: { owner: true, account: true, contact: true },
    });
  }

  findById(id: string) {
    return this.prisma.deal.findUnique({
      where: { id },
      include: { account: true, contact: true },
    });
  }

  async update(id: string, data: Partial<Omit<Parameters<typeof this.create>[0], 'ownerId'>>) {
    const { customFields, ...dealData } = data;

    const deal = await this.prisma.deal.findUnique({ where: { id } });
    if (!deal) throw new NotFoundException('Сделка не найдена');

    const updated = await this.prisma.deal.update({ where: { id }, data: dealData });

    // 💾 Обновление кастомных полей
    if (customFields) {
      await this.customFieldsService.saveValues('deal', id, customFields);
    }

    // 🔁 Автоматизация
    await this.automationService.run('deal', 'on_update', updated, deal);

    return updated;
  }

  delete(id: string) {
    return this.prisma.deal.delete({ where: { id } });
  }

  async moveToStage(id: string, stage: string) {
    const deal = await this.prisma.deal.findUnique({ where: { id } });
    if (!deal) throw new NotFoundException('Сделка не найдена');

    const updated = await this.prisma.deal.update({
      where: { id },
      data: { stage },
    });

    // 🔁 Автоматизация
    await this.automationService.run('deal', 'on_update', updated, deal);

    return updated;
  }

  async getKanbanDeals() {
    return this.prisma.deal.findMany({
      orderBy: { closeDate: 'asc' },
    });
  }
}
