# DevStash — Project Overview

> **One hub for every snippet, prompt, command, link, and file a developer needs.**

---

## Table of Contents

- [Problem](#problem)
- [Target Users](#target-users)
- [Features](#features)
- [Data Models](#data-models)
- [Architecture Diagram](#architecture-diagram)
- [Tech Stack](#tech-stack)
- [Type System](#type-system)
- [Monetization](#monetization)
- [UI / UX Guidelines](#ui--ux-guidelines)

---

## Problem

Developer knowledge is fragmented across too many surfaces:

| What | Where it ends up |
|---|---|
| Code snippets | VS Code, Notion, GitHub Gists |
| AI prompts | Chat histories |
| Context files | Buried in project trees |
| Useful links | Browser bookmarks |
| Documentation | Random folders |
| Terminal commands | `.bash_history`, `.txt` files |
| Project templates | Gists, boilerplates repos |

**Result →** constant context-switching, lost knowledge, inconsistent workflows.

**DevStash →** a single, fast, searchable, AI-enhanced hub for all dev knowledge and resources.

---

## Target Users

| Persona | Primary need |
|---|---|
| **Everyday Developer** | Quick access to snippets, prompts, commands, links |
| **AI-first Developer** | Manage prompts, contexts, workflows, system messages |
| **Content Creator / Educator** | Organize code blocks, explanations, course notes |
| **Full-stack Builder** | Collect patterns, boilerplates, API examples |

---

## Features

### A. Items & Item Types

Items are the core unit of DevStash. Each item has a **type** that determines its behavior and appearance.

Users can create **custom types** (Pro only, future release), but the app ships with these **system types** (immutable):

| Type | Content Model | Route |
|---|---|---|
| Snippet | `text` | `/items/snippets` |
| Prompt | `text` | `/items/prompts` |
| Note | `text` | `/items/notes` |
| Command | `text` | `/items/commands` |
| Link | `url` | `/items/links` |
| File *(Pro)* | `file` | `/items/files` |
| Image *(Pro)* | `file` | `/items/images` |

Items open in a **slide-out drawer** for fast access and creation.

### B. Collections

- Users group items into named collections (e.g. *"React Patterns"*, *"Interview Prep"*, *"Context Files"*).
- A collection can hold **any mix of types**.
- An item can belong to **multiple collections** (many-to-many via join table).
- Collections can be favorited and given an optional description.

### C. Search

Full search across:

- Title
- Content body
- Tags
- Item type

### D. Authentication

Powered by **NextAuth v5**:

- Email / password credentials
- GitHub OAuth

### E. Core Features

- ⭐ Favorite items and collections
- 📌 Pin items to top
- 🕑 Recently used items
- 📥 Import code from file
- ✏️ Markdown editor (text-based types)
- 📤 File upload (File / Image types — Pro)
- 📦 Export data as JSON / ZIP (Pro)
- 🌙 Dark mode (default) with light mode toggle
- 🔗 Add / remove items across multiple collections
- 👁️ View which collections an item belongs to

### F. AI Features *(Pro only)*

| Feature | Description |
|---|---|
| Auto-tag suggestions | AI analyzes content and suggests relevant tags |
| Summaries | Generate concise summaries of notes/snippets |
| Explain This Code | Plain-language explanation of any code snippet |
| Prompt Optimizer | Rewrite and improve AI prompts for clarity and effectiveness |

**AI Model:** OpenAI `gpt-5-nano`

---

## Data Models

### Entity Relationship Diagram

```
┌──────────┐       ┌───────────┐       ┌────────────┐
│   User   │1─────*│   Item    │*─────*│ Collection │
└──────────┘       └───────────┘       └────────────┘
                     │       │              │
                     │       *              │
                     │   ┌───────┐          │
                     │   │  Tag  │          │
                     │   └───────┘          │
                     *                      │
                 ┌──────────┐               │
                 │ ItemType │               │
                 └──────────┘               │
                                            │
                   ┌────────────────┐       │
                   │ ItemCollection │───────┘
                   │  (join table)  │
                   └────────────────┘
```

### Prisma Schema

> ⚠️ **Migration policy:** Never use `db push`. All structural changes go through versioned Prisma migrations, run in dev first, then production.

```prisma
// ─── User (extends NextAuth) ───────────────────────────────────

model User {
  id                    String    @id @default(cuid())
  name                  String?
  email                 String?   @unique
  emailVerified         DateTime?
  image                 String?
  password              String?

  // Subscription
  isPro                 Boolean   @default(false)
  stripeCustomerId      String?   @unique
  stripeSubscriptionId  String?   @unique

  // Relations
  items                 Item[]
  itemTypes             ItemType[]
  collections           Collection[]
  accounts              Account[]       // NextAuth
  sessions              Session[]       // NextAuth

  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}

// ─── Item ──────────────────────────────────────────────────────

model Item {
  id            String    @id @default(cuid())
  title         String
  description   String?

  // Content — exactly one of these groups is populated
  contentType   ContentType           // text | file | url
  content       String?               // text body (nullable for file types)
  url           String?               // for link types
  fileUrl       String?               // Cloudflare R2 URL
  fileName      String?               // original upload name
  fileSize      Int?                  // bytes

  // Metadata
  language      String?               // programming language (optional)
  isFavorite    Boolean   @default(false)
  isPinned      Boolean   @default(false)

  // Relations
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  itemTypeId    String
  itemType      ItemType  @relation(fields: [itemTypeId], references: [id])
  tags          Tag[]
  collections   ItemCollection[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([userId])
  @@index([itemTypeId])
}

enum ContentType {
  text
  file
  url
}

// ─── ItemType ──────────────────────────────────────────────────

model ItemType {
  id        String   @id @default(cuid())
  name      String
  icon      String
  color     String                    // hex color
  isSystem  Boolean  @default(false)

  // null userId → system type; populated → user-created custom type
  userId    String?
  user      User?    @relation(fields: [userId], references: [id], onDelete: Cascade)

  items     Item[]

  @@unique([name, userId])
}

// ─── Collection ────────────────────────────────────────────────

model Collection {
  id            String    @id @default(cuid())
  name          String
  description   String?
  isFavorite    Boolean   @default(false)

  // When a new collection has no items, show this type's color
  defaultTypeId String?

  // Relations
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  items         ItemCollection[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([userId])
}

// ─── ItemCollection (join table) ───────────────────────────────

model ItemCollection {
  itemId        String
  item          Item       @relation(fields: [itemId], references: [id], onDelete: Cascade)
  collectionId  String
  collection    Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)
  addedAt       DateTime   @default(now())

  @@id([itemId, collectionId])
}

// ─── Tag ───────────────────────────────────────────────────────

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  items Item[]
}
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                               │
│  Next.js 16 (React 19)  ·  Tailwind v4  ·  shadcn/ui       │
└────────────────────────────┬────────────────────────────────┘
                             │  SSR + API Routes
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     NEXT.JS SERVER                          │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Auth        │  │  API Routes  │  │  Server Actions   │  │
│  │  (NextAuth   │  │  /api/items  │  │  /api/ai          │  │
│  │   v5)        │  │  /api/upload │  │  /api/export      │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │
│         │                 │                    │             │
└─────────┼─────────────────┼────────────────────┼────────────┘
          │                 │                    │
          ▼                 ▼                    ▼
┌──────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Neon        │  │  Cloudflare R2   │  │  OpenAI API      │
│  PostgreSQL  │  │  (File storage)  │  │  (gpt-5-nano)    │
│  + Prisma 7  │  │                  │  │                  │
└──────────────┘  └──────────────────┘  └──────────────────┘
```

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| **Framework** | Next.js 16 / React 19 | SSR pages, API routes, single codebase |
| **Language** | TypeScript | Full type safety across client & server |
| **Database** | Neon PostgreSQL | Serverless Postgres in the cloud |
| **ORM** | Prisma 7 | Migrations only — never `db push` |
| **File Storage** | Cloudflare R2 | S3-compatible, stores uploads for Pro users |
| **Auth** | NextAuth v5 | Email/password + GitHub OAuth |
| **AI** | OpenAI `gpt-5-nano` | Auto-tag, summarize, explain, optimize |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Utility-first CSS with accessible components |
| **Caching** | Redis *(under consideration)* | Potential layer for search and hot data |
| **Payments** | Stripe | Subscriptions, customer portal |

### Key Development Rules

1. **Migrations only** — all schema changes via `prisma migrate dev` / `prisma migrate deploy`. Never `db push`.
2. **Prisma 7** — always reference the latest Prisma docs; the API has changed from earlier versions.
3. **Single repo** — frontend, backend, and API live in one Next.js codebase.

---

## Type System

Each system type has a fixed color and [Lucide](https://lucide.dev) icon:

| Type | Color | Hex | Icon | Content Model |
|---|---|---|---|---|
| 🔵 Snippet | Blue | `#3b82f6` | `Code` | text |
| 🟣 Prompt | Purple | `#8b5cf6` | `Sparkles` | text |
| 🟠 Command | Orange | `#f97316` | `Terminal` | text |
| 🟡 Note | Yellow | `#fde047` | `StickyNote` | text |
| ⚪ File | Gray | `#6b7280` | `File` | file |
| 🩷 Image | Pink | `#ec4899` | `Image` | file |
| 🟢 Link | Emerald | `#10b981` | `Link` | url |

These colors drive:

- **Collection cards** — background tinted by the type most present in the collection.
- **Item cards** — border / accent color matches the item's type.
- **Sidebar icons** — colored type icons next to each section.

---

## Monetization

### Plan Comparison

| | **Free** | **Pro** — $8/mo · $72/yr |
|---|---|---|
| Items | 50 | Unlimited |
| Collections | 3 | Unlimited |
| Types | System (no File/Image) | All system + custom (future) |
| File / Image uploads | ✗ | ✓ (Cloudflare R2) |
| AI features | ✗ | ✓ Auto-tag, Summarize, Explain, Optimize |
| Search | Basic | Full |
| Export (JSON/ZIP) | ✗ | ✓ |
| Priority support | ✗ | ✓ |

> **Development mode:** During development, all users have full access. Pro gating will be enforced before launch via the `isPro` flag and Stripe integration.

### Stripe Integration Points

- `User.stripeCustomerId` — links the user to their Stripe customer record.
- `User.stripeSubscriptionId` — tracks the active subscription for status checks and cancellation.
- Webhooks handle `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`, etc.

---

## UI / UX Guidelines

### Design Principles

- Modern, minimal, developer-focused aesthetic
- **Dark mode default**, light mode optional
- Clean monospace + sans-serif typography, generous whitespace
- Subtle borders, soft shadows, muted backgrounds
- **Reference apps:** Notion, Linear, Raycast

### Layout

```
┌──────────────────────────────────────────────────┐
│  ┌────────────┐  ┌─────────────────────────────┐ │
│  │  SIDEBAR   │  │        MAIN CONTENT         │ │
│  │            │  │                             │ │
│  │  Types     │  │  Collection Cards (grid)    │ │
│  │  ─ Snippets│  │  ┌───────┐ ┌───────┐       │ │
│  │  ─ Prompts │  │  │ React │ │Python │ ...   │ │
│  │  ─ Commands│  │  │Patterns│ │Snippets│      │ │
│  │  ─ Notes   │  │  └───────┘ └───────┘       │ │
│  │  ─ Links   │  │                             │ │
│  │            │  │  Item Cards (below)          │ │
│  │  Recent    │  │  ┌─────┐ ┌─────┐ ┌─────┐   │ │
│  │  Collections│  │  │ ◼︎   │ │ ◼︎   │ │ ◼︎   │   │ │
│  │            │  │  └─────┘ └─────┘ └─────┘   │ │
│  └────────────┘  └─────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

- **Sidebar** — collapsible; shows item type links and latest collections. Becomes a drawer on mobile.
- **Main content** — grid of collection cards (background color = dominant type) and item cards (border color = item type).
- **Item drawer** — slide-out panel for viewing/editing an item without leaving the current page.

### Interactions

- Smooth transitions on navigation and drawer open/close
- Hover states on all cards
- Toast notifications for CRUD actions and errors
- Loading skeletons while data fetches
- Syntax highlighting in code blocks (snippet, command types)

### Responsive Strategy

- **Desktop-first** — optimized for wide screens
- **Mobile-usable** — sidebar collapses to hamburger drawer, cards stack single-column
