-- AlterTable
ALTER TABLE "EmailAccount" ADD COLUMN     "imapHost" TEXT,
ADD COLUMN     "imapPort" INTEGER,
ADD COLUMN     "imapSecure" BOOLEAN,
ALTER COLUMN "password" DROP NOT NULL;
