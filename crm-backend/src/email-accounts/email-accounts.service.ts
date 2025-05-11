import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailAccountsService {
  constructor(private prisma: PrismaService) {}

  async getMyEmailAccount(userId: string) {
    const emailAccount = await this.prisma.emailAccount.findFirst({
      where: { userId },
    });
    if (!emailAccount) throw new NotFoundException('Email account not found');
    return emailAccount;
  }

  async updateEmailAccount(
    userId: string,
    data: {
      email: string;
      smtpHost: string;
      smtpPort: number;
      smtpSecure: boolean;
      imapHost?: string;
      imapPort?: number;
      imapSecure?: boolean;
      password?: string;
    },
  ) {
    const existing = await this.prisma.emailAccount.findFirst({
      where: { userId },
    });

    if (existing) {
      return this.prisma.emailAccount.update({
        where: { id: existing.id },
        data,
      });
    }

    return this.prisma.emailAccount.create({
      data: {
        user: { connect: { id: userId } },
        ...data,
      },
    });
  }
}
