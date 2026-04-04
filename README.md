# SEO Destroyer Pro v6.6.6

> *Guaranteed to destroy your Google ranking in minutes.*

A satirical React web application that simulates analyzing and "destroying" a website's SEO. Features a retro terminal/hacker-style UI with glitch effects, fake SEO metrics, and hilariously bad optimization recommendations.

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-697panbs)

## Features

- Terminal-style dark UI with CRT scanline overlay and glitch effects
- URL input to "target" any website for fake SEO analysis
- Animated terminal output simulating a hacking sequence
- 12 intentionally absurd SEO metrics with destruction scores
- Animated SEO Health gauge that counts down to near-zero
- 10 clickable anti-optimization recommendations that worsen the score
- Fully client-side -- no backend calls, no data collected

## Tech Stack

- **React 18** with **TypeScript 5.5** (strict mode)
- **Vite 5.4** for build tooling and dev server
- **Tailwind CSS 3.4** + inline styles for the terminal aesthetic
- **ESLint 9** (flat config) with typescript-eslint and React plugins

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Install and Run

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:5173` with hot module replacement.

### Available Scripts

| Command              | Description                            |
|----------------------|----------------------------------------|
| `npm run dev`        | Start Vite dev server with HMR         |
| `npm run build`      | Production build to `dist/`            |
| `npm run preview`    | Preview the production build locally   |
| `npm run lint`       | Run ESLint across the project          |
| `npm run typecheck`  | TypeScript type checking (no emit)     |

## Project Structure

```
seo-destroyer-pro/
├── src/
│   ├── App.tsx          # Main application component (all UI and logic)
│   ├── main.tsx         # React DOM entry point
│   ├── index.css        # Global styles with Tailwind imports
│   └── vite-env.d.ts    # Vite client type declarations
├── index.html           # HTML shell
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
├── eslint.config.js     # ESLint flat config
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS with Tailwind and Autoprefixer
├── tsconfig.json        # Root TypeScript config (references)
├── tsconfig.app.json    # App TypeScript config (ES2020, strict)
└── tsconfig.node.json   # Build tools TypeScript config (ES2022)
```

## How It Works

1. User enters a URL and clicks "DESTROY SEO"
2. A fake terminal sequence plays with animated typing
3. 12 mock SEO metrics appear with absurdly bad scores
4. An overall SEO Health gauge animates down to near 0%
5. 5 random anti-optimization recommendations are shown
6. Clicking a recommendation "applies" it, further lowering the score

All analysis is simulated client-side -- no real SEO data is fetched.

## Disclaimer

This is a parody project for entertainment purposes only. It does not perform any actual SEO analysis, modification, or destruction. No websites are harmed in the use of this application.

## License

Built by Wender Media.
