import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@Body() body: { label: string; color: string }) {
    return this.tagsService.create(body.label, body.color);
  }

  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tagsService.delete(id);
  }

  @Post('deal/:dealId/:tagId')
  assignToDeal(@Param('dealId') dealId: string, @Param('tagId') tagId: string) {
    return this.tagsService.assignToDeal(dealId, tagId);
  }

  @Delete('deal/:dealId/:tagId')
  removeFromDeal(@Param('dealId') dealId: string, @Param('tagId') tagId: string) {
    return this.tagsService.removeFromDeal(dealId, tagId);
  }

  @Get('deal/:dealId')
  getTagsForDeal(@Param('dealId') dealId: string) {
    return this.tagsService.getTagsForDeal(dealId);
  }
}
