import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { PrismaModule } from 'src/prisma/prisma.module'
import { CustomFieldsModule } from 'src/custom-fields/custom-fields.module'

@Module({
  imports: [
      PrismaModule,
      CustomFieldsModule,
    ],
  providers: [SearchService],
  controllers: [SearchController]
})
export class SearchModule {}
