"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Folder, Layers, Settings, Star } from "lucide-react";

import type {
  CollectionCardData,
  DashboardUser,
  SidebarType,
} from "@/types/dashboard";
import { getTypeIcon } from "@/lib/item-types";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";

export function Sidebar({
  types,
  collections,
  user,
}: {
  types: SidebarType[];
  collections: CollectionCardData[];
  user: DashboardUser | null;
}) {
  const { isOpen, isMobile, close } = useSidebar();

  const favoriteCollections = collections.filter((c) => c.isFavorite);
  const recentCollections = collections.slice(0, 5);

  const displayName = user?.name ?? "Guest";
  const email = user?.email ?? "";

  // On mobile the sidebar is an overlay drawer; dismiss it after navigating.
  const handleNavigate = () => {
    if (isMobile) close();
  };

  return (
    <>
      {/* Backdrop — only rendered as an overlay on mobile when open. */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-hidden="true"
          onClick={close}
        />
      )}

      <aside
        className={cn(
          "flex flex-col bg-sidebar text-sidebar-foreground",
          isMobile
            ? "fixed inset-y-0 left-0 z-50 w-64 border-r border-sidebar-border shadow-lg transition-transform duration-200 ease-in-out"
            : "shrink-0 overflow-hidden border-r border-sidebar-border transition-[width] duration-200 ease-in-out",
          isMobile
            ? isOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : isOpen
              ? "w-64"
              : "w-0 border-r-0",
        )}
        aria-hidden={!isOpen}
      >
        {/* Brand */}
        <div className="flex h-14 shrink-0 items-center gap-2 px-4">
          <span className="flex size-7 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Layers className="size-4" />
          </span>
          <span className="text-base font-semibold">DevStash</span>
        </div>

        {/* Scrollable nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-2">
          <SidebarSection title="Types">
            {types.map((type) => {
              const Icon = getTypeIcon(type.icon);
              return (
                <Link
                  key={type.id}
                  href={`/items/${type.name.toLowerCase()}`}
                  onClick={handleNavigate}
                  className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
                >
                  <Icon className="size-4 shrink-0" style={{ color: type.color }} />
                  <span className="flex-1 truncate capitalize">{type.name}</span>
                  <span className="text-xs text-muted-foreground">{type.count}</span>
                </Link>
              );
            })}
          </SidebarSection>

          <div className="my-2 border-t border-sidebar-border" />

          <SidebarSection title="Collections">
            {favoriteCollections.length > 0 && (
              <>
                <SidebarSubheading>Favorites</SidebarSubheading>
                {favoriteCollections.map((collection) => (
                  <CollectionLink
                    key={collection.id}
                    name={collection.name}
                    href={`/collections/${collection.id}`}
                    onNavigate={handleNavigate}
                    trailing={
                      <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                    }
                  />
                ))}
              </>
            )}

            <SidebarSubheading>Recent</SidebarSubheading>
            {recentCollections.map((collection) => (
              <CollectionLink
                key={collection.id}
                name={collection.name}
                href={`/collections/${collection.id}`}
                onNavigate={handleNavigate}
                trailing={
                  <span className="text-xs text-muted-foreground">
                    {collection.itemCount}
                  </span>
                }
              />
            ))}
          </SidebarSection>
        </nav>

        {/* User area */}
        <div className="flex shrink-0 items-center gap-3 border-t border-sidebar-border px-3 py-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-xs font-medium text-sidebar-accent-foreground">
            {initials(displayName)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{displayName}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
          <button
            type="button"
            aria-label="Settings"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <Settings className="size-4" />
          </button>
        </div>
      </aside>
    </>
  );
}

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="py-1">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center gap-1 px-2 py-1 text-xs font-medium tracking-wide text-muted-foreground uppercase transition-colors hover:text-sidebar-foreground"
        aria-expanded={expanded}
      >
        <span className="flex-1 text-left">{title}</span>
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform",
            !expanded && "-rotate-90",
          )}
        />
      </button>
      {expanded && <div className="mt-1 space-y-0.5">{children}</div>}
    </div>
  );
}

function SidebarSubheading({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-2 pt-2 pb-1 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
      {children}
    </p>
  );
}

function CollectionLink({
  name,
  href,
  trailing,
  onNavigate,
}: {
  name: string;
  href: string;
  trailing?: React.ReactNode;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
    >
      <Folder className="size-4 shrink-0 text-muted-foreground" />
      <span className="flex-1 truncate">{name}</span>
      {trailing}
    </Link>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}