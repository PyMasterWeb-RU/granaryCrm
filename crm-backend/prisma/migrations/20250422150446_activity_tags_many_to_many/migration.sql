/*
  Warnings:

  - You are about to drop the `ActivityTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ActivityTag" DROP CONSTRAINT "ActivityTag_activityId_fkey";

-- DropForeignKey
ALTER TABLE "ActivityTag" DROP CONSTRAINT "ActivityTag_tagId_fkey";

-- DropTable
DROP TABLE "ActivityTag";

-- CreateTable
CREATE TABLE "_ActivityTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ActivityTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ActivityTags_B_index" ON "_ActivityTags"("B");

-- AddForeignKey
ALTER TABLE "_ActivityTags" ADD CONSTRAINT "_ActivityTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityTags" ADD CONSTRAINT "_ActivityTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
