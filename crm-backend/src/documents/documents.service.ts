import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import * as pdf from 'html-pdf';
import { PrismaService } from '../prisma/prisma.service';
import { Document, Packer, Paragraph } from 'docx';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  // Получить документ по ID
  async getById(id: string) {
    return this.prisma.generatedDocument.findUnique({ where: { id } });
  }

  // Генерация PDF
  async generatePDF(userId: string, templateId: string, data: any) {
    const template = await this.prisma.documentTemplate.findUnique({ where: { id: templateId } });
    if (!template) throw new Error('Шаблон не найден');

    const compile = Handlebars.compile(template.content);
    const html = compile(data);
    const outputPath = path.join('uploads', 'docs', `${Date.now()}.pdf`);

    return new Promise((resolve, reject) => {
      pdf.create(html).toFile(outputPath, async (err, res) => {
        if (err) return reject(err);

        const doc = await this.prisma.generatedDocument.create({
          data: {
            format: 'pdf',
            filePath: res.filename,
            userId,
            templateId,
          },
        });

        resolve(doc);
      });
    });
  }

  // Генерация DOCX
  async generateDOCX(userId: string, templateId: string, data: any) {
    const template = await this.prisma.documentTemplate.findUnique({ where: { id: templateId } });
    if (!template) throw new Error('Шаблон не найден');

    const compile = Handlebars.compile(template.content);
    const text = compile(data);

    const doc = new Document({
      sections: [ {
        properties: {},
        children: [ new Paragraph(text) ],
      } ],
    });

    const buffer = await Packer.toBuffer(doc);
    const filename = path.join('uploads', 'docs', `${Date.now()}.docx`);
    fs.writeFileSync(filename, buffer);

    return this.prisma.generatedDocument.create({
      data: {
        format: 'docx',
        filePath: filename,
        userId,
        templateId,
      },
    });
  }
}
