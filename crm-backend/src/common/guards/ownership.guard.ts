import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private prisma: PrismaService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;
    const accountId = request.params.id;

    const entityType = this.reflector.get<string>('entity', context.getHandler());

    if (entityType === 'account') {
      const account = await this.prisma.account.findUnique({ where: { id: accountId } });
      if (!account || account.ownerId !== userId) {
        throw new ForbiddenException('Нет доступа к этой компании');
      }
    }

		if (entityType === 'contact') {
			const contact = await this.prisma.contact.findUnique({ where: { id: accountId } });
			if (!contact || contact.ownerId !== userId) {
				throw new ForbiddenException('Нет доступа к контакту');
			}
		}
		
		if (entityType === 'deal') {
			const deal = await this.prisma.deal.findUnique({ where: { id: accountId } });
			if (!deal || deal.ownerId !== userId) {
				throw new ForbiddenException('Нет доступа к сделке');
			}
		}

		if (entityType === 'activity') {
			const activity = await this.prisma.activity.findUnique({ where: { id: accountId } });
			if (!activity || activity.ownerId !== userId) {
				throw new ForbiddenException('Нет доступа к активности');
			}
		}		

    // можно добавить другие entityType: 'deal', 'contact' и т.д.

    return true;
  }
}
