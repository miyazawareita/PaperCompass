<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` — dev server
- `npm run build` — production build (also runs type checking)
- `npm run lint` — ESLint only (no dedicated `typecheck` or `test` script exists)
- No test framework or test files are set up in this repo

## Architecture

Single-page Next.js 16 App Router app (not Pages Router). No monorepo, no packages.

- `app/page.tsx` — Server Component, fetches arXiv API on every request, filters to papers from the last 7 days
- `app/api/summarize/route.ts` — POST endpoint, calls Gemini API to generate Japanese summaries
- `app/lib/gemini.ts` — `@google/genai` SDK using model `gemini-2.5-flash`
- `app/lib/bookmark.ts` — localStorage-based bookmarks (client-only)
- `app/components/` — all components are client components (`"use client"`)

## Critical data model quirk

arXiv XML is parsed via `xml2js`. All fields come back as **arrays**, not strings. Access via `paper.title[0]`, `paper.id[0]`, `paper.summary[0]`, `paper.published[0]`, etc. This is the most common source of bugs when adding features.

## Environment

- Requires `GEMINI_API_KEY` in `.env.local` for the summarize endpoint
- `.env.local` is gitignored

## Styling

- Tailwind CSS v4 via `@tailwindcss/postcss`
- `app/layout.tsx` uses Tailwind utility classes
- Most components use inline `style={}` props — this is the existing convention, not a mistake

## UI language

All user-facing text and Gemini prompts are in Japanese. The app targets information-science undergrads in Japan.
