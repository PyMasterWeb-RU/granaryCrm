import { Module } from '@nestjs/common';
import { ImportExportService } from './import-export.service';
import { ImportExportController } from './import-export.controller';
import { PrismaModule } from 'src/prisma/prisma.module'
import { CustomFieldsModule } from 'src/custom-fields/custom-fields.module'

@Module({
  imports: [
        PrismaModule,
        CustomFieldsModule,
      ],
  providers: [ImportExportService],
  controllers: [ImportExportController]
})
export class ImportExportModule {}
