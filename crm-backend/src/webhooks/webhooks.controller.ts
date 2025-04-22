import { Controller, Post, Get, Body, Param, Patch, Delete } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Get()
  findAll() {
    return this.webhooksService.findAll();
  }

  @Post()
  create(@Body() body: { url: string; event: string }) {
    return this.webhooksService.create(body);
  }

  @Patch(':id/enable')
  enable(@Param('id') id: string) {
    return this.webhooksService.toggle(id, true);
  }

  @Patch(':id/disable')
  disable(@Param('id') id: string) {
    return this.webhooksService.toggle(id, false);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.webhooksService.delete(id);
  }
}
