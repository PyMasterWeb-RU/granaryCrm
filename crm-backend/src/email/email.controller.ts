import { Controller, Post, Body, UseGuards, Param, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer';
import { extname } from 'path';

@UseGuards(JwtAuthGuard)
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async send(
    @CurrentUser() user: any,
    @Body() body: { to: string; subject: string; content: string; templateId?: string },
  ) {
    return this.emailService.sendEmail(user.userId, body.to, body.subject, body.content, body.templateId);
  }

	@Post('reply/:id')
	async reply(
		@CurrentUser() user,
		@Param('id') id: string,
		@Body('body') body: string,
	) {
		return this.emailService.replyTo(user.userId, id, body);
	}

	@Post('forward/:id')
	async forward(
		@CurrentUser() user,
		@Param('id') id: string,
		@Body() body: { to: string; comment?: string },
	) {
		return this.emailService.forward(user.userId, id, body.to, body.comment);
	}

	@Post('send-with-files')
	@UseInterceptors(FilesInterceptor('attachments', 10, {
		storage: diskStorage({
			destination: './uploads/email',
			filename: (req, file, cb) => {
				const uniqueName = `${Date.now()}-${file.originalname}`;
				cb(null, uniqueName);
			},
		}),
	}))
	async sendWithFiles(
		@CurrentUser() user,
		@Body() body: { to: string; subject: string; content: string },
		@UploadedFiles() files: Express.Multer.File[],
	) {
		const fileData = files.map(f => ({
			filename: f.originalname,
			path: f.path,
			contentType: f.mimetype,
			size: f.size,
		}));

		return this.emailService.sendEmail(user.userId, body.to, body.subject, body.content, undefined, fileData);
	}
}
