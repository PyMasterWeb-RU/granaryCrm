import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomFieldsService {
  constructor(private prisma: PrismaService) {}

  async getFieldsForEntity(entity: string) {
    return this.prisma.customField.findMany({
      where: { entity },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getValuesForEntity(entity: string, entityId: string) {
    return this.prisma.customFieldValue.findMany({
      where: { entity, entityId },
      include: { field: true },
    });
  }

  async saveValues(entity: string, entityId: string, values: Record<string, any>) {
    const fields = await this.getFieldsForEntity(entity);

    const data = fields.map((field) => ({
      entity,
      entityId,
      fieldId: field.id,
      value: values[field.name]?.toString() || '',
    }));

    // Удалим старые значения
    await this.prisma.customFieldValue.deleteMany({
      where: { entity, entityId },
    });

    return this.prisma.customFieldValue.createMany({ data });
  }
}
