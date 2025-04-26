import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PrismaModule } from 'src/prisma/prisma.module'
import { CustomFieldsModule } from 'src/custom-fields/custom-fields.module'
import { TelegramModule } from 'src/telegram/telegram.module'

@Module({
  imports: [
    TelegramModule,
    PrismaModule,
    CustomFieldsModule,
  ],
  providers: [CommentsService],
  controllers: [CommentsController]
})
export class CommentsModule {}
