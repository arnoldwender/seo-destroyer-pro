# CLAUDE.md — SEO Destroyer Pro

## Project Overview

Satirical React web app that simulates "destroying" a website's SEO. Features a terminal/hacker-style UI with glitch effects, fake SEO metrics, and humorous anti-optimization recommendations. Built by "Wender Media."

## Tech Stack

- **Language:** TypeScript 5.5 (strict mode)
- **Framework:** React 18 with Vite 5.4
- **Styling:** Tailwind CSS 3.4 + inline styles (terminal aesthetic)
- **Icons:** lucide-react
- **Backend client:** @supabase/supabase-js (dependency present, not actively used)
- **Linting:** ESLint 9 (flat config) with typescript-eslint, react-hooks, react-refresh plugins

## Project Structure

```
src/
├── App.tsx          # Monolithic main component (all UI, state, and logic)
├── main.tsx         # React entry point
├── index.css        # Global styles with Tailwind imports
└── vite-env.d.ts    # Vite type declarations
index.html           # HTML entry point
vite.config.ts       # Vite configuration
eslint.config.js     # ESLint flat config
tailwind.config.js   # Tailwind content paths
tsconfig.app.json    # App TS config (ES2020, strict, react-jsx)
tsconfig.node.json   # Build tools TS config (ES2022)
```

## Commands

```bash
npm run dev          # Start Vite dev server with HMR
npm run build        # Production build to dist/
npm run preview      # Preview production build locally
npm run lint         # Run ESLint on all files
npm run typecheck    # TypeScript type checking (tsc --noEmit)
```

## Code Conventions

- **TypeScript strict mode** — `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` all enabled
- **Naming:** camelCase for variables/functions, ALL_CAPS for constant data arrays (e.g., `METRICS`, `TERMINAL_LINES`, `RECOMMENDATIONS`)
- **Components:** Const arrow functions; single-file component architecture currently
- **State management:** Local React hooks only (useState, useEffect, useRef) — no external state library
- **Phase-based UI:** App renders based on phase state: `"idle"` → `"scanning"` → `"results"`
- **Styling:** Heavy inline styles for the terminal aesthetic; Tailwind used minimally via `index.css`
- **Animations:** CSS keyframes injected via inline `<style>` tags + setInterval-based typing effects

## Linting Rules

- ESLint 9 flat config format
- `dist/` directory is ignored
- Browser globals enabled, target ES2020
- `react-refresh/only-export-components`: warn (allows constant exports)
- React hooks rules enforced

## No Testing Framework

There is no test runner or test files configured. If adding tests, Vitest would be the natural choice given the Vite build system.

## No CI/CD

No GitHub Actions workflows or other CI configuration exists. The project uses the Bolt "bolt-vite-react-ts" template for cloud deployment.

## Environment

- `.env` is gitignored but no `.env.example` exists
- No environment variables are currently required to run the app
