import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomFieldsService } from '../custom-fields/custom-fields.service';
import { PrismaLoggedService } from '../prisma-logged/prisma-logged.service'; // ✅
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactsService {
  constructor(
    private prisma: PrismaService,
    private customFieldsService: CustomFieldsService,
    private prismaLogged: PrismaLoggedService, // ✅
  ) {}

  async create(data: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    position?: string;
    accountId?: string;
    ownerId: string;
    customFields?: Record<string, any>;
  }) {
    const { customFields, ...contactData } = data;

    const contact = await this.prisma.contact.create({ data: contactData });

    if (customFields) {
      await this.customFieldsService.saveValues(
        'contact',
        contact.id,
        customFields,
      );
    }

    await this.prismaLogged.createWithLog(
      'contact',
      contact.id,
      contact.ownerId,
      async () => contact,
    );

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

    const old = await this.prisma.contact.findUnique({ where: { id } });
    if (!old) throw new NotFoundException('Контакт не найден');

    const updated = await this.prismaLogged.updateWithLog(
      'contact',
      id,
      old.ownerId,
      contactData,
      () => this.prisma.contact.findUnique({ where: { id } }),
      () => this.prisma.contact.update({ where: { id }, data: contactData }),
    );

    if (customFields) {
      await this.customFieldsService.saveValues('contact', id, customFields);
    }

    return updated;
  }

  async delete(id: string) {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    if (!contact) throw new NotFoundException('Контакт не найден');

    return this.prismaLogged.deleteWithLog('contact', id, contact.ownerId, () =>
      this.prisma.contact.delete({ where: { id } }),
    );
  }
}
