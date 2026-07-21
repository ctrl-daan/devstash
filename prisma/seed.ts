import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";
import {
  collections,
  currentUser,
  itemTypes,
  items,
} from "../src/lib/mock-data";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean slate so the seed is idempotent (order respects FKs).
  await prisma.itemCollection.deleteMany();
  await prisma.item.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.itemType.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  // User
  await prisma.user.create({
    data: {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      image: currentUser.image,
      isPro: currentUser.isPro,
    },
  });

  // System item types (the mock `count` is derived at query time, so it's dropped)
  for (const type of itemTypes) {
    await prisma.itemType.create({
      data: {
        id: type.id,
        name: type.name,
        icon: type.icon,
        color: type.color,
        isSystem: true,
      },
    });
  }

  // Collections
  for (const collection of collections) {
    await prisma.collection.create({
      data: {
        id: collection.id,
        name: collection.name,
        description: collection.description,
        isFavorite: collection.isFavorite,
        userId: currentUser.id,
      },
    });
  }

  // Items — with tags (connectOrCreate) and collection links
  for (const item of items) {
    await prisma.item.create({
      data: {
        id: item.id,
        title: item.title,
        description: item.description,
        contentType: item.contentType,
        content: item.content,
        url: item.url,
        language: item.language,
        isFavorite: item.isFavorite,
        isPinned: item.isPinned,
        userId: currentUser.id,
        itemTypeId: item.typeId,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
        tags: {
          connectOrCreate: item.tags.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
        collections: {
          create: item.collectionIds.map((collectionId) => ({ collectionId })),
        },
      },
    });
  }

  const [userCount, typeCount, collectionCount, itemCount, tagCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.itemType.count(),
      prisma.collection.count(),
      prisma.item.count(),
      prisma.tag.count(),
    ]);

  console.log(
    `Seeded: ${userCount} user, ${typeCount} types, ${collectionCount} collections, ${itemCount} items, ${tagCount} tags`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });