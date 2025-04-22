/*
  Warnings:

  - A unique constraint covering the columns `[userId,entityId,entity]` on the table `SharedAccess` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "SharedAccess_userId_entityId_entity_idx";

-- CreateIndex
CREATE UNIQUE INDEX "SharedAccess_userId_entityId_entity_key" ON "SharedAccess"("userId", "entityId", "entity");
