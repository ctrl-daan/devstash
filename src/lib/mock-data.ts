// Mock data for the dashboard UI.
// Single source of truth until the database (Prisma/Neon) is wired up.
// Shapes mirror the Prisma models but are simplified for display only.

export type ContentType = "text" | "file" | "url";

export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  isPro: boolean;
}

export interface ItemType {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  color: string; // hex
  count: number; // number of items of this type (sidebar badge)
}

export interface Collection {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  // Icons of the types present in the collection (drives the card accents).
  typeIds: string[];
}

export interface Item {
  id: string;
  title: string;
  description: string | null;
  contentType: ContentType;
  content: string | null;
  url: string | null;
  language: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  typeId: string;
  tags: string[];
  collectionIds: string[];
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

// ─── Current user ──────────────────────────────────────────────

export const currentUser: User = {
  id: "user_1",
  name: "John Doe",
  email: "john@example.com",
  image: null,
  isPro: true,
};

// ─── Item types (system types) ─────────────────────────────────

export const itemTypes: ItemType[] = [
  { id: "type_snippet", name: "Snippets", icon: "Code", color: "#3b82f6", count: 24 },
  { id: "type_prompt", name: "Prompts", icon: "Sparkles", color: "#8b5cf6", count: 18 },
  { id: "type_command", name: "Commands", icon: "Terminal", color: "#f97316", count: 15 },
  { id: "type_note", name: "Notes", icon: "StickyNote", color: "#fde047", count: 12 },
  { id: "type_file", name: "Files", icon: "File", color: "#6b7280", count: 5 },
  { id: "type_image", name: "Images", icon: "Image", color: "#ec4899", count: 3 },
  { id: "type_link", name: "Links", icon: "Link", color: "#10b981", count: 8 },
];

// ─── Collections ───────────────────────────────────────────────

export const collections: Collection[] = [
  {
    id: "col_react",
    name: "React Patterns",
    description: "Common React patterns and hooks",
    isFavorite: true,
    itemCount: 12,
    typeIds: ["type_snippet", "type_file", "type_link"],
  },
  {
    id: "col_python",
    name: "Python Snippets",
    description: "Useful Python code snippets",
    isFavorite: false,
    itemCount: 8,
    typeIds: ["type_snippet", "type_file"],
  },
  {
    id: "col_context",
    name: "Context Files",
    description: "AI context files for projects",
    isFavorite: true,
    itemCount: 5,
    typeIds: ["type_file", "type_note"],
  },
  {
    id: "col_interview",
    name: "Interview Prep",
    description: "Technical interview preparation",
    isFavorite: true,
    itemCount: 24,
    typeIds: ["type_note", "type_snippet", "type_link", "type_prompt"],
  },
  {
    id: "col_git",
    name: "Git Commands",
    description: "Frequently used git commands",
    isFavorite: true,
    itemCount: 15,
    typeIds: ["type_command", "type_note"],
  },
  {
    id: "col_ai",
    name: "AI Prompts",
    description: "Curated AI prompts for coding",
    isFavorite: false,
    itemCount: 18,
    typeIds: ["type_prompt", "type_snippet", "type_file"],
  },
];

// ─── Items ─────────────────────────────────────────────────────

export const items: Item[] = [
  {
    id: "item_useauth",
    title: "useAuth Hook",
    description: "Custom authentication hook for React applications",
    contentType: "text",
    content: `import { useContext } from 'react'
import { AuthContext } from './AuthContext'

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}`,
    url: null,
    language: "typescript",
    isFavorite: true,
    isPinned: true,
    typeId: "type_snippet",
    tags: ["react", "auth", "hooks"],
    collectionIds: ["col_react"],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "item_api_error",
    title: "API Error Handling Pattern",
    description: "Fetch wrapper with exponential backoff retry logic",
    contentType: "text",
    content: `async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options)
      if (!res.ok) throw new Error(res.statusText)
      return await res.json()
    } catch (err) {
      if (i === retries - 1) throw err
      await new Promise((r) => setTimeout(r, 2 ** i * 1000))
    }
  }
}`,
    url: null,
    language: "javascript",
    isFavorite: false,
    isPinned: true,
    typeId: "type_snippet",
    tags: ["api", "error-handling", "fetch"],
    collectionIds: ["col_react"],
    createdAt: "2024-01-12",
    updatedAt: "2024-01-12",
  },
  {
    id: "item_refactor_prompt",
    title: "Refactor for Readability",
    description: "Prompt to clean up messy code without changing behavior",
    contentType: "text",
    content:
      "Refactor the following code for readability and maintainability. Keep the behavior identical, add no new dependencies, and explain each change briefly.",
    url: null,
    language: null,
    isFavorite: true,
    isPinned: false,
    typeId: "type_prompt",
    tags: ["refactoring", "ai"],
    collectionIds: ["col_ai"],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-11",
  },
  {
    id: "item_git_undo",
    title: "Undo Last Commit",
    description: "Soft reset that keeps your changes staged",
    contentType: "text",
    content: "git reset --soft HEAD~1",
    url: null,
    language: "bash",
    isFavorite: false,
    isPinned: false,
    typeId: "type_command",
    tags: ["git", "reset"],
    collectionIds: ["col_git"],
    createdAt: "2024-01-08",
    updatedAt: "2024-01-08",
  },
  {
    id: "item_bigo_note",
    title: "Big-O Cheat Sheet",
    description: "Time complexity of common data structures and algorithms",
    contentType: "text",
    content:
      "Arrays: access O(1), search O(n)\nHash maps: insert/lookup O(1) avg\nBinary search: O(log n)\nQuicksort: O(n log n) avg, O(n^2) worst",
    url: null,
    language: null,
    isFavorite: false,
    isPinned: false,
    typeId: "type_note",
    tags: ["algorithms", "interview"],
    collectionIds: ["col_interview"],
    createdAt: "2024-01-05",
    updatedAt: "2024-01-06",
  },
  {
    id: "item_prisma_docs",
    title: "Prisma Docs",
    description: "Official Prisma ORM documentation",
    contentType: "url",
    content: null,
    url: "https://www.prisma.io/docs",
    language: null,
    isFavorite: false,
    isPinned: false,
    typeId: "type_link",
    tags: ["prisma", "database", "docs"],
    collectionIds: ["col_react"],
    createdAt: "2024-01-03",
    updatedAt: "2024-01-03",
  },
];