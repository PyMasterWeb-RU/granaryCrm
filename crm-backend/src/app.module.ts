import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PrismaModule } from './prisma/prisma.module';
import { TeamsModule } from './teams/teams.module';
import { AccountsModule } from './accounts/accounts.module';
import { ContactsModule } from './contacts/contacts.module';
import { DealsModule } from './deals/deals.module';
import { ActivitiesModule } from './activities/activities.module';
import { EmailModule } from './email/email.module';
import { EmailTemplateModule } from './email-template/email-template.module';
import { ImapService } from './imap/imap.service';
import { EmailInboxController } from './email-inbox/email-inbox.controller';
import { ImapModule } from './imap/imap.module';
import { EmailInboxModule } from './email-inbox/email-inbox.module';
import { ScheduleModule } from '@nestjs/schedule'
import { EmailContactsModule } from './email-contacts/email-contacts.module';
import { DocumentsModule } from './documents/documents.module';
import { FileStorageModule } from './file-storage/file-storage.module';
import { FolderStorageModule } from './folder-storage/folder-storage.module';
import { SettingsModule } from './settings/settings.module';
import { ReportsModule } from './reports/reports.module';
import { TagsModule } from './tags/tags.module';
import { ImportExportModule } from './import-export/import-export.module';
import { TelegramService } from './notifications/telegram/telegram.service';
import { TelegramModule } from './telegram/telegram.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { AclService } from './acl/acl.service';
import { AclModule } from './acl/acl.module';
import { AutomationModule } from './automation/automation.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CustomFieldsModule } from './custom-fields/custom-fields.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { PrismaLoggedModule } from './prisma-logged/prisma-logged.module';
import { SearchModule } from './search/search.module';
import { CommentsModule } from './comments/comments.module';
import { InternalModule } from './notifications/internal/internal.module';

@Module({
  imports: [AuthModule, UsersModule, RolesModule, PrismaModule, TeamsModule, AccountsModule, ContactsModule, DealsModule, ActivitiesModule, EmailModule, EmailTemplateModule, ImapModule, EmailInboxModule, ScheduleModule.forRoot(), EmailContactsModule, DocumentsModule, FileStorageModule, FolderStorageModule, SettingsModule, ReportsModule, TagsModule, ImportExportModule, TelegramModule, WebhooksModule, AclModule, AutomationModule, DashboardModule, CustomFieldsModule, AuditLogModule, PrismaLoggedModule, SearchModule, CommentsModule, InternalModule,],
  controllers: [AppController, EmailInboxController],
  providers: [AppService, ImapService, TelegramService, AclService],
})
export class AppModule {}
