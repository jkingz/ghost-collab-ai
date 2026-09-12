# Architecture Context

## Stack

| Layer            | Technology              | Role                                                           |
| ---------------- | ----------------------- | -------------------------------------------------------------- |
| Framework        | Next.js 16 + TypeScript | Full-stack app with server/client boundaries                   |
| UI               | Tailwind + shadcn/ui    | Component composition and styling                              |
| Auth             | Clerk                   | User identity, session tokens, and route protection             |
| Database         | Supabase Postgres       | Project metadata, ownership, memberships, specs, and task runs |
| Database client  | `@supabase/supabase-js` | Server-side database access with Clerk access tokens            |
| Canvas           | Liveblocks + React Flow | Real-time collaborative canvas, presence, and cursors          |
| Background tasks | Trigger.dev             | Durable AI generation workflows                                |
| Artifact storage | Vercel Blob             | Canvas snapshots and generated Markdown specs                  |

## System Boundaries

- `app/api` — authenticated request handlers: input validation, ownership checks, database mutations, and task triggering.
- `trigger` — long-running background jobs: AI design generation and spec generation.
- `lib/supabase` — Supabase client construction with Clerk access tokens.
- `lib/projects` — project persistence operations, validation, slug generation, and database error translation.
- `components` — UI composition: canvas surfaces, sidebars, dialogs, and interactive elements.
- `types` — shared TypeScript contracts for persisted domain data and canvas data.
- `supabase/migrations` — versioned Postgres schema, grants, indexes, and RLS policies.
- `data` — legacy local directory. Not used for new artifacts.

## Storage Model

- **Supabase Postgres**: project metadata, ownership, collaborator memberships, and future spec/task-run metadata.
- **Vercel Blob**: generated artifacts — canvas snapshots at `canvas/{projectId}.json` and specs at `specs/{projectId}/{specId}.md`.
- Project records, membership records, spec records, and task-run records belong in Supabase Postgres.
- Canvas content and Markdown output are stored in Vercel Blob and referenced from database records.
- The database stores artifact URLs/paths rather than large generated content.

### Current persistence schema

- `projects`: UUID identity, Clerk owner ID, name, unique slug, and timestamps.
- `project_members`: project/user membership rows with the `collaborator` role.
- Owners are stored on `projects`; collaborators are stored in `project_members`.
- Future canvas/spec/task tables reference `projects.id` with cascading project ownership semantics where appropriate.

## Auth and Collaboration Model

- Clerk remains the application identity provider; Supabase Auth is not used for sign-in UI or session management.
- Clerk is configured as a Supabase Third-Party Auth provider.
- Server requests pass a Clerk session token to Supabase through the Supabase client `accessToken` option.
- Clerk session tokens must include the `role: authenticated` claim for Supabase access.
- Clerk user IDs are stored as text values from the token `sub` claim.
- Every project has a single owner.
- Projects can include additional collaborator memberships.
- Only authenticated users can access protected routes.
- Supabase RLS allows owners to mutate project metadata and memberships; collaborators can read accessible projects.
- Liveblocks room tokens are issued only after verifying project membership.

## Project Persistence API

- `GET /api/projects` — list projects visible to the authenticated user.
- `POST /api/projects` — create an owned project from a validated name.
- `GET /api/projects/{projectId}` — retrieve one accessible project.
- `PATCH /api/projects/{projectId}` — rename an owned project and update its slug.
- `DELETE /api/projects/{projectId}` — delete an owned project and cascade memberships.

Route handlers remain thin. They authenticate through Clerk, validate input, create the Supabase client, and delegate persistence behavior to `lib/projects/project-service.ts`.

## Starter System Designs

- Prebuilt templates are static canvas snapshots stored in the codebase.
- Templates are loaded into the active Liveblocks room when a user imports one.
- Import can occur on canvas creation or from within the editor at any time.
- Template data follows the same node/edge schema as user-created canvas content.
- Templates do not require a separate database record; they are resolved by template ID at import time.

## AI Generation Model

### Design Generation

- Input: user prompt, project context, and current canvas state.
- Execution: durable background task via Trigger.dev.
- Output: structured node and edge updates written into the shared Liveblocks room.

### Spec Generation

- Input: current canvas graph and project context.
- Execution: durable background task via Trigger.dev.
- Output: Markdown technical spec saved to Vercel Blob and linked to the project in Supabase.

## Invariants

1. Request handlers do not run long-lived AI work — that belongs in background tasks.
2. Metadata and large generated artifacts are stored in separate layers.
3. Auth and ownership are enforced at every mutation boundary and backed by Supabase RLS.
4. The Supabase publishable key may be exposed to the browser; secret/service-role keys must never be exposed.
5. Client components are used only where browser interactivity or real-time state requires it.
6. The canvas schema must remain consistent between user-created content and imported templates.
7. Every exposed Supabase table has RLS enabled and policies matching the actual ownership/membership model.
