# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build (output: 'standalone')
npm run start    # Start production server
npm run lint     # Run ESLint (next/core-web-vitals)
```

No test framework is configured.

Docker: the multi-stage [Dockerfile](Dockerfile) builds the standalone output and runs `node server.js`. `NEXT_PUBLIC_API_URL` must be passed as a **build arg** (`--build-arg NEXT_PUBLIC_API_URL=...`) because it is inlined at build time. The Docker build uses `package-lock.json` (`npm ci`); a `yarn.lock` also exists, so keep the npm lockfile in sync when adding dependencies.

## Architecture

**Stack**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + MUI v6. UI text is in Spanish.

**Backend**: A separate REST API (`NEXT_PUBLIC_API_URL`, default `http://localhost:8000`). The shared Axios instance in [src/config/api.ts](src/config/api.ts) has a 5s timeout. All API calls go through service files in [src/services/](src/services/) (`api.<domain>.ts`), which catch errors, log them, and rethrow a Spanish `Error`. Aggregate endpoints (`/expenses/total`, etc.) return a Prisma-style `{ _sum: { amount } }` that the service unwraps. The ARS/USD rate comes from the external `dolarapi.com` via `fetch` with 12h revalidation ([src/services/api.dolar.ts](src/services/api.dolar.ts)).

**Routes**: `/` (dashboard), `/expenses`, `/incomes`, `/investments`, `/settings` (manage expense/investment categories and types), `/login`, `/register`.

### Authentication

The JWT lives in an `auth_token` cookie that the client sets in JS ([src/lib/auth.ts](src/lib/auth.ts)). Not httpOnly.
- [src/middleware.ts](src/middleware.ts) redirects unauthenticated users to `/login` and authenticated users away from `/login`/`/register`.
- **Client-side** requests: an Axios request interceptor reads the cookie and adds `Authorization: Bearer`. A response interceptor on 401 clears the cookie and redirects to `/login`.
- **Server-side** requests: the interceptor does nothing on the server, so every page reads the cookie through `cookies()` from `next/headers` and passes `authHeaders` into each service function explicitly. New server-fetching code must do the same; that is why service functions take an optional trailing `headers` param.
- `ConditionalHeader` hides the header on the login/register routes.

### Data flow

- Pages are async Server Components. They `await searchParams`, build a date range, then load everything through `Promise.all()` and pass it down to client list components in `src/app/<route>/components/`.
- **Month filtering**: `MonthSelector` (client, wrapped in `<Suspense>` because it uses search params) sets `?month=YYYY-MM`. Pages convert it with `getDateRangeForMonth` / `getDefaultDateRange` from [src/utils/date.ts](src/utils/date.ts) into `{ startDate, endDate }`, sent as query params.
- After a create, update, or delete (modals, tables, settings), the client calls `window.location.reload()` instead of revalidating.

### Currency

The root layout fetches the official dollar rate on the server and passes it to `Providers` → `CurrencyProvider` ([src/context/CurrencyContext.tsx](src/context/CurrencyContext.tsx)). Amounts are stored in ARS. Display components should use `useCurrency().formatAmount(n)`, which converts to USD when the user toggles it (saved in `localStorage`). If the rate fetch fails, the rate falls back to 1.

### Components & styling

- Shared components live in `src/shared/components/<Name>/<Name>.component.tsx`. `TransactionModal` handles both expenses and incomes (`type="expense" | "income"`, with conditional fields), and `InvestmentModal` handles investments.
- Expenses have both a `type` and a `category`. Investments also have types and categories. Incomes are simpler. Shared interfaces are in [src/types/index.ts](src/types/index.ts).
- Forms use Formik + Yup, with MUI inputs (TextField, Select, DatePicker) as controlled fields. MUI `LocalizationProvider` (dayjs) is set up in [src/app/providers.tsx](src/app/providers.tsx).
- Charts use Recharts (`src/shared/components/Charts/`, plus dashboard charts in `src/app/components/`).
- Styling mixes Tailwind utilities with per-component SCSS (`.module.scss` or plain `.scss`). `cx()` in [src/lib/utils.ts](src/lib/utils.ts) is `twMerge(clsx(...))`. Theme colors are CSS variables in [src/app/globals.css](src/app/globals.css) (`--color-primary`, `--color-secondary`, `--color-secondary-bold`).
- Path alias: `@/*` → `./src/*`.
