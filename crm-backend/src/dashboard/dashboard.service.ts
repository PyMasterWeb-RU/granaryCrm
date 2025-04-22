import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getOverview(userId: string) {
    const totalDeals = await this.prisma.deal.count({ where: { ownerId: userId } });
    const wonDeals = await this.prisma.deal.count({
      where: { ownerId: userId, stage: 'Won' },
    });

    const totalDealAmount = await this.prisma.deal.aggregate({
      where: { ownerId: userId },
      _sum: { amount: true },
    });

    const totalTasks = await this.prisma.activity.count({
      where: { ownerId: userId, type: 'task' },
    });

    const completedTasks = await this.prisma.activity.count({
      where: { ownerId: userId, type: 'task', status: 'выполнено' },
    });

    const overdueTasks = await this.prisma.activity.count({
      where: {
        ownerId: userId,
        type: 'task',
        status: 'ожидается',
        date: { lt: new Date() },
      },
    });

    return {
      totalDeals,
      wonDeals,
      totalDealAmount: totalDealAmount._sum.amount || 0,
      totalTasks,
      completedTasks,
      overdueTasks,
    };
  }

  async getDealsByStage(userId: string) {
    const stages = await this.prisma.deal.groupBy({
      by: ['stage'],
      where: { ownerId: userId },
      _count: { stage: true },
    });

    return stages.map((s) => ({ stage: s.stage, count: s._count.stage }));
  }

  async getTasksByStatus(userId: string) {
    const statuses = await this.prisma.activity.groupBy({
      by: ['status'],
      where: { ownerId: userId },
      _count: { status: true },
    });

    return statuses.map((s) => ({ status: s.status, count: s._count.status }));
  }
}
