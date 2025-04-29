import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { startOfMonth, endOfMonth } from 'date-fns';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDealsSummary() {
    return this.prisma.deal.groupBy({
      by: ['stage'],
      _count: { _all: true },
      _sum: { amount: true },
    });
  }

  async getDealsByMonth(): Promise<{ month: string; count: number; sum: number }[]> {
    const now = new Date();
    const from = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 5));
    const to = endOfMonth(now);
  
    return this.prisma.$queryRaw<
      { month: string; count: number; sum: number }[]
    >`
      SELECT
        to_char("closeDate", 'YYYY-MM') AS month,
        COUNT(*) AS count,
        SUM(amount)::float AS sum
      FROM "Deal"
      WHERE "closeDate" BETWEEN ${from.toISOString()} AND ${to.toISOString()}
      GROUP BY month
      ORDER BY month;
    `;
  }  

  async getTasksSummary() {
    return this.prisma.activity.groupBy({
      by: ['status'],
      _count: { _all: true },
    });
  }

  async getUserActivity() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        Deal: { select: { id: true } },
        Activity: { select: { id: true } },
      },
    });
  }
}
