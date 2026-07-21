import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ─── System item types ─────────────────────────────────────────

const itemTypes = [
  { id: "type_snippet", name: "snippet", icon: "Code", color: "#3b82f6" },
  { id: "type_prompt", name: "prompt", icon: "Sparkles", color: "#8b5cf6" },
  { id: "type_command", name: "command", icon: "Terminal", color: "#f97316" },
  { id: "type_note", name: "note", icon: "StickyNote", color: "#fde047" },
  { id: "type_file", name: "file", icon: "File", color: "#6b7280" },
  { id: "type_image", name: "image", icon: "Image", color: "#ec4899" },
  { id: "type_link", name: "link", icon: "Link", color: "#10b981" },
];

// ─── Collections ───────────────────────────────────────────────

const collections = [
  {
    id: "col_react",
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
    isFavorite: true,
  },
  {
    id: "col_ai",
    name: "AI Workflows",
    description: "AI prompts and workflow automations",
    isFavorite: true,
  },
  {
    id: "col_devops",
    name: "DevOps",
    description: "Infrastructure and deployment resources",
    isFavorite: false,
  },
  {
    id: "col_terminal",
    name: "Terminal Commands",
    description: "Useful shell commands for everyday development",
    isFavorite: true,
  },
  {
    id: "col_design",
    name: "Design Resources",
    description: "UI/UX resources and references",
    isFavorite: false,
  },
];

// ─── Items ─────────────────────────────────────────────────────

interface SeedItem {
  id: string;
  title: string;
  description: string;
  typeId: string;
  collectionId: string;
  contentType: "text" | "url";
  content?: string;
  url?: string;
  language?: string;
  tags: string[];
  isFavorite?: boolean;
  isPinned?: boolean;
  createdAt: string;
}

const items: SeedItem[] = [
  // React Patterns — 3 TypeScript snippets
  {
    id: "item_use_debounce",
    title: "useDebounce",
    description: "Debounce a rapidly changing value",
    typeId: "type_snippet",
    collectionId: "col_react",
    contentType: "text",
    language: "typescript",
    tags: ["react", "hooks", "performance"],
    isFavorite: true,
    isPinned: true,
    createdAt: "2026-07-20",
    content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}`,
  },
  {
    id: "item_use_local_storage",
    title: "useLocalStorage",
    description: "State synced to localStorage, SSR-safe",
    typeId: "type_snippet",
    collectionId: "col_react",
    contentType: "text",
    language: "typescript",
    tags: ["react", "hooks", "storage"],
    isFavorite: true,
    createdAt: "2026-07-18",
    content: `import { useCallback, useState } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [stored, setStored] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      setStored(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    },
    [key],
  );

  return [stored, setValue] as const;
}`,
  },
  {
    id: "item_safe_context",
    title: "createSafeContext",
    description: "Typed context provider that throws when used outside it",
    typeId: "type_snippet",
    collectionId: "col_react",
    contentType: "text",
    language: "typescript",
    tags: ["react", "context", "typescript"],
    createdAt: "2026-07-15",
    content: `import { createContext, useContext } from "react";

