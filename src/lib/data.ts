import { cache } from "react";

import { prisma } from "@/lib/prisma";
import type {
  CollectionCardData,
  DashboardStats,
  DashboardUser,
  ItemCardData,
  SidebarType,
  TypeRef,
} from "@/types/dashboard";

// No auth yet — the dashboard reads the first (seeded) user's data.
const getCurrentUserId = cache(async (): Promise<string | null> => {
  const user = await prisma.user.findFirst({ select: { id: true } });
  return user?.id ?? null;
});

export const getCurrentUser = cache(async (): Promise<DashboardUser | null> => {
  const user = await prisma.user.findFirst({
    select: { name: true, email: true },
  });
  if (!user) return null;
  return { name: user.name ?? "Unknown", email: user.email ?? "" };
});

export const getSidebarTypes = cache(async (): Promise<SidebarType[]> => {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const types = await prisma.itemType.findMany({
    where: { OR: [{ isSystem: true }, { userId }] },
    include: { _count: { select: { items: { where: { userId } } } } },
    orderBy: { name: "asc" },
  });

  return types.map((type) => ({
    id: type.id,
    name: type.name,
    icon: type.icon,
    color: type.color,
    count: type._count.items,
  }));
});

export const getCollections = cache(async (): Promise<CollectionCardData[]> => {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const collections = await prisma.collection.findMany({
    where: { userId },
    include: {
      _count: { select: { items: true } },
      items: { include: { item: { include: { itemType: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return collections.map((collection) => {
    // Distinct types present in the collection, in insertion order.
    const seen = new Map<string, TypeRef>();
    for (const { item } of collection.items) {
      if (!seen.has(item.itemType.id)) {
        seen.set(item.itemType.id, {
          icon: item.itemType.icon,
          color: item.itemType.color,
        });
      }
    }
    return {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      isFavorite: collection.isFavorite,
      itemCount: collection._count.items,
      types: [...seen.values()],
    };
  });
});

export const getItems = cache(async (): Promise<ItemCardData[]> => {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const items = await prisma.item.findMany({
    where: { userId },
    include: { itemType: true, tags: true },
    orderBy: { createdAt: "desc" },
  });

  return items.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    isPinned: item.isPinned,
    isFavorite: item.isFavorite,
    tags: item.tags.map((tag) => tag.name),
    createdAt: item.createdAt.toISOString(),
    type: { icon: item.itemType.icon, color: item.itemType.color },
  }));
});

export const getStats = cache(async (): Promise<DashboardStats> => {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { items: 0, collections: 0, favoriteItems: 0, favoriteCollections: 0 };
  }

  const [items, collections, favoriteItems, favoriteCollections] =
    await Promise.all([
      prisma.item.count({ where: { userId } }),
      prisma.collection.count({ where: { userId } }),
      prisma.item.count({ where: { userId, isFavorite: true } }),
      prisma.collection.count({ where: { userId, isFavorite: true } }),
    ]);

  return { items, collections, favoriteItems, favoriteCollections };
});