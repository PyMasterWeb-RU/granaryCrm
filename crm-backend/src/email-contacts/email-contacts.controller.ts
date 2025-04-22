import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { EmailContactsService } from './email-contacts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('email-contacts')
export class EmailContactsController {
  constructor(private readonly service: EmailContactsService) {}

  @Post()
  async create(@CurrentUser() user, @Body() body: { email: string; name?: string; phone?: string; company?: string; notes?: string }) {
    return this.service.create(user.userId, body);
  }

  @Get()
  async list(@CurrentUser() user) {
    return this.service.list(user.userId);
  }

  @Get('search')
  async search(@CurrentUser() user, @Query('q') query: string) {
    return this.service.search(user.userId, query);
  }

  @Delete(':id')
  async delete(@CurrentUser() user, @Param('id') id: string) {
    return this.service.delete(user.userId, id);
  }
}
