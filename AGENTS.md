# AGENTS.md

## Project Overview

Wine pairing recommendation app — single-page React app that queries a Supabase RPC function to suggest wines for selected food archetypes.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Backend | Supabase (client-side RPC via `@supabase/supabase-js`) |
| Language | TypeScript 5.9 (strict mode) |
| Deployment | Netlify |

## Directory Structure

```
├── public/              # Static assets
├── src/
│   ├── lib/
│   │   └── supabase.ts  # Supabase client initialization
│   ├── routes/
│   │   ├── __root.tsx   # Root layout: head meta, styles
│   │   └── index.tsx    # Main page: food archetype selector + wine results
│   ├── router.tsx       # TanStack Router setup
│   └── styles.css       # Global styles: Tailwind import + dark theme base
├── .env.example         # Template for required environment variables
├── netlify.toml         # Netlify build and dev config
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript config with @/* path alias
└── vite.config.ts       # Vite plugins: TanStack Start, Netlify, Tailwind
```

## Key Concepts

### Supabase RPC

The app calls `get_pairing_recommendations` via Supabase RPC with:
- `p_archetype_code` (string) — food archetype code (A01–A20)
- `p_limit` (number) — max results (5)

The function returns: `wine_profile_code`, `wine_profile_name`, `pairing_score`, `region`, `grape`, `wine_style`.

### Food Archetypes

Labels for A01–A20 are defined client-side in the `foodArchetypes` array in `src/routes/index.tsx`. If archetype metadata moves to the database, update that array.

### Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public API key |

## Conventions

- Components: PascalCase
- Utilities: camelCase
- Tailwind utility classes for all styling (dark luxury theme)
- TypeScript strict mode
- `@/` path alias for `src/`

## Development

```bash
npm install
npm run dev    # http://localhost:3000
```
