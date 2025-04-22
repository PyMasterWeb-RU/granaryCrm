import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FolderStorageService } from '../folder-storage/folder-storage.service';
import { CustomFieldsService } from '../custom-fields/custom-fields.service';

@Injectable()
export class AccountsService {
  constructor(
    private prisma: PrismaService,
    private folderStorageService: FolderStorageService,
    private customFieldsService: CustomFieldsService, // ← добавлено
  ) {}

  async create(data: {
    name: string;
    industry?: string;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    ownerId: string;
    customFields?: Record<string, any>; // ← добавлено
  }) {
    const { customFields, ...accountData } = data;

    const account = await this.prisma.account.create({ data: accountData });

    // 📁 Автоматическое создание папки
    await this.folderStorageService.findOrCreateAccountFolder(
      account.id,
      account.name,
      account.ownerId,
    );

    // 💾 Сохраняем кастомные поля
    if (customFields) {
      await this.customFieldsService.saveValues('account', account.id, customFields);
    }

    return account;
  }

  findAll() {
    return this.prisma.account.findMany({ include: { owner: true } });
  }

  findById(id: string) {
    return this.prisma.account.findUnique({ where: { id } });
  }

  async update(
    id: string,
    data: Partial<Omit<Parameters<typeof this.create>[0], 'ownerId'>>,
  ) {
    const { customFields, ...accountData } = data;

    const account = await this.prisma.account.findUnique({ where: { id } });
    if (!account) throw new NotFoundException('Компания не найдена');

    const updated = await this.prisma.account.update({ where: { id }, data: accountData });

    // 💾 Обновляем кастомные поля
    if (customFields) {
      await this.customFieldsService.saveValues('account', id, customFields);
    }

    return updated;
  }

  delete(id: string) {
    return this.prisma.account.delete({ where: { id } });
  }
}
