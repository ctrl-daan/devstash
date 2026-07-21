# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md


# DevStash

A developer knowledge hub for snippets, commands, prompts, notes, files, images, links and custom types.

## Context Files

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md


## Critical: non-standard Next.js

This project uses **Next.js 16.2.10 with React 19**. As `AGENTS.md` states, this Next.js version has breaking changes from what may be in training data. Before writing any Next.js-specific code (routing, data fetching, config, metadata, fonts, etc.), read the relevant guide in `node_modules/next/dist/docs/` and heed deprecation notices.

## Commands

```bash
npm run dev     # start the dev server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # run ESLint (flat config, eslint-config-next)
```

