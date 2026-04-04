# GitHub Copilot Instructions -- SEO Destroyer Pro

## Project Summary

Satirical React + TypeScript single-page app that simulates destroying a website's SEO. Terminal/hacker aesthetic. All logic in `src/App.tsx`.

## Tech Stack

- React 18, TypeScript 5.5 (strict), Vite 5.4, Tailwind CSS 3.4, ESLint 9

## Code Style

- camelCase for functions/variables, ALL_CAPS for constant data arrays
- Arrow functions or function declarations for components
- Inline style objects for most styling (terminal aesthetic)
- Local React hooks only -- no external state management
- Phase-based rendering: `"idle"` | `"scanning"` | `"results"`

## TypeScript

- Strict mode enabled with noUnusedLocals, noUnusedParameters
- Target ES2020
- JSX mode: react-jsx (automatic runtime)

## What NOT to Do

- Do not add external API calls -- all data is mock/hardcoded
- Do not introduce CSS modules or styled-components -- use inline styles
- Do not add a test framework unless explicitly requested
- Do not change the ESLint flat config format
- Do not remove the satirical tone from UI text
