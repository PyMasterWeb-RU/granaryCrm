import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CommentsService } from './comments.service';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // 🔍 Получение комментариев по сущности
  @Get(':entity/:id')
  async getComments(@Param('entity') entity: string, @Param('id') id: string) {
    return this.commentsService.getComments(entity, id);
  }

  // 📝 Создание комментария
  @Post(':entity/:id')
  async createComment(
    @Param('entity') entity: string,
    @Param('id') id: string,
    @Body() body: { text: string; fileIds?: string[] },
    @CurrentUser() user,
  ) {
    return this.commentsService.createComment({
      entity,
      entityId: id,
      text: body.text,
      fileIds: body.fileIds || [],
      userId: user.userId,
    });
  }
}
