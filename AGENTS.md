<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` — dev server (port 3000; also in `.claude/launch.json`)
- `npm run build` — production build (also runs type checking)
- `npm run lint` — ESLint
- `npm test` — Vitest (tests live in `app/__tests__/`)

## Architecture

Single-page Next.js 16 App Router app (not Pages Router). No monorepo, no packages.

- `app/page.tsx` — Server Component, dynamic per request (random shuffle seed); gets papers from `lib/arxiv.ts`
- `app/lib/arxiv.ts` — arXiv API fetch + parse. Recent cs.AI papers (last 7 days) are cached for 10 min with `unstable_cache` (shared across Vercel instances). `fetchPaperById` looks up one paper for the summarize API
- `app/api/summarize/route.ts` — POST `{ id: "<arXiv ID>" }`. Only accepts a validated arXiv ID and fetches the abstract server-side, so the endpoint cannot be used as an open Gemini proxy. Errors return non-2xx with `{ error }`
- `app/lib/gemini.ts` — `@google/genai` with structured JSON output (`responseJsonSchema`). Model is `GEMINI_MODEL` env or `gemini-2.5-flash`. `parseGeminiResponse` validates the output and converts difficulty 1–5 to stars
- `app/lib/bookmark.ts` — localStorage-based bookmarks (client-only)
- `app/components/` — client components (`"use client"`). Summaries are cached in localStorage as `summary-v2-<arXiv ID>` (only successful results)

## Critical data model quirk

arXiv XML is parsed via `xml2js`. All raw fields come back as **arrays**, not strings (`paper.title[0]`, `paper.id[0]`, ...). Convert with `normalizePaper` right after parsing; everything past `lib/arxiv.ts` uses `NormalizedPaper` with plain strings.

## Environment

- `GEMINI_API_KEY` (required) and `GEMINI_MODEL` (optional) in `.env.local` locally, and in Vercel project env vars for deploys
- `.env*` and `.vercel` are gitignored

## Styling

- Tailwind CSS v4 via `@tailwindcss/postcss`; design tokens (`text-muted`, `bg-surface`, `text-accent`, ...) are defined in `app/globals.css`
- Use Tailwind utility classes, not inline `style={}`

## UI language

All user-facing text and Gemini prompts are in Japanese. The app targets information-science undergrads in Japan.
