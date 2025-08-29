// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.room.createMany({
    data: [
      { name: "general",slug: "general", type: "public" },
      { name: "tech",slug: "tech", type: "public" },
      { name: "football",slug: "football", type: "public" },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(() => console.log("Seeded public rooms ✅"))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
