// Display-ready shapes returned by the dashboard query layer (src/lib/data.ts).
// These are denormalized for the UI so components don't need a separate type
// lookup — each carries the icon name + hex color it needs to render.

export interface TypeRef {
  icon: string; // Lucide icon name
  color: string; // hex
}

export interface SidebarType {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number; // number of items of this type
}

export interface CollectionCardData {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  types: TypeRef[]; // distinct types present (first drives the card accent)
}

export interface ItemCardData {
  id: string;
  title: string;
  description: string | null;
  isPinned: boolean;
  isFavorite: boolean;
  tags: string[];
  createdAt: string; // ISO date
  type: TypeRef;
}

export interface DashboardUser {
  name: string;
  email: string;
}

export interface DashboardStats {
  items: number;
  collections: number;
  favoriteItems: number;
  favoriteCollections: number;
}