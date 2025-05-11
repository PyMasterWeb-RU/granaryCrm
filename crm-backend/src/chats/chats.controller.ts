import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ChatsService } from './chats.service';

@UseGuards(JwtAuthGuard)
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  create(
    @CurrentUser() user: any,
    @Body()
    body: {
      type: 'private' | 'group' | 'broadcast';
      participantIds: string[];
      name?: string;
      isBroadcast?: boolean;
      dealId?: string;
      accountId?: string;
    },
  ) {
    return this.chatsService.createChat(
      user.userId,
      body.type,
      body.participantIds,
      body.name,
      body.isBroadcast || false,
      body.dealId,
      body.accountId,
    );
  }

  @Get()
  getUserChats(
    @CurrentUser() user: any,
    @Query('dealId') dealId?: string,
    @Query('accountId') accountId?: string,
  ) {
    return this.chatsService.getUserChats(user.userId, dealId, accountId);
  }

  @Get(':id/messages')
  getChatMessages(
    @Param('id') chatId: string,
    @CurrentUser() user: any,
    @Query('take') take: number = 50,
    @Query('skip') skip: number = 0,
  ) {
    return this.chatsService.getChatMessages(chatId, user.userId, take, skip);
  }

  @Post(':id/messages')
  sendMessage(
    @Param('id') chatId: string,
    @CurrentUser() user: any,
    @Body() body: { content: string; fileIds?: string[]; replyToId?: string },
  ) {
    return this.chatsService.sendMessage(
      chatId,
      user.userId,
      body.content,
      body.fileIds,
      body.replyToId,
    );
  }

  @Post(':id/participants')
  addParticipant(
    @Param('id') chatId: string,
    @CurrentUser() user: any,
    @Body() body: { userId: string },
  ) {
    return this.chatsService.addParticipant(chatId, user.userId, body.userId);
  }

  @Delete(':id/participants/:userId')
  removeParticipant(
    @Param('id') chatId: string,
    @Param('userId') removeUserId: string,
    @CurrentUser() user: any,
  ) {
    return this.chatsService.removeParticipant(
      chatId,
      user.userId,
      removeUserId,
    );
  }

  @Post('broadcast')
  createBroadcast(
    @CurrentUser() user: any,
    @Body()
    body: {
      name: string;
      recipientType: 'employees' | 'clients';
      messageContent: string;
      fileIds?: string[];
    },
  ) {
    return this.chatsService.createBroadcast(
      user.userId,
      body.name,
      body.recipientType,
      body.messageContent,
      body.fileIds,
    );
  }

  @Patch(':id/messages/:messageId/read')
  markMessageAsRead(
    @Param('id') chatId: string,
    @Param('messageId') messageId: string,
    @CurrentUser() user: any,
  ) {
    return this.chatsService.markMessageAsRead(chatId, messageId, user.userId);
  }
}
