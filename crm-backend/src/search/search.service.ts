import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(query: string) {
    const q = query.toLowerCase();

    const [deals, contacts, accounts, activities, emails] = await Promise.all([
      this.prisma.deal.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { stage: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, title: true, stage: true, createdAt: true },
      }),

      this.prisma.contact.findMany({
        where: {
          OR: [
            { firstName: { contains: q, mode: 'insensitive' } },
            { lastName: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, firstName: true, lastName: true, email: true },
      }),

      this.prisma.account.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
            { website: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, name: true, industry: true },
      }),

      this.prisma.activity.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, title: true, type: true, date: true },
      }),

      this.prisma.emailInboxMessage.findMany({
        where: {
          OR: [
            { subject: { contains: q, mode: 'insensitive' } },
            { from: { contains: q, mode: 'insensitive' } },
            { to: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, subject: true, from: true, to: true, date: true },
      }),
    ]);

    return { deals, contacts, accounts, activities, emails };
  }
}
