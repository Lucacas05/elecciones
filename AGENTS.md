# AGENTS.md

## Stack

- **Astro 5** + **@astrojs/vercel** (adapter), **Tailwind CSS**
- Vitest for tests (`npm run test`)
- Content from `candidatos/*.md` via `astro:content`

## Key commands

```bash
npm run dev      # dev server
npm run build    # production build
npm run test     # vitest run (all tests)
```

## Architecture

- `public/quiz-core.js` — quiz engine (scoring, compatibility matrices, candidate building)
- `public/script.js` — DOM wrapper + Polymarket client (polling, WebSocket)
- `src/lib/planLinks.ts` — PDF resolution by party name + alias map
- `src/pages/api/polymarket/peru-election.json.ts` — server endpoint (live → Vercel Blob cache → seed)
- `candidatos/*.md` — editorial candidate content; schema in `src/content.config.ts`

## Quiz positions

16 axes defined in `quiz-core.js`. Each axis maps to a `quiz_posiciones` key in candidate frontmatter. Valid values are fixed enums (e.g., `economy: "libre_mercado" | "intervencion_estatal" | "mixta"`). See README for full list.

## Testing

Tests import directly from `public/quiz-core.js`. Run with `npm run test`. No separate test environment or service required.

## Vercel deploy

- Framework preset: Astro
- Build command: `npm run build`
- Output directory: auto (do NOT set to `dist`)
- `astro preview` is not supported; validate with `npm run build` and inspect `.vercel/output/`

## Adding a candidate

1. Create `candidatos/<slug>.md` matching the schema in `src/content.config.ts`
2. Add photos to `public/img/candidatos/` and logos to `public/img/partidos/`
3. If party has a PDF plan, add to `public/planes-gobierno/` and optionally add alias to `src/lib/planLinks.ts`

## Polymarket fallback chain

`live fetch → Vercel Blob cache (needs `BLOB_READ_WRITE_TOKEN`) → seed from `src/data/polymarket/peru-election-winner.seed.json`
