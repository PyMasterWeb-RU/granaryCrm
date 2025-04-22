import { Controller, Post, Body, Param, Get, UseGuards, Res } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Response } from 'express';
import * as fs from 'fs';

@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('generate/:format/:templateId')
  generate(
    @CurrentUser() user,
    @Param('format') format: string,
    @Param('templateId') templateId: string,
    @Body() data: any,
  ) {
    if (format === 'pdf') {
      return this.documentsService.generatePDF(user.userId, templateId, data);
    } else if (format === 'docx') {
      return this.documentsService.generateDOCX(user.userId, templateId, data);
    } else {
      throw new Error('Формат не поддерживается');
    }
  }

  @Get('download/:id')
  async download(@Param('id') id: string, @Res() res: Response) {
    const doc = await this.documentsService.getById(id);
    if (!doc) throw new Error('Документ не найден');

    const stream = fs.createReadStream(doc.filePath);
    res.setHeader('Content-Disposition', `attachment; filename="document.${doc.format}"`);
    stream.pipe(res);
  }
}
