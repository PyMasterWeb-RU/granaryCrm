import { Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { InternalService } from './internal.service';

@Controller('internal')
export class InternalController {
  constructor(private readonly service: InternalService) {}

  @Get()
  getMy(@CurrentUser() user) {
    return this.service.getMyNotifications(user.userId);
  }

  @Post('read/:id')
  markRead(@CurrentUser() user, @Param('id') id: string) {
    return this.service.markAsRead(user.userId, id);
  }

  @Post('read-all')
  markAllRead(@CurrentUser() user) {
    return this.service.markAllAsRead(user.userId);
  }

  @Get('unread-count')
  getUnreadCount(@CurrentUser() user) {
    return this.service.unreadCount(user.userId);
  }
}
