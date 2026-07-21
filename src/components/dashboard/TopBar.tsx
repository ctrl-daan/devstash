import { FolderPlus, PanelLeft, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Display-only top bar. Search and action buttons have no behavior yet — that
// arrives in later phases.
export function TopBar() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
      <Button variant="ghost" size="icon" aria-label="Toggle sidebar">
        <PanelLeft />
      </Button>

      <div className="relative w-full max-w-xl">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search items..."
          className="pl-9"
          aria-label="Search items"
        />
        <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline">
          <FolderPlus />
          <span className="hidden sm:inline">New Collection</span>
        </Button>
        <Button>
          <Plus />
          <span className="hidden sm:inline">New Item</span>
        </Button>
      </div>
    </header>
  );
}