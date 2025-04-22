import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CustomFieldsService } from '../custom-fields/custom-fields.service';

@Injectable()
export class ContactsService {
  constructor(
    private prisma: PrismaService,
    private customFieldsService: CustomFieldsService, // ← добавлено
  ) {}

  async create(data: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    position?: string;
    accountId?: string;
    ownerId: string;
    customFields?: Record<string, any>; // ← добавлено
  }) {
    const { customFields, ...contactData } = data;

    const contact = await this.prisma.contact.create({ data: contactData });

    // 💾 Сохраняем кастомные поля
    if (customFields) {
      await this.customFieldsService.saveValues('contact', contact.id, customFields);
    }

    return contact;
  }

  findAll() {
    return this.prisma.contact.findMany({
      include: { account: true, owner: true },
    });
  }

  findById(id: string) {
    return this.prisma.contact.findUnique({
      where: { id },
      include: { account: true },
    });
  }

  async update(
    id: string,
    data: Partial<Omit<Parameters<typeof this.create>[0], 'ownerId'>>,
  ) {
    const { customFields, ...contactData } = data;

    const contact = await this.prisma.contact.findUnique({ where: { id } });
    if (!contact) throw new NotFoundException('Контакт не найден');

    const updated = await this.prisma.contact.update({ where: { id }, data: contactData });

    // 💾 Обновление кастомных полей
    if (customFields) {
      await this.customFieldsService.saveValues('contact', id, customFields);
    }

    return updated;
  }

  delete(id: string) {
    return this.prisma.contact.delete({ where: { id } });
  }
}
