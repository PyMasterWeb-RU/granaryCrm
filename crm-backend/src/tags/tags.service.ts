import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  create(label: string, color: string) {
    return this.prisma.tag.create({ data: { label, color } });
  }

  findAll() {
    return this.prisma.tag.findMany();
  }

  delete(id: string) {
    return this.prisma.tag.delete({ where: { id } });
  }

  // Привязка метки
  async assignToDeal(dealId: string, tagId: string) {
    return this.prisma.dealTag.create({ data: { dealId, tagId } });
  }

  async assignToActivity(activityId: string, tagId: string) {
    return this.prisma.activityTag.create({ data: { activityId, tagId } });
  }

  async assignToContact(contactId: string, tagId: string) {
    return this.prisma.contactTag.create({ data: { contactId, tagId } });
  }

  async removeFromDeal(dealId: string, tagId: string) {
    return this.prisma.dealTag.delete({ where: { dealId_tagId: { dealId, tagId } } });
  }

  // Получение меток
  async getTagsForDeal(dealId: string) {
    return this.prisma.dealTag.findMany({
      where: { dealId },
      include: { tag: true },
    });
  }
}
