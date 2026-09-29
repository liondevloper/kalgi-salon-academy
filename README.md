# Kalgi Salon & Academy

Website and admin panel for Kalgi Salon & Academy, Ahmedabad.

- Frontend: Vite, React 19, TypeScript, Tailwind CSS 4
- Backend, database, login and image storage: Supabase
- Languages: English, Hindi, Gujarati (`/en`, `/hi`, `/gu`)
- 5 switchable themes (default: Modern Minimal), preview at `/preview`
- Admin panel at `/admin` (email and password sign in)

## Run

```
pnpm install
pnpm dev
```

Optional `.env.local` (defaults already point to the project):

```
VITE_SUPABASE_URL=https://hdpkwjdkpaspwpilucbo.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

The first admin: open `/admin`, create an account with `liondevloper@gmail.com`, then press "Become owner". The owner can add more admins from the Admins page.

The shadcn UI components in `src/components/ui` are generated with `npx shadcn@latest add --all` (see `components.json`).
