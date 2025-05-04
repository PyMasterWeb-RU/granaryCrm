import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Res,
  UseGuards,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { EmailInboxService } from './email-inbox.service';

@UseGuards(JwtAuthGuard)
@Controller('inbox')
export class EmailInboxController {
  constructor(private readonly inboxService: EmailInboxService) {}

  @Get()
  getInbox(@CurrentUser() user: any) {
    return this.inboxService.getInbox(user.userId);
  }

  @Get(':folder')
  getFolder(@CurrentUser() user: any, @Param('folder') folder: string) {
    return this.inboxService.getByFolder(user.userId, folder);
  }

  @Get(':id/attachments/:filename')
  async downloadAttachment(
    @Param('id') id: string,
    @Param('filename') filename: string,
    @Res() res,
  ) {
    const file = await this.inboxService.getAttachment(id, filename);
    const stream = createReadStream(file.path);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${file.filename}"`,
    );
    res.setHeader('Content-Type', file.contentType);
    stream.pipe(res);
  }

  @Get('search/:q')
  async search(@CurrentUser() user: any, @Param('q') q: string) {
    return this.inboxService.search(user.userId, q);
  }

  @Patch(':id')
  async updateStatus(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() body: { seen?: boolean; flagged?: boolean; folder?: string },
  ) {
    return this.inboxService.updateStatus(user.userId, id, body);
  }
}
