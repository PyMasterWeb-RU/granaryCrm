-- CreateTable
CREATE TABLE "EmailInboxMessage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "text" TEXT,
    "html" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "folder" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "flagged" BOOLEAN NOT NULL DEFAULT false,
    "attachments" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailInboxMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailInboxMessage_messageId_key" ON "EmailInboxMessage"("messageId");

-- AddForeignKey
ALTER TABLE "EmailInboxMessage" ADD CONSTRAINT "EmailInboxMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
