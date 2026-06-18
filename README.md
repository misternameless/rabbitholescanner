# Nameless Intelligence

Signal Before Noise.

Nameless Intelligence is an AI and crypto opportunity intelligence platform.
This repository currently contains the production foundation only: no
intelligence engine, fake data, or demo opportunities.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Supabase client factories
- Environment-driven integration status

## Getting started

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

## Environment variables

All supported variables are listed in `.env.local.example`.

## Structure

- `app/` - Next.js app routes and API routes
- `components/` - shared UI components
- `hooks/` - client-side React hooks
- `lib/` - integration and infrastructure clients
- `services/` - application-level coordination
- `types/` - shared TypeScript types
