import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';
import * as Handlebars from 'handlebars';

@Injectable()
export class EmailService {
  constructor(private prisma: PrismaService) {}

  async sendEmail(
    userId: string,
    to: string,
    subject: string,
    body: string,
    templateId?: string,
    attachments?: {
      filename: string;
      path: string;
      contentType: string;
      size: number;
    }[],
  ) {
    const smtp = await this.prisma.emailAccount.findFirst({ where: { userId } });
    if (!smtp) throw new Error('SMTP аккаунт не найден');

    const transporter = nodemailer.createTransport({
      host: smtp.smtpHost,
      port: smtp.smtpPort,
      secure: smtp.smtpSecure,
      auth: {
        user: smtp.email,
        pass: smtp.password,
      },
    });

    try {
      await transporter.sendMail({
        from: smtp.email,
        to,
        subject,
        html: body,
        attachments: attachments?.map(file => ({
          filename: file.filename,
          path: file.path,
          contentType: file.contentType,
        })),
      });

      await this.prisma.emailMessage.create({
        data: {
          to,
          subject,
          body,
          status: 'sent',
          userId,
          templateId,
          attachments,
        },
      });
    } catch (e) {
      await this.prisma.emailMessage.create({
        data: {
          to,
          subject,
          body,
          status: 'failed',
          userId,
          templateId,
          attachments,
        },
      });
      throw e;
    }
  }

  async sendTemplate(data: {
    to: string;
    templateId: string;
    data: Record<string, any>;
  }) {
    const { to, templateId, data: context } = data;

    const template = await this.prisma.emailTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) throw new Error('Шаблон письма не найден');

    const compiled = Handlebars.compile(template.body);
    const html = compiled(context);

    await this.sendEmail(
      template.userId,
      to,
      template.subject || 'Уведомление',
      html,
      templateId,
    );
  }

  async replyTo(userId: string, messageId: string, body: string) {
    const original = await this.prisma.emailInboxMessage.findUnique({ where: { id: messageId } });
    if (!original) throw new Error('Письмо не найдено');

    const subject = original.subject?.startsWith('Re:') ? original.subject : `Re: ${original.subject}`;
    const to = original.from;

    await this.sendEmail(userId, to, subject, body);

    return { status: 'sent', to, subject };
  }

  async forward(userId: string, messageId: string, forwardTo: string, comment?: string) {
    const original = await this.prisma.emailInboxMessage.findUnique({ where: { id: messageId } });
    if (!original) throw new Error('Письмо не найдено');

    const subject = original.subject?.startsWith('Fwd:') ? original.subject : `Fwd: ${original.subject}`;
    const separator = `<hr/><p><b>Пересланное сообщение:</b></p>`;
    const html = `${comment || ''}${separator}<p><b>От:</b> ${original.from}<br><b>Тема:</b> ${original.subject}</p><br>${original.html || original.text}`;

    await this.sendEmail(userId, forwardTo, subject, html);

    return { status: 'forwarded', to: forwardTo, subject };
  }
}
