import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import { subDays } from 'date-fns';
import { AutomationService } from '../automation/automation.service';
import { CustomFieldsService } from '../custom-fields/custom-fields.service';
import { FolderStorageService } from '../folder-storage/folder-storage.service';
import { TelegramService } from '../notifications/telegram/telegram.service';
import { PrismaLoggedService } from '../prisma-logged/prisma-logged.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DealsService {
  constructor(
    private prisma: PrismaService,
    private folderStorageService: FolderStorageService,
    private automationService: AutomationService,
    private telegramService: TelegramService,
    private customFieldsService: CustomFieldsService,
    private prismaLogged: PrismaLoggedService,
  ) {}

  /**
   * Пробует сначала архивный URL, при 404 — падает на текущий daily_json.js.
   * Формирует дату в UTC, чтобы не промахнуться из-за часовых поясов.
   */
  private async fetchJsonUrl(url: string) {
    console.log(`[fetchJsonUrl] Начало запроса к ${url}`);
    try {
      const resp = await axios.get<{
        Valute: Record<string, { Value: number }>;
      }>(url);
      console.log(
        `[fetchJsonUrl] Успешный запрос к ${url}, доступные валюты:`,
        Object.keys(resp.data.Valute),
        'Ответ:',
        JSON.stringify(resp.data.Valute, null, 2),
      );
      return resp.data.Valute;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        console.warn(`[fetchJsonUrl] 404 для ${url}, данные отсутствуют`);
        return null;
      }
      console.error(
        `[fetchJsonUrl] Ошибка запроса к ${url}:`,
        err.message,
        'Статус:',
        err.response?.status,
        'Данные ответа:',
        err.response?.data,
      );
      throw err;
    }
  }

  /**
   * Возвращает курс валюты по данным ЦБ РФ на заданную дату.
   * Сначала пытается взять из архива, если нет — берёт последний.
   */
  async getCBRate(date: Date, currency: string): Promise<number | null> {
    console.log(
      `[getCBRate] Запрос курса для ${currency} на дату ${date.toISOString()}`,
    );
    const maxAttempts = 7;

    for (let i = 0; i < maxAttempts; i++) {
      const current = subDays(date, i);
      const yyyy = current.getUTCFullYear();
      const mm = String(current.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(current.getUTCDate()).padStart(2, '0');
      const archiveUrl = `https://www.cbr-xml-daily.ru/archive/${yyyy}/${mm}/${dd}/daily_json.js`;

      console.log(
        `[getCBRate] Проверка курса за ${yyyy}-${mm}-${dd} (${
          i === 0 ? 'исходная дата' : `-${i} дней`
        })`,
      );

      const rates = await this.fetchJsonUrl(archiveUrl);
      console.log(
        `[getCBRate] Результат запроса за ${yyyy}-${mm}-${dd}:`,
        rates ? Object.keys(rates) : 'нет данных',
      );

      if (rates?.[currency]) {
        console.log(
          `[getCBRate] ✅ Найден курс ${currency} = ${rates[currency].Value} на ${yyyy}-${mm}-${dd}`,
        );
        return rates[currency].Value;
      } else {
        console.log(
          `[getCBRate] Курс для ${currency} не найден в ответе за ${yyyy}-${mm}-${dd}`,
        );
      }
    }

    console.log(`[getCBRate] Проверка текущего курса для ${currency}`);
    const fallback = await this.fetchJsonUrl(
      'https://www.cbr-xml-daily.ru/daily_json.js',
    );
    console.log(
      `[getCBRate] Результат текущего запроса:`,
      fallback ? Object.keys(fallback) : 'нет данных',
    );

    if (fallback?.[currency]) {
      console.log(
        `[getCBRate] ⚠ Использован текущий курс ${currency} = ${fallback[currency].Value}`,
      );
      return fallback[currency].Value;
    } else {
      console.log(`[getCBRate] Текущий курс для ${currency} также не найден`);
    }

    console.error(
      `[getCBRate] ❌ Курс для ${currency} не найден за последние ${maxAttempts} дней + сегодня от ${date.toISOString()}`,
    );
    return null;
  }

  async create(data: {
    title: string;
    amount: number;
    stage: string;
    probability: number;
    closeDate: Date | string;
    dealType?: string;
    product?: string;
    packaging?: string;
    deliveryType?: string;
    transport?: string;
    currency?: string;
    price?: number;
    accountId?: string;
    contactId?: string;
    ownerId: string;
    customFields?: Record<string, any>;
  }) {
    // Преобразуем closeDate в строку для логирования
    const closeDateLog =
      data.closeDate instanceof Date
        ? data.closeDate.toISOString()
        : typeof data.closeDate === 'string'
          ? data.closeDate
          : 'не указано';

    console.log(`[create] Создание сделки:`, {
      title: data.title,
      currency: data.currency,
      closeDate: closeDateLog,
    });

    // Преобразуем closeDate в Date для дальнейшей обработки
    const closeDate =
      typeof data.closeDate === 'string'
        ? new Date(data.closeDate)
        : data.closeDate;

    // Проверяем валидность даты
    if (closeDate && isNaN(closeDate.getTime())) {
      console.error(`[create] Неверный формат closeDate: ${data.closeDate}`);
      throw new BadRequestException('Invalid closeDate format');
    }

    // Переименовываем product в nomenclature для Prisma
    const { customFields, product, ...dealData } = data;
    const prismaData = {
      ...dealData,
      closeDate,
      nomenclature: product,
    };

    // Получаем курс, если указаны валюта и дата
    let cbRate: number | null = null;
    if (dealData.currency && closeDate) {
      console.log(
        `[create] Запрос курса для ${dealData.currency} на ${closeDate.toISOString()}`,
      );
      cbRate = await this.getCBRate(closeDate, dealData.currency);
      console.log(`[create] Курс ${dealData.currency} = ${cbRate}`);
    }

    console.log(`[create] Создание записи в базе для сделки:`, prismaData);
    const deal = await this.prisma.deal.create({
      data: {
        ...prismaData,
        cbRate,
      },
      include: { account: true },
    });

    console.log(`[create] Сделка создана:`, { id: deal.id, title: deal.title });

    if (customFields) {
      console.log(
        `[create] Сохранение пользовательских полей для сделки ${deal.id}`,
      );
      await this.customFieldsService.saveValues('deal', deal.id, customFields);
      console.log(
        `[create] Пользовательские поля сохранены для сделки ${deal.id}`,
      );
    }

    if (deal.accountId && deal.account) {
      console.log(`[create] Создание папок для аккаунта и сделки ${deal.id}`);
      const accountFolder =
        await this.folderStorageService.findOrCreateAccountFolder(
          deal.accountId,
          deal.account.name,
          deal.ownerId,
        );
      await this.folderStorageService.findOrCreateDealFolder(
        deal.id,
        deal.title,
        deal.ownerId,
        deal.accountId, // Исправлено: передаем accountId вместо accountFolder.id
      );
      console.log(`[create] Папки созданы для сделки ${deal.id}`);
    }

    console.log(`[create] Выполнение автоматизаций для сделки ${deal.id}`);
    await this.automationService.run('deal', 'on_create', deal);
    console.log(`[create] Автоматизации выполнены для сделки ${deal.id}`);

    const user = await this.prisma.user.findUnique({
      where: { id: deal.ownerId },
    });
    if (user?.telegramId) {
      console.log(
        `[create] Отправка уведомления в Telegram для пользователя ${user.id}`,
      );
      await this.telegramService.sendNotification(
        user.id,
        `📌 Новая сделка: ${deal.title}`,
      );
      console.log(
        `[create] Уведомление отправлено в Telegram для пользователя ${user.id}`,
      );
    }

    return deal;
  }

  async update(
    id: string,
    data: Partial<Omit<Parameters<typeof this.create>[0], 'ownerId'>>,
  ) {
    console.log(`[update] Обновление сделки ${id}:`, data);
    const { customFields, product, ...dealData } = data;
    console.log(`[update] Поиск сделки ${id} в базе`);
    const oldDeal = await this.prisma.deal.findUnique({ where: { id } });
    if (!oldDeal) {
      console.error(`[update] Сделка ${id} не найдена`);
      throw new NotFoundException('Сделка не найдена');
    }

    // Преобразуем closeDate в Date, если передана строка
    const newDate =
      typeof dealData.closeDate === 'string'
        ? new Date(dealData.closeDate)
        : (dealData.closeDate ?? oldDeal.closeDate);

    // Проверяем валидность даты
    if (newDate && isNaN(newDate.getTime())) {
      console.error(
        `[update] Неверный формат closeDate: ${dealData.closeDate}`,
      );
      throw new BadRequestException('Invalid closeDate format');
    }

    // Переименовываем product в nomenclature для Prisma
    const prismaData = {
      ...dealData,
      nomenclature: product,
    };

    // Если поменяли дату или валюту — пересчитываем курс
    let cbRate = oldDeal.cbRate;
    const newCurrency = dealData.currency ?? oldDeal.currency;
    if (newDate && newCurrency) {
      console.log(
        `[update] Запрос курса для ${newCurrency} на ${newDate.toISOString()} для сделки ${id}`,
      );
      cbRate = await this.getCBRate(newDate, newCurrency);
      console.log(`[update] Курс ${newCurrency} = ${cbRate} для сделки ${id}`);
    }

    console.log(
      `[update] Обновление записи в базе для сделки ${id}:`,
      prismaData,
    );
    const updated = await this.prismaLogged.updateWithLog(
      'deal',
      id,
      oldDeal.ownerId,
      { ...prismaData, closeDate: newDate, cbRate },
      () => Promise.resolve(oldDeal),
      () =>
        this.prisma.deal.update({
          where: { id },
          data: { ...prismaData, closeDate: newDate, cbRate },
        }),
    );

    console.log(`[update] Сделка ${id} обновлена:`, updated);

    if (customFields) {
      console.log(
        `[update] Сохранение пользовательских полей для сделки ${id}`,
      );
      await this.customFieldsService.saveValues('deal', id, customFields);
      console.log(`[update] Пользовательские поля сохранены для сделки ${id}`);
    }

    console.log(`[update] Выполнение автоматизаций для сделки ${id}`);
    await this.automationService.run('deal', 'on_update', updated, oldDeal);
    console.log(`[update] Автоматизации выполнены для сделки ${id}`);

    return updated;
  }

  findAll() {
    console.log(`[findAll] Запрос всех сделок`);
    return this.prisma.deal.findMany({
      include: { owner: true, account: true, contact: true },
    });
  }

  findById(id: string) {
    console.log(`[findById] Запрос сделки ${id}`);
    return this.prisma.deal.findUnique({
      where: { id },
      include: { account: true, contact: true },
    });
  }

  async delete(id: string) {
    console.log(`[delete] Удаление сделки ${id}`);
    console.log(`[delete] Поиск сделки ${id} в базе`);
    const deal = await this.prisma.deal.findUnique({ where: { id } });
    if (!deal) {
      console.error(`[delete] Сделка ${id} не найдена`);
      throw new NotFoundException('Сделка не найдена');
    }
    console.log(`[delete] Удаление записи для сделки ${id}`);
    return this.prismaLogged.deleteWithLog('deal', id, deal.ownerId, () =>
      this.prisma.deal.delete({ where: { id } }),
    );
  }

  async moveToStage(id: string, stage: string) {
    console.log(`[moveToStage] Перемещение сделки ${id} в этап ${stage}`);
    console.log(`[moveToStage] Поиск сделки ${id} в базе`);
    const deal = await this.prisma.deal.findUnique({ where: { id } });
    if (!deal) {
      console.error(`[moveToStage] Сделка ${id} не найдена`);
      throw new NotFoundException('Сделка не найдена');
    }
    console.log(`[moveToStage] Обновление этапа для сделки ${id}`);
    const updated = await this.prismaLogged.updateWithLog(
      'deal',
      id,
      deal.ownerId,
      { stage },
      () => this.prisma.deal.findUnique({ where: { id } }),
      () => this.prisma.deal.update({ where: { id }, data: { stage } }),
    );
    console.log(`[moveToStage] Выполнение автоматизаций для сделки ${id}`);
    await this.automationService.run('deal', 'on_update', updated, deal);
    console.log(`[moveToStage] Сделка ${id} перемещена в этап ${stage}`);
    return updated;
  }

  async getKanbanDeals() {
    console.log(`[getKanbanDeals] Запрос сделок для канбана`);
    return this.prisma.deal.findMany({
      orderBy: { closeDate: 'asc' },
    });
  }
}
