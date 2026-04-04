# CLAUDE.md -- SEO Destroyer Pro

## What This Project Is

Satirical single-page React app simulating SEO "destruction" of a target website. Terminal/hacker aesthetic with glitch effects, fake metrics, and humorous anti-optimization recommendations. Entirely client-side -- no real backend or API calls.

## Quick Reference

```bash
npm run dev          # Vite dev server at localhost:5173 with HMR
npm run build        # Production build to dist/
npm run preview      # Preview production build
npm run lint         # ESLint (flat config, ESLint 9)
npm run typecheck    # tsc --noEmit -p tsconfig.app.json
```

## Tech Stack

- TypeScript 5.5 (strict mode) + React 18
- Vite 5.4 (build + dev server)
- Tailwind CSS 3.4 + heavy inline styles
- ESLint 9 flat config with typescript-eslint, react-hooks, react-refresh
- lucide-react for icons (dependency present, not actively imported)
- @supabase/supabase-js (dependency present, not actively used)

## Architecture

**Single-component app.** All logic lives in `src/App.tsx` (~268 lines):
- `App` -- main component with phase-based rendering (`idle` / `scanning` / `results`)
- `ScoreGauge` -- sub-component for animated health percentage display
- `glitchText` -- utility for randomized character substitution

**Data constants** (all hardcoded in App.tsx):
- `METRICS` -- 12 mock SEO metrics with labels, bad values, icons
- `TERMINAL_LINES` -- 14 fake terminal output messages
- `RECOMMENDATIONS` -- 10 humorous anti-SEO tips

**State management:** Local hooks only (useState, useEffect, useRef). No external state library.

**Styling:** Inline style objects dominate. Tailwind is imported via `index.css` but barely used directly. CSS keyframes (`blink`, `scandown`, `pulse`) are injected via an inline `<style>` block.

## File Map

```
src/App.tsx           -- All application code (components, data, logic)
src/main.tsx          -- ReactDOM.createRoot entry point
src/index.css         -- Tailwind @import directives
src/vite-env.d.ts     -- Vite client types
index.html            -- HTML shell (title: "SEO Destroyer Pro v6.6.6")
vite.config.ts        -- React plugin, excludes lucide-react from optimizeDeps
eslint.config.js      -- Flat config: recommended + typescript-eslint + react plugins
tailwind.config.js    -- Content: index.html + src/**/*.{js,ts,jsx,tsx}
postcss.config.js     -- tailwindcss + autoprefixer
tsconfig.app.json     -- ES2020, strict, react-jsx, bundler resolution
tsconfig.node.json    -- ES2022, for vite.config.ts only
```

## Code Conventions

- **Strict TypeScript** -- noUnusedLocals, noUnusedParameters, noFallthroughCasesInSwitch
- **Naming** -- camelCase for variables/functions, ALL_CAPS for constant arrays
- **Components** -- Arrow functions or function declarations; default export for App
- **No prop types / interfaces defined** -- types are inlined or inferred
- **Phase-based rendering** -- UI branches on `phase` state string literal union
- **Animations** -- setInterval-driven typing effects + CSS keyframes for visual polish

## Linting Details

ESLint 9 flat config (`eslint.config.js`):
- Ignores `dist/`
- Extends `@eslint/js` recommended + `typescript-eslint` recommended
- Targets `**/*.{ts,tsx}` files with ES2020 + browser globals
- `react-hooks` plugin enforcing rules of hooks
- `react-refresh/only-export-components`: warn, allowConstantExport

## What This Project Does NOT Have

- **No tests** -- no test runner, no test files. Vitest would be the natural fit.
- **No CI/CD** -- no GitHub Actions, no workflows
- **No routing** -- single page, no react-router
- **No API calls** -- all data is mock/hardcoded
- **No env vars required** -- `.env` is gitignored but nothing reads from it
- **No component library** -- all UI is hand-built with inline styles

## Common Tasks for AI Assistants

- **Adding features:** All UI lives in App.tsx. Consider extracting components if adding significant functionality.
- **Changing metrics/text:** Edit the `METRICS`, `TERMINAL_LINES`, or `RECOMMENDATIONS` arrays at the top of App.tsx.
- **Styling changes:** Most styles are inline objects in JSX. Global/Tailwind styles in src/index.css.
- **Before committing:** Run `npm run lint` and `npm run typecheck` to catch issues.
