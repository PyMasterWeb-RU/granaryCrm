/*
  Warnings:

  - The primary key for the `_ActivityTags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_FileToMessage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_ActivityTags` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_FileToMessage` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "_ActivityTags" DROP CONSTRAINT "_ActivityTags_AB_pkey";

-- AlterTable
ALTER TABLE "_FileToMessage" DROP CONSTRAINT "_FileToMessage_AB_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "_ActivityTags_AB_unique" ON "_ActivityTags"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_FileToMessage_AB_unique" ON "_FileToMessage"("A", "B");
