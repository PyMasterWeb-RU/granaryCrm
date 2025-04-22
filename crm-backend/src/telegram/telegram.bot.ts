import { TelegramService } from '../notifications/telegram/telegram.service'

export function initTelegramBot(telegramService: TelegramService) {
  const bot = telegramService.getBot();

  bot.command('start', async (ctx) => {
    const email = ctx.message.text.split(' ')[1]; // `/start email@example.com`
    const user = await telegramService['prisma'].user.findUnique({ where: { email } });
    if (user) {
      await telegramService['prisma'].user.update({
        where: { email },
        data: { telegramId: `${ctx.chat.id}` },
      });
      ctx.reply('✅ Telegram успешно привязан к вашему аккаунту.');
    } else {
      ctx.reply('❌ Пользователь не найден.');
    }
  });

  bot.launch();
}
