import { Module } from '@nestjs/common';
import { AclController } from './acl.controller';
import { PrismaModule } from 'src/prisma/prisma.module'
import { CustomFieldsModule } from 'src/custom-fields/custom-fields.module'
import { AclService } from './acl.service'

@Module({
  imports: [
    PrismaModule,
    CustomFieldsModule,
  ],
  providers: [AclService],
  controllers: [AclController],
  exports: [AclService]
})
export class AclModule {}
