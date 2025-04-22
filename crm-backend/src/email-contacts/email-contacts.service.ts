import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailContactsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: { email: string; name?: string; phone?: string; company?: string; notes?: string }) {
    return this.prisma.emailContact.upsert({
      where: {
        userId_email: {
          userId,
          email: data.email,
        },
      },
      update: data,
      create: { ...data, userId },
    });
  }

  async list(userId: string) {
    return this.prisma.emailContact.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
  }

  async search(userId: string, query: string) {
    return this.prisma.emailContact.findMany({
      where: {
        userId,
        OR: [
          { email: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
          { company: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
  }

  async delete(userId: string, id: string) {
    const contact = await this.prisma.emailContact.findUnique({ where: { id } });
    if (contact?.userId !== userId) throw new Error('Нет доступа');
    return this.prisma.emailContact.delete({ where: { id } });
  }
}
