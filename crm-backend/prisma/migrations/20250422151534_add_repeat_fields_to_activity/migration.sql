-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "repeat" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "repeatInterval" INTEGER,
ADD COLUMN     "repeatPattern" TEXT,
ADD COLUMN     "repeatUntil" TIMESTAMP(3);
