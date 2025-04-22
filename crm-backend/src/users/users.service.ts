import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CustomFieldsService } from '../custom-fields/custom-fields.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private customFieldsService: CustomFieldsService, // ← добавили
  ) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true },
    });
  }

  async updateName(id: string, name: string, customFields?: Record<string, any>) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Пользователь не найден');

    const updated = await this.prisma.user.update({
      where: { id },
      data: { name },
    });

    // 💾 Обновляем кастомные поля, если есть
    if (customFields) {
      await this.customFieldsService.saveValues('user', id, customFields);
    }

    return updated;
  }

  async changeRole(userId: string, roleName: string) {
    const role = await this.prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });

    return this.prisma.user.update({
      where: { id: userId },
      data: { roleId: role.id },
    });
  }
}
