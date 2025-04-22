import { Module } from '@nestjs/common';
import { AclController } from './acl.controller';

@Module({
  controllers: [AclController]
})
export class AclModule {}
