# Subproof

Pre-launch waitlist site for **Subproof**, a certificate-of-insurance (COI) tracker for small US general contractors. The project is set up to grow into the marketing site of the full app.

**Stack:** Next.js 16 (App Router, TypeScript), Tailwind CSS v4, shadcn/ui, Neon Postgres + Drizzle ORM. It uses no paid services.

## What's here

| Route | What it is |
| --- | --- |
| `/` | Landing page: hero with an HTML/CSS dashboard mock, problem, how it works, pricing teaser, waitlist form, footer |
| `/admin/waitlist` | Password-protected list of signups with counts by company size |
| `/admin/waitlist/export` | CSV download of all signups (needs an admin session) |
| `/opengraph-image`, `/icon.svg`, `/robots.txt`, `/sitemap.xml` | SEO / social assets |

### Waitlist behaviour

- Fields: name, email, company, number of subs (`under_10`, `10_25`, `25_100`, `100_plus`), and an optional "How do you track COIs today?".
- It's a server action (`src/app/actions/waitlist.ts`) with zod validation (`src/lib/waitlist.ts`), and errors show inline next to each field.
- Emails are trimmed and lowercased, and a unique index blocks duplicates. A repeat signup gets a friendly "You're already on the list" message instead of an error.
- First-touch attribution: `utm_source`, `utm_medium` and `utm_campaign` from the landing URL, plus any external `document.referrer`. They're kept in `sessionStorage` for the visit.
- A hidden honeypot field drops basic bot submissions.

### Admin auth

`/admin/waitlist` asks for `ADMIN_PASSWORD`. After you sign in it sets an httpOnly, `SameSite=Strict` cookie scoped to `/admin`. The cookie holds an HMAC-signed, 7-day token, so changing the password signs everyone out. If `ADMIN_PASSWORD` is empty, the admin page is turned off. The CSV export guards against spreadsheet formula injection.

## Local development

Requires Node 20.9+.

```bash
npm install
cp .env.example .env.local      # then fill in DATABASE_URL and ADMIN_PASSWORD
npm run db:migrate              # creates the `waitlist` table
npm run dev                     # http://localhost:3000
```

**Database options**

- **Neon (recommended):** create a free project at neon.tech and paste the pooled connection string into `DATABASE_URL`. A Neon branch per developer works well.
- **Local Postgres:** any `postgresql://…@localhost…` / `127.0.0.1` URL works. `src/db/index.ts` uses `node-postgres` for local URLs and Neon's serverless HTTP driver for everything else.

### Scripts

| Script | Does |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js |
| `npm run lint` / `typecheck` | ESLint / `tsc --noEmit` |
| `npm run db:generate` | Generate a SQL migration from `src/db/schema.ts` into `drizzle/` |
| `npm run db:migrate` | Apply migrations in `drizzle/` to `DATABASE_URL` |
| `npm run db:push` | Push the schema directly (fine for throwaway branches) |
| `npm run db:studio` | Drizzle Studio |

Schema changes: edit `src/db/schema.ts`, run `npm run db:generate`, commit the generated SQL, then run `npm run db:migrate`.

## Deploying to Vercel

1. Import the repo in Vercel. Vercel detects the framework from `vercel.json`.
2. Add a database: either use the **Neon** integration from the Vercel Marketplace (it sets `DATABASE_URL`), or paste your own Neon connection string.
3. Add `ADMIN_PASSWORD`. This and `DATABASE_URL` are the only variables you enter in Vercel.
4. Run the migration once against the production database: `DATABASE_URL=… npm run db:migrate`.

Public, non-secret settings live in the committed `.env.production`, which Next.js reads at build time, so Vercel picks them up with no dashboard setup:

- `NEXT_PUBLIC_CONTACT_EMAIL`: the footer contact address.
- `NEXT_PUBLIC_SITE_URL`: left unset, so canonical/OG URLs use Vercel's production domain (`VERCEL_PROJECT_PRODUCTION_URL`). Set it there when you add a custom domain.

A value set in the Vercel dashboard overrides `.env.production`. Never put secrets in `.env.production`.

## Project layout

```
src/
  app/
    page.tsx                 landing page (composes sections)
    layout.tsx               Inter font, global SEO metadata
    opengraph-image.tsx      generated 1200×630 OG image
    actions/waitlist.ts      signup server action
    admin/waitlist/          admin page, login, CSV export route
  components/
    landing/                 page sections, dashboard mock, status pill
    ui/                      shadcn/ui primitives (button, input, card, table, …)
  db/                        Drizzle schema + client
  lib/                       site config, validation, admin auth, utils
drizzle/                     SQL migrations
```

## Design notes

The design tokens are in `src/app/globals.css`. The look is light and high-contrast, with navy (`--primary`) as the main colour. Green, amber and red (`--success`, `--warning`, `--danger`) are reserved for compliance status and always appear with an icon and a label. The font is Inter (via `next/font`), and layouts are built mobile-first. The product app should reuse these tokens.

### shadcn/ui

`components.json` is configured (New York style, `@/components/ui`), so you can add more components with `npx shadcn@latest add <name>`.
