import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { FolderStorageService } from './folder-storage.service';

@UseGuards(JwtAuthGuard)
@Controller('folders')
export class FolderStorageController {
  constructor(private readonly service: FolderStorageService) {}

  @Post('share/:id')
  async generateLink(@Param('id') id: string, @CurrentUser() user) {
    const folder = await this.service.findUnique({ where: { id } });
    if (!folder || folder.userId !== user.userId)
      throw new NotFoundException('Нет доступа');
    return this.service.generatePublicLink(id, 60); // Публичная ссылка на 1 час
  }

  @Get('public/:link')
  async getByPublic(@Param('link') link: string, @Res() res: Response) {
    const contents = await this.service.getByPublicLink(link);
    res.json(contents);
  }

  @Post()
  create(
    @Body() body: { name: string; parentId?: string },
    @CurrentUser() user,
  ) {
    return this.service.createFolder(body.name, user.userId, body.parentId);
  }

  @Get()
  list(@CurrentUser() user) {
    return this.service.getAllUserFolders(user.userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { name?: string; parentId?: string },
    @CurrentUser() user,
  ) {
    return this.service.updateFolder(id, user.userId, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user) {
    return this.service.deleteFolder(id, user.userId);
  }
}
