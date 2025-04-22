import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AclService } from './acl.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('acl')
export class AclController {
  constructor(private readonly aclService: AclService) {}

  /**
   * Поделиться доступом к сущности
   */
  @Post('share')
  async shareAccess(
    @CurrentUser() user,
    @Body() body: { entity: string; entityId: string; userId: string; canEdit?: boolean },
  ) {
    return this.aclService.shareAccess(body.entity, body.entityId, body.userId, body.canEdit || false);
  }

  /**
   * Удалить доступ к сущности
   */
  @Delete('revoke')
  async revokeAccess(
    @CurrentUser() user,
    @Body() body: { entity: string; entityId: string; userId: string },
  ) {
    return this.aclService.revokeAccess(body.entity, body.entityId, body.userId);
  }

  /**
   * Получить список пользователей, которым предоставлён доступ
   */
  @Get(':entity/:entityId')
  async listAccess(
    @Param('entity') entity: string,
    @Param('entityId') entityId: string,
  ) {
    return this.aclService.listAccess(entity, entityId);
  }
}
