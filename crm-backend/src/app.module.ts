import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AccountsModule } from './accounts/accounts.module';
import { AclModule } from './acl/acl.module';
import { AclService } from './acl/acl.service';
import { ActivitiesModule } from './activities/activities.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditLogModule } from './audit-log/audit-log.module';
import { AuthModule } from './auth/auth.module';
import { AutomationModule } from './automation/automation.module';
import { CommentsModule } from './comments/comments.module';
import { ContactsModule } from './contacts/contacts.module';
import { CustomFieldsModule } from './custom-fields/custom-fields.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DealsModule } from './deals/deals.module';
import { DocumentsModule } from './documents/documents.module';
import { EmailContactsModule } from './email-contacts/email-contacts.module';
import { EmailInboxController } from './email-inbox/email-inbox.controller';
import { EmailInboxModule } from './email-inbox/email-inbox.module';
import { EmailTemplateModule } from './email-template/email-template.module';
import { EmailModule } from './email/email.module';
import { FileStorageModule } from './file-storage/file-storage.module';
import { FolderStorageModule } from './folder-storage/folder-storage.module';
import { ImapModule } from './imap/imap.module';
import { ImapService } from './imap/imap.service';
import { ImportExportModule } from './import-export/import-export.module';
import { InternalModule } from './notifications/internal/internal.module';
import { TelegramService } from './notifications/telegram/telegram.service';
import { PrismaLoggedModule } from './prisma-logged/prisma-logged.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReportsModule } from './reports/reports.module';
import { RolesModule } from './roles/roles.module';
import { SearchModule } from './search/search.module';
import { SettingsModule } from './settings/settings.module';
import { TagsModule } from './tags/tags.module';
import { TeamsModule } from './teams/teams.module';
import { TelegramModule } from './telegram/telegram.module';
import { UsersModule } from './users/users.module';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    RolesModule,
    PrismaModule,
    TeamsModule,
    AccountsModule,
    ContactsModule,
    DealsModule,
    ActivitiesModule,
    EmailModule,
    EmailTemplateModule,
    ImapModule,
    EmailInboxModule,
    ScheduleModule.forRoot(),
    EmailContactsModule,
    DocumentsModule,
    FileStorageModule,
    FolderStorageModule,
    SettingsModule,
    ReportsModule,
    TagsModule,
    ImportExportModule,
    TelegramModule,
    WebhooksModule,
    AclModule,
    AutomationModule,
    DashboardModule,
    CustomFieldsModule,
    AuditLogModule,
    PrismaLoggedModule,
    SearchModule,
    CommentsModule,
    InternalModule,
  ],
  controllers: [AppController, EmailInboxController],
  providers: [AppService, ImapService, TelegramService, AclService],
})
export class AppModule {}
