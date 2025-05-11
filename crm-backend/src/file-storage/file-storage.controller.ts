import {
  Body,
  CallHandler,
  Controller,
  Delete,
  ExecutionContext,
  Get,
  Injectable,
  NestInterceptor,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { diskStorage } from 'multer';
import { Observable } from 'rxjs';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { FileStorageService } from './file-storage.service';

@Injectable()
export class Utf8JsonInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    return next.handle();
  }
}

@UseGuards(JwtAuthGuard)
@Controller('files')
export class FileStorageController {
  constructor(private readonly service: FileStorageService) {}

  @Get()
  @UseInterceptors(Utf8JsonInterceptor)
  async list(
    @CurrentUser() user,
    @Query('folderId') folderId?: string,
    @Query('dealId') dealId?: string,
  ) {
    console.log('GET /files called with:', {
      userId: user.userId,
      folderId: folderId ?? 'null',
      dealId: dealId ?? 'null',
    });
    if (dealId) {
      const files = await this.service.listFilesByDealId(user.userId, dealId);
      return files;
    }
    const normalizedFolderId = folderId === '' ? undefined : folderId;
    const files = await this.service.listFiles(user.userId, normalizedFolderId);
    const response = files.map((f) => ({
      id: f.id,
      name: f.name,
      userId: f.userId,
      folderId: f.folderId,
      size: f.size,
      mimeType: f.mimeType,
    }));
    console.log('GET /files response:', response);
    return response;
  }

  @Get('all')
  @UseInterceptors(Utf8JsonInterceptor)
  async listAll(@CurrentUser() user) {
    console.log('GET /files/all called with userId:', user.userId);
    const files = await this.service.listAllFiles(user.userId);
    const response = files.map((f) => ({
      id: f.id,
      name: f.name,
      userId: f.userId,
      folderId: f.folderId,
      size: f.size,
      mimeType: f.mimeType,
    }));
    console.log('GET /files/all response:', response);
    return response;
  }

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      storage: diskStorage({
        destination: './Uploads/files',
        filename: (req, file, cb) => {
          const decodedName = decodeURIComponent(file.originalname);
          cb(null, `${Date.now()}-${decodedName}`);
        },
      }),
    }),
  )
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user,
    @Body()
    body: {
      folderId?: string;
      accountId?: string;
      dealId?: string;
      contactId?: string;
      taskId?: string;
    },
  ) {
    console.log(
      'POST /files/upload called with userId:',
      user.userId,
      'body:',
      body,
      'files:',
      files.map((f) => f.originalname),
    );
    if (!files || files.length === 0) {
      throw new NotFoundException('No files uploaded');
    }
    const results = await Promise.all(
      files.map((file) =>
        this.service.uploadFile(
          user.userId,
          file,
          body.accountId,
          body.dealId,
          body.folderId,
        ),
      ),
    );
    console.log(
      'POST /files/upload response:',
      results.map((result) => ({
        id: result.id,
        name: result.name,
        userId: result.userId,
        folderId: result.folderId,
      })),
    );
    return results;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { name?: string; folderId?: string },
    @CurrentUser() user,
  ) {
    console.log(
      'PATCH /files/:id called with userId:',
      user.userId,
      'id:',
      id,
      'body:',
      body,
    );
    return this.service.updateFile(id, user.userId, body);
  }

  @Get('download/:id')
  async download(@Param('id') id: string, @Res() res: Response) {
    const file = await this.service.downloadFile(id);
    const stream = createReadStream(file.path);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(file.name)}"`,
    );
    res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
    stream.pipe(res);
  }

  @Post('share/:id')
  async generateLink(@Param('id') id: string, @CurrentUser() user) {
    console.log(
      'POST /files/share/:id called with userId:',
      user.userId,
      'id:',
      id,
    );
    const file = await this.service.downloadFile(id);
    if (!file || file.userId !== user.userId) {
      throw new NotFoundException('Нет доступа или файл не найден');
    }
    const result = await this.service.generatePublicLink(id, 60);
    console.log('POST /files/share/:id response:', {
      id,
      publicLink: result.publicLink,
    });
    return result;
  }

  @Get('public/:link')
  async getByPublic(@Param('link') link: string, @Res() res: Response) {
    const file = await this.service.getByPublicLink(link);
    const stream = createReadStream(file.path);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(file.name)}"`,
    );
    res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
    stream.pipe(res);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser() user) {
    console.log(
      'DELETE /files/:id called with userId:',
      user.userId,
      'id:',
      id,
    );
    return this.service.deleteFile(user.userId, id);
  }
}