export function createSafeContext<T>(name: string) {
  const Context = createContext<T | null>(null);

  function useSafeContext() {
    const ctx = useContext(Context);
    if (ctx === null) {
      throw new Error(\`use\${name} must be used within <\${name}Provider>\`);
    }
    return ctx;
  }

  return [Context.Provider, useSafeContext] as const;
}`,
  },

  // AI Workflows — 3 prompts
  {
    id: "item_prompt_review",
    title: "Code Review",
    description: "Structured pull-request review prompt",
    typeId: "type_prompt",
    collectionId: "col_ai",
    contentType: "text",
    tags: ["review", "code-quality"],
    isPinned: true,
    createdAt: "2026-07-19",
    content: `You are a senior engineer reviewing a pull request. Review the following diff for correctness, security, performance, and readability.

Group issues by severity (blocker, major, minor), cite the exact file and line, and suggest a concrete fix for each. Be concise and do not restate the code.`,
  },
  {
    id: "item_prompt_docs",
    title: "Documentation Generator",
    description: "Generate docs that match the project style",
    typeId: "type_prompt",
    collectionId: "col_ai",
    contentType: "text",
    tags: ["docs", "ai"],
    isFavorite: true,
    createdAt: "2026-07-14",
    content: `Generate clear documentation for the following code. Include:

- a one-line summary
- a parameters / returns table
- at least one realistic usage example
- any edge cases or gotchas

Match the project's existing documentation style and keep it concise.`,
  },
  {
    id: "item_prompt_refactor",
    title: "Refactoring Assistant",
    description: "Behavior-preserving refactor with rationale",
    typeId: "type_prompt",
    collectionId: "col_ai",
    contentType: "text",
    tags: ["refactoring", "ai"],
    createdAt: "2026-07-10",
    content: `Refactor the following code for readability and maintainability. Preserve behavior exactly, add no new dependencies, and prefer small pure functions.

Return the full refactored file, then a short bullet list explaining each change in one line.`,
  },

  // DevOps — 1 snippet, 1 command, 2 links
  {
    id: "item_dockerfile",
    title: "Multi-stage Dockerfile",
    description: "Production Node build with a slim runtime image",
    typeId: "type_snippet",
    collectionId: "col_devops",
    contentType: "text",
    language: "dockerfile",
    tags: ["docker", "ci", "deployment"],
    createdAt: "2026-07-12",
    content: `# syntax=docker/dockerfile:1
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]`,
  },
  {
    id: "item_deploy_script",
    title: "Build and push image",
    description: "Tag and push the app image to the registry",
    typeId: "type_command",
    collectionId: "col_devops",
    contentType: "text",
    language: "bash",
    tags: ["docker", "deployment"],
    createdAt: "2026-07-08",
    content:
      "docker build -t devstash:latest . && docker push registry.example.com/devstash:latest",
  },
  {
    id: "item_link_docker_docs",
    title: "Docker Build Docs",
    description: "Official Docker build reference",
    typeId: "type_link",
    collectionId: "col_devops",
    contentType: "url",
    url: "https://docs.docker.com/build/",
    tags: ["docker", "docs"],
    createdAt: "2026-07-05",
  },
  {
    id: "item_link_gh_actions",
    title: "GitHub Actions Docs",
    description: "CI/CD workflows on GitHub",
    typeId: "type_link",
    collectionId: "col_devops",
    contentType: "url",
    url: "https://docs.github.com/actions",
    tags: ["ci", "github"],
    createdAt: "2026-07-04",
  },

  // Terminal Commands — 4 commands
  {
    id: "item_cmd_git_log",
    title: "Pretty git log",
    description: "Compact, decorated commit graph",
    typeId: "type_command",
    collectionId: "col_terminal",
    contentType: "text",
    language: "bash",
    tags: ["git"],
    isFavorite: true,
    createdAt: "2026-07-17",
    content: "git log --oneline --graph --decorate --all",
  },
  {
    id: "item_cmd_docker_prune",
    title: "Docker cleanup",
    description: "Reclaim disk from unused Docker data",
    typeId: "type_command",
    collectionId: "col_terminal",
    contentType: "text",
    language: "bash",
    tags: ["docker"],
    createdAt: "2026-07-11",
    content: "docker system prune -af --volumes",
  },
  {
    id: "item_cmd_kill_port",
    title: "Kill process on port",
    description: "Free a port taken by a stuck process",
    typeId: "type_command",
    collectionId: "col_terminal",
    contentType: "text",
    language: "bash",
    tags: ["process", "unix"],
    isPinned: true,
    createdAt: "2026-07-16",
    content: "lsof -ti:3000 | xargs kill -9",
  },
  {
    id: "item_cmd_npm_update",
    title: "Update npm packages",
    description: "See outdated deps and update them",
    typeId: "type_command",
    collectionId: "col_terminal",
    contentType: "text",
    language: "bash",
    tags: ["npm", "packages"],
    createdAt: "2026-07-03",
    content: "npm outdated && npm update",
  },

  // Design Resources — 4 links
  {
    id: "item_link_tailwind",
    title: "Tailwind CSS Docs",
    description: "Utility-first CSS framework reference",
    typeId: "type_link",
    collectionId: "col_design",
    contentType: "url",
    url: "https://tailwindcss.com/docs",
    tags: ["css", "tailwind"],
    isFavorite: true,
    createdAt: "2026-07-13",
  },
  {
    id: "item_link_shadcn",
    title: "shadcn/ui",
    description: "Composable React component library",
    typeId: "type_link",
    collectionId: "col_design",
    contentType: "url",
    url: "https://ui.shadcn.com",
    tags: ["components", "react"],
    createdAt: "2026-07-09",
  },
  {
    id: "item_link_radix",
    title: "Radix UI",
    description: "Accessible, unstyled component primitives",
    typeId: "type_link",
    collectionId: "col_design",
    contentType: "url",
    url: "https://www.radix-ui.com",
    tags: ["design-system", "accessibility"],
    createdAt: "2026-07-06",
  },
  {
    id: "item_link_lucide",
    title: "Lucide Icons",
    description: "Open-source icon library",
    typeId: "type_link",
    collectionId: "col_design",
    contentType: "url",
    url: "https://lucide.dev",
    tags: ["icons"],
    createdAt: "2026-07-02",
  },
];

async function main() {
  // Clean slate so the seed is idempotent (order respects FKs).
  await prisma.itemCollection.deleteMany();
  await prisma.item.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.itemType.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  // Demo user (password hashed with bcryptjs, 12 rounds)
  const password = await bcrypt.hash("12345678", 12);
  const user = await prisma.user.create({
    data: {
      id: "user_demo",
      email: "demo@devstash.io",
      name: "Demo User",
      isPro: false,
      emailVerified: new Date(),
      password,
    },
  });

  for (const type of itemTypes) {
    await prisma.itemType.create({ data: { ...type, isSystem: true } });
  }

  for (const collection of collections) {
    await prisma.collection.create({
      data: { ...collection, userId: user.id },
    });
  }

  for (const item of items) {
    await prisma.item.create({
      data: {
        id: item.id,
        title: item.title,
        description: item.description,
        contentType: item.contentType,
        content: item.content ?? null,
        url: item.url ?? null,
        language: item.language ?? null,
        isFavorite: item.isFavorite ?? false,
        isPinned: item.isPinned ?? false,
        userId: user.id,
        itemTypeId: item.typeId,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.createdAt),
        tags: {
          connectOrCreate: item.tags.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
        collections: {
          create: [{ collectionId: item.collectionId }],
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