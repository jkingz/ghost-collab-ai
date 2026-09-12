# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- Complete (05-project-persistence-code)

## Current Goal

- Configure Clerk as the Supabase Third-Party Auth provider so authenticated project requests can pass RLS.

## Completed

- `01-design-system.md`:
  - Installed and configured shadcn/ui with Tailwind CSS v4.
  - Installed lucide-react and the shared `cn()` helper.
  - Added Button, Card, Dialog, Input, Tabs, Textarea, and ScrollArea primitives.
  - Configured the dark-only styling system.

- `02-editor.md`:
  - Added the editor navbar and floating project sidebar shell.
  - Added project tabs, empty states, sidebar toggle, and mobile backdrop behavior.

- `03-auth.md`:
  - Configured ClerkProvider with Clerk's dark theme mapped to the Ghost Collab AI CSS design tokens.
  - Applied the Clerk warning-orange primary action, near-black card/input surfaces, muted text, borders, focus ring, danger state, Geist typography, and rounded-corner decisions to Clerk components.
  - Updated sign-in and sign-up to use a responsive 50/50 split layout with Ghost Collab AI product information on the left and Clerk forms on the right.
  - Added a shared `AuthProductPanel` so both auth routes use the same product messaging and visual language.
  - Explicitly configured Clerk path routing and local sign-in/sign-up redirect URLs so auth stays on `/sign-in`, `/sign-up`, and `/editor` instead of falling back to the hosted `accounts.dev` page.
  - Added protected routes through root `proxy.ts`.
  - Added sign-in/sign-up pages, redirects, and the editor UserButton.

- `04-project-dialogs.md`:
  - Added create, rename, and delete project dialogs.
  - Added live slug previews and dialog state management.
  - Wired editor home and sidebar actions to the dialogs.

- `05-project-persistence`:
  - Installed pinned `@supabase/supabase-js@2.116.0`.
  - Added `projects` and `project_members` Supabase migration tables.
  - Added grants, indexes, constraints, cascading membership deletes, and RLS policies.
  - Added Clerk-token-backed Supabase server client construction.
  - Added project service validation, slug generation, CRUD operations, and database error translation.
  - Added authenticated project API routes for list, create, retrieve, rename, and delete.
  - Replaced mock sidebar projects with fetched project data.
  - Wired create, rename, and delete dialogs to the API and refresh behavior.
  - Added loading and request-error states to the project sidebar and dialogs.
  - Updated architecture and code standards to use Supabase instead of Prisma.

## In Progress

- Supabase project and migrations are configured. Clerk Third-Party Auth is still pending in the Supabase dashboard.

## Open Questions

- No product questions for the current persistence slice.
- Invitation UX and collaborator management remain deferred until the collaboration feature.

## Architecture Decisions

- Clerk remains the identity provider; Supabase Auth is not used for application sign-in.
- Clerk UI uses the `dark` base theme from `@clerk/ui/themes`, with appearance variables mapped to the shared `globals.css` tokens instead of a separate auth color system.
- Clerk sign-in/sign-up cards are flat dark surfaces with subtle borders; primary actions use the Clerk warning-orange token, and inputs/social buttons use the existing dark surface hierarchy.
- Geist Sans is the shared Clerk UI font and Geist Mono is used for code/OTP-oriented text.
- The built-in Clerk UserButton and profile flows remain behaviorally unchanged; only their visual foundation is themed.
- Clerk session tokens are passed to Supabase through the server client `accessToken` option.
- Clerk user IDs are stored as text from the token `sub` claim.
- Project ownership is stored on `projects.owner_id`; collaborator access is stored in `project_members`.
- Project IDs are UUIDs for internal relations; unique slugs are user-facing and regenerated on rename.
- Project metadata is stored in Supabase Postgres; large canvas/spec artifacts remain in Vercel Blob.
- RLS is enabled on all current public tables. Owners mutate project metadata and memberships; collaborators read accessible projects.

## Session Notes

- `npm run lint` passes.
- `npx tsc --noEmit` passes.
- The Supabase CLI was not globally installed; `npx supabase migration new project_persistence` created the migration successfully.
- The `project_persistence` and `optimize_project_policies` migrations are applied to the hosted `ghost-collab-ai` Supabase project.
- Supabase security advisors report no findings. The performance advisor only reports the currently unused membership index while the table is empty.
- Supabase environment variables are present in `.env.local`; the Supabase Third-Party Auth page currently has no providers configured.
