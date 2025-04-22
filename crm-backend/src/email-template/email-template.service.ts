import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailTemplateService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, data: { name: string; subject: string; body: string }) {
    return this.prisma.emailTemplate.create({
      data: { ...data, userId },
    });
  }

  findAll(userId: string) {
    return this.prisma.emailTemplate.findMany({
      where: { userId },
    });
  }

  findOne(id: string) {
    return this.prisma.emailTemplate.findUnique({ where: { id } });
  }

  update(id: string, data: Partial<{ name: string; subject: string; body: string }>) {
    return this.prisma.emailTemplate.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.emailTemplate.delete({ where: { id } });
  }
}
