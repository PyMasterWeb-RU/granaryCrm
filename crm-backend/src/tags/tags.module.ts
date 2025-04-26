import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { PrismaModule } from 'src/prisma/prisma.module'
import { CustomFieldsModule } from 'src/custom-fields/custom-fields.module'

@Module({
  imports: [
        PrismaModule,
        CustomFieldsModule,
      ],
  providers: [TagsService],
  controllers: [TagsController]
})
export class TagsModule {}
