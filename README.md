# Kalgi Salon & Academy

Website and admin panel for Kalgi Salon & Academy, Ahmedabad.

- Frontend: Vite, React 19, TypeScript, Tailwind CSS 4
- Backend and database: Convex
- Languages: English, Hindi, Gujarati (`/en`, `/hi`, `/gu`)
- 5 switchable themes (default: Modern Minimal), preview at `/preview`
- Admin panel at `/admin`, protected by the `ADMIN_PASSWORD` environment variable set on the Convex deployment

## Run

```
pnpm install
npx convex dev
pnpm dev
```

Set `ADMIN_PASSWORD` in the Convex dashboard (Settings > Environment Variables).

The shadcn UI components in `src/components/ui` are generated with `npx shadcn@latest add --all` (see `components.json`).
