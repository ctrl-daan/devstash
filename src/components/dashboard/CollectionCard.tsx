import { MoreHorizontal, Star } from "lucide-react";

import type { Collection } from "@/lib/mock-data";
import { getItemType, getTypeIcon } from "@/lib/item-types";

const FALLBACK_COLOR = "#6b7280";

// A collection card, accented by the color of its dominant (first) type.
export function CollectionCard({ collection }: { collection: Collection }) {
  const dominant = getItemType(collection.typeIds[0]);
  const accent = dominant?.color ?? FALLBACK_COLOR;

  return (
    <div
      className="group relative flex flex-col rounded-xl border border-l-[3px] border-border bg-card p-5 transition-colors hover:bg-accent/40"
      style={{
        borderLeftColor: accent,
        backgroundImage: `linear-gradient(to right, ${accent}12, transparent 45%)`,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{collection.name}</h3>
          {collection.isFavorite && (
            <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
          )}
        </div>
        <button
          type="button"
          aria-label="Collection options"
          className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
        >
          <MoreHorizontal className="size-4" />
        </button>
      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        {collection.itemCount} items
      </p>

      {collection.description && (
        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
          {collection.description}
        </p>
      )}

      <div className="mt-4 flex items-center gap-2">
        {collection.typeIds.map((id) => {
          const type = getItemType(id);
          if (!type) return null;
          const Icon = getTypeIcon(type.icon);
          return (
            <Icon key={id} className="size-4" style={{ color: type.color }} />
          );
        })}
      </div>
    </div>
  );
}