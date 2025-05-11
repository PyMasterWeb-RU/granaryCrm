-- AlterTable
ALTER TABLE "Deal" ADD COLUMN     "cbRate" DOUBLE PRECISION,
ADD COLUMN     "currency" TEXT,
ADD COLUMN     "dealType" TEXT,
ADD COLUMN     "deliveryType" TEXT,
ADD COLUMN     "nomenclature" TEXT,
ADD COLUMN     "packaging" TEXT,
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "transport" TEXT;

-- AlterTable
ALTER TABLE "_ActivityTags" ADD CONSTRAINT "_ActivityTags_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ActivityTags_AB_unique";
