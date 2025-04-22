import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  Res,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ImportExportService } from './import-export.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('import-export')
export class ImportExportController {
  constructor(private readonly service: ImportExportService) {}

  // ---------- ЭКСПОРТ ---------- //

  @Get(':entity/export')
  async exportEntity(@Param('entity') entity: string, @Res() res: Response) {
    const csv = await this.service.exportEntity(entity as any);
    res.setHeader('Content-Disposition', `attachment; filename="${entity}.csv"`);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.send(csv);
  }

  // ---------- ИМПОРТ ---------- //

  @Post(':entity/import')
  @UseInterceptors(FileInterceptor('file'))
  async importEntity(
    @Param('entity') entity: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user,
  ) {
    return this.service.importEntityFromCsv(entity, file.buffer, user.userId);
  }
}
