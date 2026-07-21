import Link from "next/link";
import { Boxes, FolderHeart, FolderOpen, Pin, Star } from "lucide-react";

import { CollectionCard } from "@/components/dashboard/CollectionCard";
import { ItemCard } from "@/components/dashboard/ItemCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { collections, items } from "@/lib/mock-data";

const favoriteItemCount = items.filter((i) => i.isFavorite).length;
const favoriteCollectionCount = collections.filter((c) => c.isFavorite).length;

const pinnedItems = items.filter((i) => i.isPinned);
const recentItems = [...items]
  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  .slice(0, 10);

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <header>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Your developer knowledge hub</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Items" value={items.length} icon={Boxes} />
        <StatCard label="Collections" value={collections.length} icon={FolderOpen} />
        <StatCard
          label="Favorite Items"
          value={favoriteItemCount}
          icon={Star}
          iconColor="#facc15"
        />
        <StatCard
          label="Favorite Collections"
          value={favoriteCollectionCount}
          icon={FolderHeart}
          iconColor="#facc15"
        />
      </div>

      {/* Collections */}
      <section>
        <SectionHeader title="Collections">
          <Link
            href="/collections"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View all
          </Link>
        </SectionHeader>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>

      {/* Pinned */}
      {pinnedItems.length > 0 && (
        <section>
          <SectionHeader title="Pinned" icon={<Pin className="size-4" />} />
          <div className="mt-4 space-y-3">
            {pinnedItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Recent */}
      <section>
        <SectionHeader title="Recent" />
        <div className="mt-4 space-y-3">
          {recentItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  );
}