import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { EmailInboxService } from './email-inbox.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { createReadStream } from 'fs';

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
	async download(@Param('id') id: string, @Param('filename') filename: string) {
		return this.inboxService.getAttachment(id, filename);
	}

	@Get(':id/attachments/:filename')
	async downloadAttachment(@Param('id') id: string, @Param('filename') filename: string, @Res() res) {
		const message = await this.inboxService.getById(id);
		const file = (message.attachments as any[]).find(f => f.filename === filename);
		if (!file) throw new Error('Файл не найден');

		const stream = createReadStream(file.path);
		res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
		stream.pipe(res);
	}

	@Get('search/:q')
	async search(@CurrentUser() user: any, @Param('q') q: string) {
		return this.inboxService.search(user.userId, q);
	}
}
