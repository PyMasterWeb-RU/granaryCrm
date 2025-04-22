import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  // Справочник
  getOptions(category: string) {
    return this.prisma.settingOption.findMany({
      where: { category },
      orderBy: { position: 'asc' },
    });
  }

  createOption(category: string, label: string, value: string, position = 0) {
    return this.prisma.settingOption.create({
      data: { category, label, value, position },
    });
  }

  updateOption(id: string, label: string, value: string, position: number) {
    return this.prisma.settingOption.update({
      where: { id },
      data: { label, value, position },
    });
  }

  deleteOption(id: string) {
    return this.prisma.settingOption.delete({ where: { id } });
  }

  // Параметры системы
  async getSystemSettings() {
    return this.prisma.systemSetting.findMany();
  }

  async updateSystemSetting(key: string, value: string) {
    const existing = await this.prisma.systemSetting.findUnique({ where: { key } });
    if (existing) {
      return this.prisma.systemSetting.update({ where: { key }, data: { value } });
    }
    return this.prisma.systemSetting.create({ data: { key, value } });
  }
}
