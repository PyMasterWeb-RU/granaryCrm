import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomFieldsService } from '../custom-fields/custom-fields.service';
import { FolderStorageService } from '../folder-storage/folder-storage.service';
import { PrismaLoggedService } from '../prisma-logged/prisma-logged.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(
    private prisma: PrismaService,
    private folderStorageService: FolderStorageService,
    private customFieldsService: CustomFieldsService,
    private prismaLogged: PrismaLoggedService,
  ) {}

  async create(data: {
    name: string;
    industry?: string;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    inn?: string;
    ogrn?: string;
    kpp?: string;
    ownerId: string;
    customFields?: Record<string, any>;
  }) {
    const { customFields, ...accountData } = data;

    const account = await this.prisma.account.create({ data: accountData });

    await this.folderStorageService.findOrCreateAccountFolder(
      account.id,
      account.name,
      account.ownerId,
    );

    if (customFields) {
      await this.customFieldsService.saveValues(
        'account',
        account.id,
        customFields,
      );
    }

    await this.prismaLogged.createWithLog(
      'account',
      account.id,
      account.ownerId,
      async () => account,
    );

    return account;
  }

  findAll() {
    return this.prisma.account.findMany({ include: { owner: true } });
  }

  async findById(id: string) {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: { owner: true },
    });
    if (!account) {
      throw new NotFoundException('Компания не найдена');
    }
    return account;
  }

  async getMyAccount(userId: string) {
    const account = await this.prisma.account.findFirst({
      where: { ownerId: userId },
    });
    if (!account) throw new NotFoundException('Компания не найдена');
    return account;
  }

  async updateMyAccount(
    userId: string,
    data: Partial<{
      name: string;
      industry: string;
      phone: string;
      email: string;
      website: string;
      address: string;
      inn: string;
      ogrn: string;
      kpp: string;
    }>,
  ) {
    const account = await this.prisma.account.findFirst({
      where: { ownerId: userId },
    });
    if (!account) throw new NotFoundException('Компания не найдена');

    return this.prismaLogged.updateWithLog(
      'account',
      account.id,
      account.ownerId,
      data,
      () => this.prisma.account.findUnique({ where: { id: account.id } }),
      () => this.prisma.account.update({ where: { id: account.id }, data }),
    );
  }

  async update(
    id: string,
    data: Partial<Omit<Parameters<typeof this.create>[0], 'ownerId'>>,
  ) {
    const { customFields, ...accountData } = data;

    const account = await this.prisma.account.findUnique({ where: { id } });
    if (!account) throw new NotFoundException('Компания не найдена');

    const updated = await this.prismaLogged.updateWithLog(
      'account',
      id,
      account.ownerId,
      accountData,
      () => this.prisma.account.findUnique({ where: { id } }),
      () => this.prisma.account.update({ where: { id }, data: accountData }),
    );

    if (customFields) {
      await this.customFieldsService.saveValues('account', id, customFields);
    }

    return updated;
  }

  async delete(id: string) {
    const account = await this.prisma.account.findUnique({ where: { id } });
    if (!account) throw new NotFoundException('Компания не найдена');

    return this.prismaLogged.deleteWithLog('account', id, account.ownerId, () =>
      this.prisma.account.delete({ where: { id } }),
    );
  }
}
