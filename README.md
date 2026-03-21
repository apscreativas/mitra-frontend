# Skeleton Frontend

Next.js 15 SPA template consuming a Laravel API.

## Part of a Multi-Repo Setup

| Repo | Purpose |
|---|---|
| skeleton (orchestrator) | Setup, config, Claude Code orchestration |
| skeleton-backend | Laravel 12 API |
| **skeleton-frontend** (this repo) | Next.js 15 frontend |

**For development**, clone the orchestrator and run `setup.sh`. See the orchestrator README for full instructions.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS v4
- Turbopack (dev and build)
- ESLint v9

## Quick Start

```bash
npm install         # Install dependencies
npm run dev         # Start dev server (port 3000)
```

## Commands

```bash
npm install         # Install dependencies
npm run dev         # Dev server (Turbopack, port 3000)
npm run build       # Production build (Turbopack)
npm run start       # Start production server
npm run lint        # ESLint
```

## Module Generator

```bash
npx tsx scripts/make-module.ts --name={module} --entity={Entity}
# Example: npx tsx scripts/make-module.ts --name=inventory --entity=Item
```

Generates a 10-file module. See `ARCHITECTURE.md` for full structure.

## Architecture

- **Routing:** File-based via `app/` directory
- **Styling:** Tailwind CSS v4 with shadcn/ui components
- **State:** Server state via TanStack Query, UI state via Zustand
- **Forms:** React Hook Form + Zod validation
- **API:** Centralized http-client with CSRF + error handling
- **Path alias:** `@/*` maps to project root
