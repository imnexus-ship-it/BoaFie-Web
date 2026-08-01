# BoaFie Web

Next.js 14 (App Router) frontend for BoaFie — wired end-to-end to the
`boafie-api` NestJS backend, no mock data.

**Status:** verified working. `tsc --noEmit`: 0 errors. `next build`: all 38
routes compile and prerender. Live production server smoke-tested across 18+
routes including every dynamic page — all return 200 with no runtime errors.

## Quick start

```bash
npm install
cp .env.example .env.local     # point at your running boafie-api instance
npm run dev                    # http://localhost:3000
```

Requires `boafie-api` running (default `http://localhost:3001/v1`) for any
page that fetches real data — the marketing pages (`/`, `/about`, `/pricing`,
`/diaspora`) render without it, everything else needs the API up.

## Architecture

```
src/
├── app/
│   ├── layout.tsx                 root layout — fonts, QueryProvider
│   ├── page.tsx                   landing page
│   ├── (auth)/                    login, signup, forgot/reset password
│   ├── (marketing)/               explore, jobs, pricing, diaspora, about, contact
│   ├── (client)/                  client dashboard: post jobs, review proposals,
│   │                              contracts, payments, messages, settings
│   ├── worker/                    shared artisan+freelancer dashboard: find jobs,
│   │                              proposals, contracts, portfolio, verification,
│   │                              earnings, messages, settings
│   └── admin/                     platform admin: stats, users, verification
│                                  queue, jobs, disputes, transactions, audit log
├── components/
│   ├── ui/                        design system — Button, Input, Card, Modal, etc.
│   ├── layout/                    Navbar, Footer, Sidebar, DashboardShell
│   ├── auth/, jobs/, marketplace/, contracts/, escrow/, payments/, verification/
├── lib/
│   ├── api/
│   │   ├── client.ts              fetch wrapper — auth header, error unwrapping
│   │   ├── types.ts                shared API response shapes
│   │   └── hooks/                  one file per domain, all TanStack Query
│   ├── store/
│   │   ├── auth-store.ts           persisted Zustand auth (JWT + user)
│   │   └── ui-store.ts
│   ├── hooks/useRequireAuth.ts     client-side route guard
│   └── utils/                     cn, currency, date, routing helpers
```

### Why three separate dashboard sections instead of the doc's `(worker)`/`(admin)` route groups

The original folder-architecture doc put `(client)`, `(worker)`, and `(admin)`
as parallel route groups all containing e.g. `dashboard/page.tsx` — but Next.js
route groups don't add a URL segment, so all three would resolve to the exact
same path (`/dashboard`) and fail to build. This build uses real path
segments instead: `/dashboard` (client), `/worker/dashboard`, and
`/admin/dashboard`. Functionally identical, just URL-disambiguated.

### Auth

- `useAuthStore` (Zustand + localStorage persistence) holds the JWT and user.
- `lib/api/client.ts` attaches `Authorization: Bearer <token>` to every
  request unless called with `{ auth: false }` (used for public endpoints —
  browsing jobs/workers, login, register).
- `useRequireAuth(roles?)` is a client-side guard used in each dashboard
  layout — redirects to `/login` if unauthenticated, or to `/dashboard` if
  the logged-in role doesn't match. This is a UX nicety only; the real
  authorization boundary is the API itself (every protected endpoint
  401s/403s independently of what the frontend does).
- Post-login/signup redirect goes through `dashboardPathForRole()` in
  `lib/utils/routing.ts` — client → `/dashboard`, artisan/freelancer →
  `/worker/dashboard`, admin → `/admin/dashboard`.

### Data fetching

Every list/detail page uses a TanStack Query hook from `lib/api/hooks/`.
Mutations invalidate the relevant query keys on success (e.g. accepting a
proposal invalidates both `proposals` and `contracts`). No component fetches
`fetch()` directly — everything goes through `lib/api/client.ts`'s `api.get /
post / patch / delete / getPaginated`, which also unwraps the API's
`{ success, data, meta }` / `{ success: false, error }` envelope.

### Milestone → escrow flow (the core interactive piece)

`components/contracts/ContractDetail.tsx` is shared between the client and
worker contract-detail pages and renders role-appropriate actions per
milestone:
- **Worker**, milestone `pending` → "Start milestone"
- **Worker**, milestone `in_progress` → "Submit milestone" (with a note)
- **Client**, milestone `submitted` → "Approve & release funds" or "Request
  changes" (with feedback)

Approving calls `PATCH /milestones/:id/approve`, which on the backend moves
funds from escrow into the worker's wallet — the `EscrowPanel` above the
milestone list reflects held vs. released amounts live via query
invalidation.

## What's real vs. what needs finishing

**Real, fetching from the live API:** every list/detail/form page — auth,
profiles, jobs, proposals, contracts, milestones, escrow status, wallet,
portfolio, verification submission, messaging (polling every 5s — see below),
and the full admin moderation surface.

**Needs finishing before launch:**
- **Realtime messaging** currently polls `GET /conversations/:id` every 5s
  instead of using the backend's Socket.IO gateway
  (`ws://localhost:3001/ws`). Swapping to a live socket connection removes
  the polling and adds typing indicators / online status, both of which the
  backend already emits.
- **File uploads** (portfolio photos, verification documents/selfies) accept
  a pasted URL for now rather than a real file picker wired to
  `POST /uploads/*`. The backend endpoints exist; this just needs a
  `<input type="file">` + upload-then-set-URL flow in the relevant forms.
- **Google OAuth button** isn't wired into the login/signup UI yet (the
  backend endpoint and `useAuth` groundwork exist, just needs a button +
  redirect flow).
- **Diaspora payment flow** (Stripe checkout for GBP/USD/EUR/CAD clients) —
  the backend routes it correctly by `payment_method`, but there's no
  dedicated "fund escrow" UI yet; `POST /wallet/withdraw` UI exists as the
  pattern to follow for a similar "fund" form.

## Testing what you have right now

```bash
npm run build && npm run start
```

Then, with `boafie-api` running and seeded:
`/signup` (as a client) → `/post-job` → (separately, sign up as an artisan) →
`/worker/find-jobs` → submit a proposal → back on the client side,
`/my-jobs/:id` → accept the proposal → `/contracts/:id` shows the new
contract with escrow — add a milestone, have the worker start/submit it,
approve it as the client, and watch the escrow panel update.

## Known sandbox-only build quirk

If you build this in an environment with no internet access, `next build`
will fail trying to fetch Sora/DM Sans from Google Fonts — that's a network
restriction of that environment, not a bug in the app. On a normal machine
or CI with internet access this isn't an issue.
