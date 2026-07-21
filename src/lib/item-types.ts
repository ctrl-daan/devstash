import {
  Code,
  File,
  Image,
  Link as LinkIcon,
  type LucideIcon,
  Sparkles,
  StickyNote,
  Terminal,
} from "lucide-react";

import { itemTypes, type ItemType } from "@/lib/mock-data";

// Maps the icon name stored on each item type to its Lucide component.
const TYPE_ICONS: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
};

const typesById = new Map(itemTypes.map((type) => [type.id, type]));

export function getItemType(id: string): ItemType | undefined {
  return typesById.get(id);
}

export function getTypeIcon(iconName: string): LucideIcon {
  return TYPE_ICONS[iconName] ?? File;
}