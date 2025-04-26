import { Module } from '@nestjs/common';
import { InternalService } from './internal.service';
import { InternalController } from './internal.controller';
import { PrismaModule } from 'src/prisma/prisma.module'
import { CustomFieldsModule } from 'src/custom-fields/custom-fields.module'

@Module({
  imports: [
        PrismaModule,
        CustomFieldsModule,
      ],
  providers: [InternalService],
  controllers: [InternalController]
})
export class InternalModule {}
