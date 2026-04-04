# AGENTS.md -- AI Agent Guidelines for SEO Destroyer Pro

## Repository Context

This is a small, single-page satirical React + TypeScript web app. The entire codebase is in `src/App.tsx`. There is no backend, no database, no API integration, and no tests.

## For All Agents

### Before Making Changes
1. Read `src/App.tsx` -- it contains all application code
2. Run `npm run lint` and `npm run typecheck` to verify the current state
3. Understand the phase-based UI flow: `idle` -> `scanning` -> `results`

### After Making Changes
1. Run `npm run lint` -- fix any ESLint errors
2. Run `npm run typecheck` -- fix any TypeScript errors
3. Run `npm run build` -- ensure production build succeeds

### Key Constraints
- TypeScript strict mode is enforced (noUnusedLocals, noUnusedParameters)
- ESLint 9 flat config -- do not downgrade or switch config format
- No test framework exists -- do not assume tests can be run
- All data is hardcoded in constant arrays at the top of App.tsx
- Styling is predominantly inline -- do not refactor to CSS modules without being asked

## For Code Generation Agents

- Keep the monolithic structure unless explicitly asked to refactor
- Follow existing naming: camelCase functions, ALL_CAPS constant arrays
- Use React hooks for state (useState, useEffect, useRef)
- Maintain the terminal/hacker aesthetic (green-on-black, monospace, glitch effects)
- Use inline style objects consistent with existing patterns
- Default export for the main App component

## For Documentation Agents

- Key docs: README.md, CLAUDE.md, AGENTS.md, llms.txt
- Keep README.md user-facing and concise
- Keep CLAUDE.md focused on what AI assistants need to work with the code
- Update version references if dependencies change

## For Review Agents

- Check that strict TypeScript rules pass (no unused vars/params)
- Verify the satirical tone is maintained -- this is a joke app
- Ensure no real SEO analysis or external API calls are introduced
- Confirm inline styles follow the existing color scheme (#00ff41 green, #000 black, #ff0033 red, #ff6600 orange)
