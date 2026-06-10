# Bookmarks

A personal bookmark manager — save links, keep some private, share others publicly via your `@handle`.

**Live URL:** [https://eagerminds-bookmarksx.vercel.app](https://eagerminds-bookmarksx.vercel.app)  
**GitHub:** [github.com/het2576/Eagermind-bookmarks](https://github.com/het2576/Eagermind-bookmarks)

---

## Stack

- **Next.js 14** — App Router, TypeScript
- **Supabase** — authentication + Postgres database with Row Level Security
- **Resend** — transactional welcome email
- **Tailwind CSS + shadcn/ui** — UI components
- **Vercel** — deployment

---

## Running Locally

1. Clone the repo:
```bash
   git clone https://github.com/your-username/eagerminds-bookmarks.git
   cd eagerminds-bookmarks
```

2. Install dependencies:
```bash
   npm install
```

3. Create `.env.local` in the root and fill in your values:
```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   RESEND_API_KEY=your_resend_api_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the schema in your Supabase SQL editor — the full SQL is in `/db/schema.sql`.

5. In your Supabase dashboard, go to **Authentication → URL Configuration** and set:
   - Site URL: `http://localhost:3000`
   - Redirect URL: `http://localhost:3000/confirm`

6. Start the dev server:
```bash
   npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

---

## Where the AI Agent Got It Wrong

When setting up Supabase auth checks in server-side route handlers, Cursor initially used `getSession()` to verify whether a user was authenticated. I caught this while reviewing the generated code because the Supabase docs explicitly warn that `getSession()` reads the session from the cookie without re-validating it with Supabase's servers — meaning a manipulated cookie could bypass auth entirely. I corrected every route handler and server component to use `getUser()` instead, which makes a live network call to Supabase and returns a verified user or null. This is a subtle but critical difference in a security-sensitive app.

---

## Session Recording Note

I used Cursor with Entire CLI for session recording. The first 4 commits were made before I confirmed Entire was syncing correctly — I caught this and fixed the configuration before continuing, so commits 5–10 have full checkpoint recordings on the `entire/checkpoints/v1` branch. The final two commit's session didn't sync due to hitting the Cursor usage limit mid-session and switching to Codex. All 12 commits are visible on the main branch and reflect the full progression of the build.

---

## One Thing I'd Improve With More Time

I'd add **bookmark collections** — named groups a user can organize their links into (e.g. "Design", "Dev Tools", "Reading List"). The current schema would need a `collections` table with a `user_id` foreign key, and a `collection_id` nullable column on `bookmarks`. The public profile page could then render bookmarks grouped by collection, making the page far more useful as an actual shareable linktree alternative.

---

## Project Structure

```
app/
  (auth)/         → login, signup, confirm pages
  (protected)/    → dashboard, settings (auth-gated)
  [handle]/       → public profile page (no auth required)
  api/            → bookmarks CRUD, auth, email routes
components/
  auth/           → LoginForm, SignupForm
  bookmarks/      → BookmarkCard, BookmarkForm, BookmarkList
  ui/             → shadcn components + ThemeToggle
lib/
  supabase/       → browser + server clients, middleware helper
  resend/         → client + email templates
  types/          → shared TypeScript types
db/
  schema.sql      → full Supabase schema + RLS policies
middleware.ts     → route protection + session refresh
```