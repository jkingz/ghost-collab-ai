# Supabase Integration

Supabase Postgres serves as the primary database for project metadata, ownership, and memberships. Clerk provides authentication; Supabase Auth is not used.

## Implementation

**Database tables:**
- `projects` — project records with owner, name, slug, timestamps
- `project_members` — collaborator memberships with cascade delete

**Client setup:**
- `lib/supabase/server.ts` — server-side client with Clerk token integration
- Uses `createClient` with `accessToken` option for RLS enforcement

**Row-Level Security:**
- Owners can create, read, update, delete their projects
- Collaborators can read projects they're members of
- Only owners can manage project memberships

**Integration points:**
- Clerk configured as Supabase Third-Party Auth provider
- Clerk user IDs stored as text from JWT `sub` claim
- API routes use `auth()` → `getToken` → Supabase client

**Migrations:**
- `20260912222527_project_persistence.sql` — schema and RLS
- `20260912224316_optimize_project_policies.sql` — policy refinements

## Future Extensions

Prepared for:
- Supabase Storage (canvas snapshots, generated specs)
- Liveblocks integration (room access verification)
- Trigger.dev tasks (background job metadata tracking)

See [@supabase-integration.md](../../docs/supabase-integration.md) for detailed schema, RLS policies, migration paths, and integration patterns.
