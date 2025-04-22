import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class WebhooksService {
  constructor(private prisma: PrismaService) {}

  async triggerEvent(event: string, payload: any) {
    const hooks = await this.prisma.webhook.findMany({
      where: { event, enabled: true },
    });

    for (const hook of hooks) {
      try {
        await axios.post(hook.url, payload);
      } catch (error) {
        console.warn(`[Webhook] Failed for ${hook.url}:`, error.message);
      }
    }
  }

  findAll() {
    return this.prisma.webhook.findMany();
  }

  create(data: { url: string; event: string }) {
    return this.prisma.webhook.create({
      data: {
        ...data,
        enabled: true,
      },
    });
  }

  toggle(id: string, enabled: boolean) {
    return this.prisma.webhook.update({
      where: { id },
      data: { enabled },
    });
  }

  delete(id: string) {
    return this.prisma.webhook.delete({ where: { id } });
  }
}
