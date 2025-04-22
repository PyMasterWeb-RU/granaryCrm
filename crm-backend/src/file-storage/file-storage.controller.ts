import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Body,
  Param,
  Get,
  Res,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { FileStorageService } from './file-storage.service';
import { createReadStream } from 'fs';
import { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('files')
export class FileStorageController {
  constructor(private readonly service: FileStorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/files',
      filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
    }),
  }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user,
    @Body() body: {
      folderId?: string;
      accountId?: string;
      dealId?: string;
      contactId?: string;
      taskId?: string;
    },
  ) {
    return this.service.uploadFile(
      user.userId,
      file,
      body.accountId,
      body.dealId,
      body.folderId,
    );
  }

  @Get('download/:id')
  async download(@Param('id') id: string, @Res() res: Response) {
    const file = await this.service.downloadFile(id);
    const stream = createReadStream(file.path);
    res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
    stream.pipe(res);
  }

  @Post('share/:id')
  async generateLink(@Param('id') id: string) {
    return this.service.generatePublicLink(id, 60); // публичная ссылка на 1 час
  }

  @Get('public/:link')
  async getByPublic(@Param('link') link: string, @Res() res: Response) {
    const file = await this.service.getByPublicLink(link);
    const stream = createReadStream(file.path);
    res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
    stream.pipe(res);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser() user) {
    return this.service.deleteFile(user.userId, id);
  }
}
