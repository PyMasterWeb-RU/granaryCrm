import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { FolderStorageService } from './folder-storage.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('folders')
export class FolderStorageController {
  constructor(private readonly service: FolderStorageService) {}

  @Post()
  create(@Body() body: { name: string; parentId?: string }, @CurrentUser() user) {
    return this.service.createFolder(body.name, user.userId, body.parentId);
  }

  @Get()
  list(@CurrentUser() user) {
    return this.service.getAllUserFolders(user.userId);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user) {
    return this.service.deleteFolder(id, user.userId);
  }
}
