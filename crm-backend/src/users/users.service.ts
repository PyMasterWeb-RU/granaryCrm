import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomFieldsService } from '../custom-fields/custom-fields.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private customFieldsService: CustomFieldsService,
  ) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        notificationsEnabled: true,
        avatar: true,
      },
    });
  }

  async updateName(
    id: string,
    name: string,
    customFields?: Record<string, any>,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Пользователь не найден');

    const updated = await this.prisma.user.update({
      where: { id },
      data: { name },
    });

    if (customFields) {
      await this.customFieldsService.saveValues('user', id, customFields);
    }

    return updated;
  }

  async updateAvatar(id: string, avatarPath: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Пользователь не найден');

    return this.prisma.user.update({
      where: { id },
      data: { avatar: avatarPath },
    });
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

  async updateNotificationSettings(id: string, notificationsEnabled: boolean) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Пользователь не найден');

    return this.prisma.user.update({
      where: { id },
      data: { notificationsEnabled },
    });
  }

  async getDevices(userId: string) {
    return this.prisma.session.findMany({
      where: { userId },
      orderBy: { lastSeen: 'desc' },
    });
  }

  async logoutDevice(userId: string, sessionId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId, userId },
    });
    if (!session) throw new NotFoundException('Сессия не найдена');

    await this.prisma.session.delete({
      where: { id: sessionId },
    });
    return { message: 'Session terminated' };
  }

  async logoutAllDevices(userId: string, currentToken: string) {
    await this.prisma.session.deleteMany({
      where: { userId, token: { not: currentToken } },
    });
    return { message: 'Logged out from all other devices' };
  }
}
