# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint (next/core-web-vitals)
```

No test framework is configured.

## Architecture

**Stack**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + MUI v6

**Backend**: Expects a REST API running at `http://localhost:8000`. Axios instance configured in [src/config/api.ts](src/config/api.ts) with a 5s timeout. All API calls go through service files in [src/services/](src/services/).

**Pages** (App Router):
- `/` — Dashboard with summary cards and charts
- `/expenses` — Expenses list and management
- `/incomes` — Incomes list and management

**Data fetching pattern**: Pages are async Server Components that fetch data server-side via `Promise.all()`. After creating/updating data in modals, the app calls `window.location.reload()` to refresh.

**Component split**:
- Page-level components live under `src/app/<route>/components/`
- Shared reusable components live under `src/shared/components/`
- Client Components (forms, modals, interactive UI) use `"use client"` directive

**Styling**: Mix of Tailwind utility classes and SCSS modules (`.module.scss`) per component. Global theme colors are defined as CSS variables in [src/app/globals.css](src/app/globals.css): `--color-primary: #6290C8`, `--color-secondary: #1F487E`, `--color-secondary-bold: #142F52`.

**Forms**: Formik + Yup for all forms. MUI components (TextField, Select, DatePicker) are used as controlled inputs inside Formik.

**Types**: Shared TypeScript interfaces are in [src/types/index.ts](src/types/index.ts).

**Path alias**: `@/*` maps to `./src/*`.

## Key Patterns

- The `Modal` component in [src/shared/components/Modal/](src/shared/components/Modal/) renders a transaction creation form that conditionally shows different fields depending on whether it's an expense or income.
- Expenses have both a `type` (e.g., "fixed", "variable") and a `category` field; incomes have a simpler shape.
- Charts use Recharts. The `DonutChart` in [src/shared/components/Charts/](src/shared/components/Charts/) and `ExpensesByTypeChart` in [src/app/components/](src/app/components/) wrap Recharts primitives.
- MUI `LocalizationProvider` (with dayjs adapter) is set up in [src/app/providers.tsx](src/app/providers.tsx) and applied in the root layout.
