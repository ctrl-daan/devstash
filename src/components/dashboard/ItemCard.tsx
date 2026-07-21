import { createElement } from "react";
import { Pin, Star } from "lucide-react";

import type { Item } from "@/lib/mock-data";
import { getItemType, getTypeIcon } from "@/lib/item-types";

const FALLBACK_COLOR = "#6b7280";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

// A horizontal item row, bordered by its type color. Used for both the pinned
// and recent item lists.
export function ItemCard({ item }: { item: Item }) {
  const type = getItemType(item.typeId);
  const color = type?.color ?? FALLBACK_COLOR;

  return (
    <div
      className="group flex items-start gap-4 rounded-xl border border-l-[3px] border-border bg-card p-4 transition-colors hover:bg-accent/40"
      style={{ borderLeftColor: color }}
    >
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${color}1a`, color }}
      >
        {createElement(getTypeIcon(type?.icon ?? "File"), {
          className: "size-5",
        })}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="truncate font-medium">{item.title}</h4>
          {item.isPinned && (
            <Pin className="size-3.5 shrink-0 text-muted-foreground" />
          )}
          {item.isFavorite && (
            <Star className="size-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
          )}
        </div>

        {item.description && (
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {item.description}
          </p>
        )}

        {item.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <time className="shrink-0 text-xs text-muted-foreground">
        {formatDate(item.createdAt)}
      </time>
    </div>
  );
}