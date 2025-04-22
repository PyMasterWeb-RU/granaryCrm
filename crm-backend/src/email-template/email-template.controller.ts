import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { EmailTemplateService } from './email-template.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('email-templates')
export class EmailTemplateController {
  constructor(private readonly service: EmailTemplateService) {}

  @Post()
  create(@CurrentUser() user, @Body() body: { name: string; subject: string; body: string }) {
    return this.service.create(user.userId, body);
  }

  @Get()
  findAll(@CurrentUser() user) {
    return this.service.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
