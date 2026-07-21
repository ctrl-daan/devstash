# Current Feature

<!-- Feature Name -->

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

## Notes

<!-- Any extra notes -->

## History

### 2026-07-21 — Realistic seed data

Rewrote `prisma/seed.ts` with richer sample data for development and demos, per
`context/features/seed-spec.md` (overwrites the old mock-data-based seed).

- **User** — `demo@devstash.io` / "Demo User", `isPro: false`, `emailVerified:
  now`. Password `12345678` hashed with **bcryptjs** (12 rounds). bcryptjs v3
  ships its own types, so no `@types/bcryptjs` needed.
- **7 system item types** (`isSystem: true`), singular/lowercase names:
  `snippet`, `prompt`, `command`, `note`, `file`, `image`, `link` with the spec's
  icons/colors.
- **18 items across 5 collections**: React Patterns (3 TS snippets — useDebounce,
  useLocalStorage, createSafeContext), AI Workflows (3 prompts — review, docs,
  refactor), DevOps (Dockerfile snippet + deploy command + 2 real links),
  Terminal Commands (4 commands — git, docker, kill-port, npm), Design Resources
  (4 real links — Tailwind, shadcn/ui, Radix, Lucide). A few items are
  favorited/pinned for a lively dashboard.
- Seed stays idempotent (clean + recreate). Ran `prisma db seed` against the Neon
  dev branch (1 user, 7 types, 5 collections, 18 items, 26 tags); confirmed with
  `npm run db:test`.
- Added `capitalize` to the sidebar type label so the new lowercase names render
  as "Snippet" etc.; links are `/items/snippet` (still 404 — future routes).
- `src/lib/mock-data.ts` is no longer the seed source (kept, not deleted).
- Verified `npm run build` + `npm run lint` (clean); `/dashboard` serves HTTP 200
  with the new data (Demo User, AI Workflows, useDebounce, etc.).
- Built on branch `feature/seed-data`.

### 2026-07-21 — Seed database + wire dashboard to Prisma

Replaced the dashboard's mock-data imports with live Prisma/Neon queries, and
seeded the database so the dashboard has content.

- `prisma/seed.ts` — idempotent seed (clean + recreate) sourced from
  `src/lib/mock-data.ts`: user, 7 system item types, collections, items, tags,
  and item↔collection links. Wired via `prisma.config.ts` (`seed: tsx
  prisma/seed.ts`); added `tsx` dev dependency. Ran `prisma db seed` against the
  Neon dev branch (1 user, 7 types, 6 collections, 6 items, 15 tags).
- `src/types/dashboard.ts` — display shapes (`SidebarType`, `CollectionCardData`,
  `ItemCardData`, `DashboardUser`, `DashboardStats`), denormalized so components
  don't need a type lookup.
- `src/lib/data.ts` — server query layer (React `cache`d): `getCurrentUser`,
  `getSidebarTypes` (filtered item counts), `getCollections` (derived itemCount +
  distinct types), `getItems`, `getStats`. Scoped to the first user (no auth
  yet).
- `src/lib/item-types.ts` — dropped the mock-data dependency; now just
  `getTypeIcon`.
- Made `Sidebar`, `CollectionCard`, `ItemCard` props-driven; `DashboardShell`
  forwards sidebar data. `dashboard/layout.tsx` + `dashboard/page.tsx` fetch from
  Prisma as async server components.
- Added `export const dynamic = "force-dynamic"` to the dashboard segment so it
  renders per-request (no DB access at build time). Added empty states.
- `src/lib/mock-data.ts` kept as the seed's data source (not deleted). Counts are
  now derived from real rows, so they reflect the seeded data.
- Verified `npm run build` + `npm run lint` (clean); `/dashboard` serves HTTP 200
  with live data (John Doe, React Patterns, useAuth Hook, etc.).
- Built on branch `feature/dashboard-prisma-data`.

<!-- Keep this updated. Earliest to latest -->

### 2026-07-21 — Database: Prisma 7 + Neon PostgreSQL

Set up Prisma ORM (v7) with a Neon serverless PostgreSQL database and the initial
schema from `context/project-overview.md`.

- Installed **Prisma 7.9** — `prisma`, `@prisma/client`, `@prisma/adapter-pg`,
  `pg`, `dotenv`, `@types/pg`. Read the v7 upgrade guide + Postgres quickstart
  first (v7 has breaking changes: `prisma.config.ts`, `prisma-client` generator,
  required driver adapter).
- `prisma.config.ts` — v7 config; loads `DATABASE_URL` via `dotenv`, migrations
  at `prisma/migrations`.
- `prisma/schema.prisma` — generator `prisma-client` → `src/generated/prisma`;
  `postgresql` datasource (url comes from the config, not the schema). Models:
  User, Item (+ `ContentType` enum), ItemType, Collection, ItemCollection (join),
  Tag, plus NextAuth Account / Session / VerificationToken. `@@index`es and
  `onDelete: Cascade` throughout.
- `src/lib/prisma.ts` — client singleton using the `PrismaPg` driver adapter
  (required in v7), with dev hot-reload global caching.
- `package.json` — added `postinstall: prisma generate` (generated client is
  gitignored) plus `db:generate` / `db:migrate` / `db:studio`.
- `.env.example` committed; real `.env`, the generated client, and Prisma's
  injected `.agents/` / `.windsurf/` / `skills-lock.json` are gitignored.
- Ran `prisma migrate dev --name init` against the Neon dev branch — created all
  9 tables (+ the implicit `Item`↔`Tag` join); `prisma migrate status` reports in
  sync. Verified `npm run build` and `npm run lint` (both clean).
