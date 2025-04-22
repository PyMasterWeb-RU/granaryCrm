import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { parse } from 'csv-parse/sync';
import { createObjectCsvStringifier } from 'csv-writer';
import { Parser } from 'json2csv';

@Injectable()
export class ImportExportService {
  constructor(private prisma: PrismaService) {}

  // ---------- ЭКСПОРТ ---------- //

  async exportAccountsToCsv(): Promise<string> {
    const data = await this.prisma.account.findMany();

    const csv = createObjectCsvStringifier({
      header: [
        { id: 'name', title: 'Name' },
        { id: 'industry', title: 'Industry' },
        { id: 'phone', title: 'Phone' },
        { id: 'email', title: 'Email' },
        { id: 'website', title: 'Website' },
        { id: 'address', title: 'Address' },
      ],
    });

    return csv.getHeaderString() + csv.stringifyRecords(data);
  }

  // универсальный JSON → CSV (для контроллера)
  async exportEntity(entity: 'accounts' | 'contacts' | 'deals' | 'activities'): Promise<string> {
    let data: any[] = [];

    switch (entity) {
      case 'accounts':
        data = await this.prisma.account.findMany();
        break;
      case 'contacts':
        data = await this.prisma.contact.findMany();
        break;
      case 'deals':
        data = await this.prisma.deal.findMany();
        break;
      case 'activities':
        data = await this.prisma.activity.findMany();
        break;
    }

    const parser = new Parser();
    return parser.parse(data);
  }

  // ---------- ИМПОРТ ---------- //

  async importAccountsFromCsv(buffer: Buffer, ownerId: string) {
    const records = parse(buffer.toString(), {
      columns: true,
      skip_empty_lines: true,
    });

    for (const row of records) {
      await this.prisma.account.create({
        data: {
          name: row.Name,
          industry: row.Industry,
          phone: row.Phone,
          email: row.Email,
          website: row.Website,
          address: row.Address,
          ownerId: ownerId,
        },
      });
    }

    return { imported: records.length };
  }

  // универсальный импорт (заглушка)
  async importEntityFromCsv(entity: string, buffer: Buffer, ownerId: string) {
    const records = parse(buffer.toString(), {
      columns: true,
      skip_empty_lines: true,
    });

    switch (entity) {
      case 'accounts':
        for (const row of records) {
          await this.prisma.account.create({
            data: {
              name: row.Name,
              industry: row.Industry,
              phone: row.Phone,
              email: row.Email,
              website: row.Website,
              address: row.Address,
              ownerId,
            },
          });
        }
        break;

      // TODO: реализация импорта для contacts, deals и т.д.
    }

    return { imported: records.length };
  }
}
