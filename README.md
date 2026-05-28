# Wine Pairing Recommendations

A modern wine pairing recommendation app that helps users discover the perfect wine for any dish. Select from 20 food archetypes and receive curated wine pairing suggestions powered by Supabase.

## Key Technologies

- **React 19** with TanStack Start (Vite-based SSR framework)
- **Tailwind CSS v4** for dark luxury styling
- **Supabase** for backend data via RPC calls
- **Lucide React** for icons
- **Netlify** for deployment

## Environment Variables

Set these in your Netlify dashboard or local `.env` file:

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous/public API key |

Copy `.env.example` to `.env` and fill in your values for local development.

## Local Development

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

## Supabase Setup

The app calls a Supabase RPC function `get_pairing_recommendations` with parameters:

- `p_archetype_code` (string) — food archetype code (A01–A20)
- `p_limit` (number) — max results to return (default 5)

The function should return rows with: `wine_profile_code`, `wine_profile_name`, `pairing_score`, `region`, `grape`, `wine_style`.
