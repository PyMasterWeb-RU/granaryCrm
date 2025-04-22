import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  create(name: string) {
    return this.prisma.team.create({ data: { name } });
  }

  list() {
    return this.prisma.team.findMany({ include: { users: true } });
  }

  assignUser(userId: string, teamId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { teamId },
    });
  }
}
