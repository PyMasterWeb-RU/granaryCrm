import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InternalService } from '../notifications/internal/internal.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatsService {
  constructor(
    private prisma: PrismaService,
    private internalService: InternalService,
  ) {}

  // Создание чата
  async createChat(
    userId: string,
    type: 'private' | 'group' | 'broadcast',
    participantIds: string[] = [],
    name?: string,
    isBroadcast: boolean = false,
    dealId?: string,
    accountId?: string,
  ) {
    // Проверка существования сделки или компании
    if (dealId) {
      const deal = await this.prisma.deal.findUnique({ where: { id: dealId } });
      if (!deal) throw new NotFoundException('Сделка не найдена');
    }
    if (accountId) {
      const account = await this.prisma.account.findUnique({
        where: { id: accountId },
      });
      if (!account) throw new NotFoundException('Компания не найдена');
    }

    const chat = await this.prisma.chat.create({
      data: {
        type,
        name,
        creatorId: userId,
        isBroadcast,
        dealId,
        accountId,
        participants: {
          create: [
            { userId }, // Создатель чата автоматически участник
            ...participantIds.map((id) => ({ userId: id })),
          ],
        },
      },
      include: { participants: { include: { user: true } } },
    });

    // Отправка уведомлений участникам
    for (const participant of chat.participants) {
      if (participant.userId !== userId) {
        await this.internalService.notifyUser(participant.userId, {
          type: 'chat',
          message: `Вы были добавлены в чат "${name || 'Личный чат'}"`,
          link: `/chats/${chat.id}`,
        });
      }
    }

    return chat;
  }

  // Получение чатов пользователя
  async getUserChats(userId: string, dealId?: string, accountId?: string) {
    const where: any = {
      participants: {
        some: {
          userId,
          leftAt: null, // Только активные чаты
        },
      },
    };

    if (dealId) where.dealId = dealId;
    if (accountId) where.accountId = accountId;

    return this.prisma.chat.findMany({
      where,
      include: {
        participants: { include: { user: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Последнее сообщение для предпросмотра
        },
        deal: true,
        account: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  // Получение сообщений в чате
  async getChatMessages(chatId: string, userId: string, take = 50, skip = 0) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: { participants: true },
    });
    if (
      !chat ||
      !chat.participants.some((p) => p.userId === userId && !p.leftAt)
    ) {
      throw new ForbiddenException('Вы не являетесь участником этого чата');
    }

    return this.prisma.message.findMany({
      where: { chatId },
      include: {
        sender: true,
        files: true,
        replyTo: { include: { sender: true } }, // Включаем цитируемое сообщение
      },
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    });
  }

  // Отправка сообщения
  async sendMessage(
    chatId: string,
    userId: string,
    content: string,
    fileIds: string[] = [],
    replyToId?: string,
  ) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: { participants: true },
    });
    if (
      !chat ||
      !chat.participants.some((p) => p.userId === userId && !p.leftAt)
    ) {
      throw new ForbiddenException('Вы не являетесь участником этого чата');
    }

    // Проверка цитируемого сообщения
    if (replyToId) {
      const replyTo = await this.prisma.message.findUnique({
        where: { id: replyToId },
      });
      if (!replyTo || replyTo.chatId !== chatId) {
        throw new NotFoundException('Цитируемое сообщение не найдено');
      }
    }

    const message = await this.prisma.message.create({
      data: {
        chatId,
        senderId: userId,
        content,
        files: {
          connect: fileIds.map((id) => ({ id })),
        },
        replyToId,
      },
      include: {
        sender: true,
        files: true,
        replyTo: { include: { sender: true } },
      },
    });

    // Обновление времени последнего сообщения в чате
    await this.prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    // Отправка уведомлений участникам
    for (const participant of chat.participants) {
      if (participant.userId !== userId && !participant.leftAt) {
        await this.internalService.notifyUser(participant.userId, {
          type: 'message',
          message: `Новое сообщение от ${message.sender.name} в чате "${chat.name || 'Личный чат'}"`,
          link: `/chats/${chatId}`,
        });
      }
    }

    return message;
  }

  // Добавление участника в чат
  async addParticipant(chatId: string, userId: string, newUserId: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: { participants: true },
    });
    if (
      !chat ||
      !chat.participants.some((p) => p.userId === userId && !p.leftAt)
    ) {
      throw new ForbiddenException('Вы не являетесь участником этого чата');
    }
    if (chat.type === 'private') {
      throw new ForbiddenException('Нельзя добавлять участников в личный чат');
    }

    const newUser = await this.prisma.user.findUnique({
      where: { id: newUserId },
    });
    if (!newUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    const participant = await this.prisma.chatParticipant.create({
      data: {
        chatId,
        userId: newUserId,
      },
      include: { user: true },
    });

    await this.internalService.notifyUser(newUserId, {
      type: 'chat',
      message: `Вы были добавлены в чат "${chat.name || 'Групповой чат'}"`,
      link: `/chats/${chatId}`,
    });

    return participant;
  }

  // Удаление участника из чата
  async removeParticipant(
    chatId: string,
    userId: string,
    removeUserId: string,
  ) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: { participants: true },
    });
    if (
      !chat ||
      !chat.participants.some((p) => p.userId === userId && !p.leftAt)
    ) {
      throw new ForbiddenException('Вы не являетесь участником этого чата');
    }
    if (chat.creatorId !== userId && userId !== removeUserId) {
      throw new ForbiddenException(
        'Только создатель чата может удалять участников',
      );
    }

    await this.prisma.chatParticipant.updateMany({
      where: { chatId, userId: removeUserId, leftAt: null },
      data: { leftAt: new Date() },
    });

    await this.internalService.notifyUser(removeUserId, {
      type: 'chat',
      message: `Вы были удалены из чата "${chat.name || 'Групповой чат'}"`,
      link: `/chats/${chatId}`,
    });

    return { message: 'Участник удален из чата' };
  }

  // Создание рассылки
  async createBroadcast(
    userId: string,
    name: string,
    recipientType: 'employees' | 'clients',
    messageContent: string,
    fileIds: string[] = [],
  ) {
    let recipientIds: string[] = [];

    if (recipientType === 'employees') {
      const users = await this.prisma.user.findMany({
        where: { role: { name: { not: 'client' } } },
      });
      recipientIds = users.map((u) => u.id);
    } else if (recipientType === 'clients') {
      const contacts = await this.prisma.contact.findMany();
      const users = await this.prisma.user.findMany({
        where: { id: { in: contacts.map((c) => c.ownerId) } },
      });
      recipientIds = users.map((u) => u.id);
    }

    const chat = await this.createChat(
      userId,
      'broadcast',
      recipientIds,
      name,
      true,
    );

    await this.sendMessage(chat.id, userId, messageContent, fileIds);

    return chat;
  }

  // Отметка сообщения как прочитанного
  async markMessageAsRead(chatId: string, messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: { chat: { include: { participants: true } } },
    });
    if (
      !message ||
      message.chatId !== chatId ||
      !message.chat.participants.some((p) => p.userId === userId && !p.leftAt)
    ) {
      throw new ForbiddenException(
        'Вы не можете отметить это сообщение как прочитанное',
      );
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: {
        readBy: { push: userId },
        isRead: message.readBy.length + 1 === message.chat.participants.length,
      },
    });
  }
}
