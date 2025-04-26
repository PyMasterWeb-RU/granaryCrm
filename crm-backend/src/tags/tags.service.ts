import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  // Создание новой метки
  create(label: string, color: string) {
    return this.prisma.tag.create({ data: { label, color } });
  }

  // Получение всех меток
  findAll() {
    return this.prisma.tag.findMany();
  }

  // Удаление метки
  delete(id: string) {
    return this.prisma.tag.delete({ where: { id } });
  }

  // Привязка метки к сделке
  async assignToDeal(dealId: string, tagId: string) {
    return this.prisma.dealTag.create({ data: { dealId, tagId } });
  }

  // Привязка метки к активности (без отдельной модели)
  async assignToActivity(activityId: string, tagId: string) {
    return this.prisma.activity.update({
      where: { id: activityId },
      data: {
        tags: {
          connect: { id: tagId },
        },
      },
    });
  }

  // Привязка метки к контакту
  async assignToContact(contactId: string, tagId: string) {
    return this.prisma.contactTag.create({ data: { contactId, tagId } });
  }

  // Удаление метки с сделки
  async removeFromDeal(dealId: string, tagId: string) {
    return this.prisma.dealTag.delete({
      where: { dealId_tagId: { dealId, tagId } },
    });
  }

  // Получение меток, привязанных к сделке
  async getTagsForDeal(dealId: string) {
    return this.prisma.dealTag.findMany({
      where: { dealId },
      include: { tag: true },
    });
  }

  // Получение меток, привязанных к активности
  async getTagsForActivity(activityId: string) {
    return this.prisma.activity.findUnique({
      where: { id: activityId },
      select: {
        tags: true,
      },
    });
  }
}