- Dashboard still reads from `src/lib/mock-data.ts`; wiring pages to Prisma is
  follow-up work.
- Built on branch `feature/database-prisma-neon`.

### 2026-07-21 — Dashboard UI Phase 3

Phase 3 of 3 for the dashboard UI layout — the main content area to the right of
the sidebar. Display-only, pulling data directly from `src/lib/mock-data.ts`.

- Added `src/lib/item-types.ts` — shared lookup: `getItemType(id)` (color +
  icon) and `getTypeIcon(name)` (Lucide component).
- Added dashboard card components:
  - `src/components/dashboard/StatCard.tsx` — a metric tile.
  - `src/components/dashboard/CollectionCard.tsx` — collection card accented by
    its dominant (first) type color, with favorite star, item count,
    description, and a row of type icons.
  - `src/components/dashboard/ItemCard.tsx` — horizontal item row with a
    type-colored icon and border, pin/star flags, tags, and date.
- Rebuilt `src/app/dashboard/page.tsx` to compose the main area:
  - Dashboard heading + subtitle.
  - 4 stat cards — Items, Collections, Favorite Items, Favorite Collections.
  - **Collections** — responsive grid of collection cards (with a "View all"
    link to the future `/collections` route).
  - **Pinned** — items where `isPinned` is true.
  - **Recent** — the 10 most recent items (sorted by `createdAt`).
- Stats use the actual mock arrays; collection accent uses the first `typeId`
  (no per-type counts in the mock data). Item type icon rendered via
  `createElement` to satisfy the `react-hooks/static-components` lint rule.
- Verified with `npm run build` and `npm run lint` (both clean, TypeScript
  passes); `/dashboard` serves HTTP 200.
- Built on branch `feature/dashboard-phase-3`.

### 2026-07-21 — Dashboard UI Phase 2

Phase 2 of 3 for the dashboard UI layout — the sidebar (Phase 1 left it as a
placeholder). Display-only, pulling data directly from `src/lib/mock-data.ts`.

- Added `src/components/dashboard/sidebar-context.tsx` — client context holding
  `isOpen` / `isMobile`, with a `matchMedia` listener that defaults the sidebar
  open on desktop and closed (drawer) on mobile.
- Rebuilt `src/components/dashboard/Sidebar.tsx`:
  - DevStash brand header.
  - **Types** section — each type links to `/items/[name]` (e.g.
    `/items/snippets`) with its colored Lucide icon and item count; collapsible.
  - **Collections** section — **Favorites** (filtered `isFavorite`, starred) and
    **Recent** collections; collapsible.
  - User avatar area pinned at the bottom (initials, name, email, settings).
  - Inline column on desktop (collapses to `w-0`); fixed overlay drawer with
    backdrop on mobile, dismissed on navigation.
- Added `src/components/dashboard/DashboardShell.tsx` — client shell wrapping the
  full-height sidebar + top bar + main in a `SidebarProvider`; server-rendered
  page `children` pass straight through.
- `src/app/dashboard/layout.tsx` now renders `DashboardShell` (sidebar moved to
  a full-height left column; top bar sits over the main area only).
- `src/components/dashboard/TopBar.tsx` — the `PanelLeft` toggle is wired to the
  sidebar context.
- `/items/*` and `/collections/*` link targets are future-phase routes (404 for
  now). "Recent" uses mock array order since collections have no timestamps yet.
- Verified with `npm run build` (compiles clean, TypeScript passes);
  `/dashboard` serves HTTP 200.
- Built on branch `feature/dashboard-phase-2`.

### 2026-07-21 — Dashboard UI Phase 1

Phase 1 of 3 for the dashboard UI layout — the structural shell only.

- Initialized **ShadCN UI** (Radix base, Nova preset — Lucide icons + Geist):
  - Added `components.json`, `src/lib/utils.ts`, and the theme tokens (light +
    dark) in `src/app/globals.css`.
  - Installed `button` and `input` components under `src/components/ui/`.
- Added the dashboard route at `/dashboard`:
  - `src/app/dashboard/layout.tsx` — persistent shell (top bar + sidebar).
  - `src/app/dashboard/page.tsx` — main-area placeholder (`<h2>Main</h2>`).
  - `src/components/dashboard/TopBar.tsx` — display-only search + New Collection
    / New Item buttons.
  - `src/components/dashboard/Sidebar.tsx` — placeholder (`<h2>Sidebar</h2>`).
- Root layout (`src/app/layout.tsx`): DevStash metadata, dark mode by default
  (`dark` class on `<html>`), and font vars renamed to `--font-sans` /
  `--font-mono` to match ShadCN's globals.
- Home page (`src/app/page.tsx`) now redirects `/` → `/dashboard`.
- Verified with `npm run build` (compiles clean, TypeScript passes).
- Built on branch `feature/dashboard-phase-1`.

### 2026-07-21 — Initial Next.js setup

- Scaffolded the project with Create Next App:
  - Next.js **16.2.10**
  - React **19.2.4**
  - TypeScript
  - Tailwind CSS **v4**
  - ESLint (flat config)
- Cleaned up the default scaffold:
  - Removed the default `public/*.svg` assets
  - Trimmed `src/app/page.tsx` and `src/app/globals.css`
- Added project documentation: `CLAUDE.md`, `AGENTS.md`, and the `context/` files.
- Committed as **"project initialization"** and pushed to `origin/main`
  (https://github.com/ctrl-daan/devstash.git).
