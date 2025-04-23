import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UiConfigService {
  constructor(private prisma: PrismaService) {}

  async getFields(entity: string) {
    return this.prisma.uiFieldConfig.findMany({
      where: { entity },
      orderBy: { order: 'asc' },
    });
  }

  async updateFields(
    entity: string,
    fields: {
      name: string;
      label: string;
      section?: string;
      visible: boolean;
      required: boolean;
      order: number;
    }[],
  ) {
    // Очистим существующие
    await this.prisma.uiFieldConfig.deleteMany({ where: { entity } });

    // Сохраним заново
    for (const field of fields) {
      await this.prisma.uiFieldConfig.create({
        data: { entity, ...field },
      });
    }

    return { success: true };
  }
}
