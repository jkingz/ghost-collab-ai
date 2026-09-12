# Project Persistence

Project persistence stores Ghost Collab AI project metadata in Supabase Postgres. Clerk remains the identity provider, and the Next.js server forwards the authenticated Clerk token to Supabase so Postgres RLS can enforce ownership and membership access.

## What was added

### Database

- `supabase/migrations/20260912222527_project_persistence.sql`
  - Creates `public.projects`.
  - Creates `public.project_members`.
  - Adds constraints, grants, the membership index, cascading membership deletes, and RLS policies.
- `supabase/migrations/20260912224316_optimize_project_policies.sql`
  - Recreates the project policies using the optimized `select auth.jwt()` form.

### Server and API

- `lib/supabase/server.ts` creates a server-side Supabase client with the Clerk token.
- `lib/projects/project-service.ts` normalizes and validates names, generates unique slugs, performs CRUD operations, and translates database errors into API-safe errors.
- `app/api/projects/route.ts`
  - `GET /api/projects` lists projects visible to the current user.
  - `POST /api/projects` creates an owned project from `{ "name": "..." }`.
- `app/api/projects/[projectId]/route.ts`
  - `GET` retrieves one accessible project.
  - `PATCH` renames an owned project and regenerates its slug.
  - `DELETE` deletes an owned project and cascades its memberships.

### UI

- The editor sidebar loads projects from `GET /api/projects`.
- Create, rename, and delete dialogs call the API instead of mutating mock data.
- Loading, empty, and request-error states are shown in the project sidebar and dialogs.

## Prerequisites

1. A Supabase project.
2. A Clerk application with the Supabase integration enabled.
3. Clerk added as a Supabase Third-Party Auth provider.
4. Clerk session tokens configured with the `role: authenticated` claim.
5. Docker Desktop if you want to run Supabase locally.

The Clerk Third-Party Auth provider is required for RLS-backed requests. If it is not configured, the Next.js API can return `500` even when the migration and environment variables are present.

## Environment setup

Copy the values from `.env.example` into `.env.local`:

```bash
cp .env.example .env.local
```

Fill in these values without committing `.env.local`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
```

The Clerk variables in the same file are also required for the authenticated API routes.

## Supabase CLI commands

The project uses imperative migrations in `supabase/migrations`. Run commands from the repository root.

### Install/check the CLI

The repository does not require a global CLI installation. `npx` uses the current CLI package:

```bash
npx supabase --version
```

### First-time local setup

```bash
npx supabase init
npx supabase start
```

`supabase init` is only needed when the `supabase/` directory has not been created yet. `supabase start` requires Docker Desktop.

### Create a migration

Always let the CLI create the timestamped filename:

```bash
npx supabase migration new add_project_feature
```

Edit the generated SQL file, then review it before applying it.

### Apply migrations locally

```bash
npx supabase db reset
npx supabase migration list --local
```

`db reset` recreates the local database from the migration history, so use it only when resetting local data is acceptable.

### Link and apply migrations to the hosted project

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase db push --dry-run
npx supabase db push
npx supabase migration list --linked
```

The project ref is the identifier in the Supabase project URL or dashboard. `db push` applies pending files in `supabase/migrations` to the linked project and records them in migration history.

### Inspect database health

```bash
npx supabase db lint
npx supabase db advisors
```

Run the security and performance checks after schema or policy changes. Review any finding before considering the migration complete.

## Application verification

Start the Next.js app:

```bash
npm run dev
```

Then sign in through Clerk and exercise the project flow:

```bash
curl -i http://localhost:3000/api/projects
```

The `curl` request is only expected to return project data when it carries an authenticated browser session; otherwise `401` is correct. Test the real flow from `/editor` so the browser sends the Clerk session automatically.

Expected behavior:

- `GET /api/projects` returns `200` with `{ "projects": [] }` for a new authenticated user.
- `POST /api/projects` returns `201` and a project object.
- Renaming returns `200` and updates `name`, `slug`, and `updatedAt`.
- Deleting returns `204`.
- Unauthenticated requests return `401`.
- A collaborator can read an accessible project but cannot rename or delete it.

Run static checks before handoff:

```bash
npm run lint
npx tsc --noEmit
git diff --check
```

## Troubleshooting `500` from `/api/projects`

Check these in order:

1. Confirm `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
2. Confirm the migration history contains both project migrations:

   ```bash
   npx supabase migration list --linked
   ```

3. Confirm Clerk is configured as a Supabase Third-Party Auth provider.
4. Confirm the Clerk token contains `role: authenticated`.
5. Confirm RLS is enabled on `public.projects` and `public.project_members`.
6. Check the Next.js server log for the original Supabase error; the API intentionally returns a generic `Unexpected server error` response.
7. Run the static checks and restart the Next.js server after changing `.env.local`.

Do not fix this by exposing a service-role key to the browser or by disabling RLS.

