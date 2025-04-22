// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.role.upsert({
    where: { name: 'superadmin' },
    update: {},
    create: { name: 'superadmin' },
  });
  await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  });
  await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: { name: 'user' },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
