# Current Feature

<!-- Feature Name -->

## Status

<!-- Not Started|In Progress|Completed -->

Not Started

## Goals

<!-- Goals & requirements -->

## Notes

<!-- Any extra notes -->

## History

<!-- Keep this updated. Earliest to latest -->

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
