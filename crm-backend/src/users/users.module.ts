import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module'
import { CustomFieldsModule } from 'src/custom-fields/custom-fields.module'

@Module({
  imports: [
    PrismaModule,
    CustomFieldsModule,
  ],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
