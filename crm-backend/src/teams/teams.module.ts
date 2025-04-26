import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { PrismaModule } from 'src/prisma/prisma.module'
import { CustomFieldsModule } from 'src/custom-fields/custom-fields.module'

@Module({
  imports: [
      PrismaModule,
      CustomFieldsModule,
    ],
  controllers: [TeamsController],
  providers: [TeamsService]
})
export class TeamsModule {}
