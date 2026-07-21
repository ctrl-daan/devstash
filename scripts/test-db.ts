import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

// Quick database connectivity check. Run with: `npx tsx scripts/test-db.ts`.
// Verifies DATABASE_URL is set, opens a connection, runs a trivial query, and
// prints the row counts for each table.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set — add it to .env");
  }

  // Round-trips to the database to confirm the connection works.
  await prisma.$queryRaw`SELECT 1`;
  console.log("✔ Connected to the database");

  const [users, itemTypes, collections, items, tags] = await Promise.all([
    prisma.user.count(),
    prisma.itemType.count(),
    prisma.collection.count(),
    prisma.item.count(),
    prisma.tag.count(),
  ]);

  console.table({ users, itemTypes, collections, items, tags });
}

main()
  .catch((error) => {
    console.error("Database test failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });