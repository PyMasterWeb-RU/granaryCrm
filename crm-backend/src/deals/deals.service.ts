import { Injectable, NotFoundException } from '@nestjs/common';
import { AutomationService } from '../automation/automation.service';
import { CustomFieldsService } from '../custom-fields/custom-fields.service';
import { FolderStorageService } from '../folder-storage/folder-storage.service';
import { TelegramService } from '../notifications/telegram/telegram.service';
import { PrismaLoggedService } from '../prisma-logged/prisma-logged.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DealsService {
  constructor(
    private prisma: PrismaService,
    private folderStorageService: FolderStorageService,
    private automationService: AutomationService,
    private telegramService: TelegramService,
    private customFieldsService: CustomFieldsService,
    private prismaLogged: PrismaLoggedService, // 👈 подключили логгер
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
    customFields?: Record<string, any>;
  }) {
    const { customFields, ...dealData } = data;

    const deal = await this.prisma.deal.create({
      data: dealData,
      include: { account: true },
    });

    if (customFields) {
      await this.customFieldsService.saveValues('deal', deal.id, customFields);
    }

    if (deal.accountId && deal.account) {
      const accountFolder =
        await this.folderStorageService.findOrCreateAccountFolder(
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

    await this.automationService.run('deal', 'on_create', deal);

    const user = await this.prisma.user.findUnique({
      where: { id: deal.ownerId },
    });
    if (user?.telegramId) {
      await this.telegramService.sendNotification(
        user.id,
        `📌 Новая сделка: ${deal.title}`,
      );
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

  async update(
    id: string,
    data: Partial<Omit<Parameters<typeof this.create>[0], 'ownerId'>>,
  ) {
    const { customFields, ...dealData } = data;

    const oldDeal = await this.prisma.deal.findUnique({ where: { id } });
    if (!oldDeal) throw new NotFoundException('Сделка не найдена');

    const updated = await this.prismaLogged.updateWithLog(
      'deal',
      id,
      oldDeal.ownerId,
      dealData,
      () => Promise.resolve(oldDeal), // переиспользуем
      () => this.prisma.deal.update({ where: { id }, data: dealData }),
    );

    if (customFields) {
      await this.customFieldsService.saveValues('deal', id, customFields);
    }

    await this.automationService.run('deal', 'on_update', updated, oldDeal);

    return updated;
  }

  async delete(id: string) {
    const deal = await this.prisma.deal.findUnique({ where: { id } });
    if (!deal) throw new NotFoundException('Сделка не найдена');

    return this.prismaLogged.deleteWithLog('deal', id, deal.ownerId, () =>
      this.prisma.deal.delete({ where: { id } }),
    );
  }

  async moveToStage(id: string, stage: string) {
    const deal = await this.prisma.deal.findUnique({ where: { id } });
    if (!deal) throw new NotFoundException('Сделка не найдена');

    const updated = await this.prismaLogged.updateWithLog(
      'deal',
      id,
      deal.ownerId,
      { stage },
      () => this.prisma.deal.findUnique({ where: { id } }),
      () => this.prisma.deal.update({ where: { id }, data: { stage } }),
    );

    await this.automationService.run('deal', 'on_update', updated, deal);

    return updated;
  }

  async getKanbanDeals() {
    return this.prisma.deal.findMany({
      orderBy: { closeDate: 'asc' },
    });
  }
}
