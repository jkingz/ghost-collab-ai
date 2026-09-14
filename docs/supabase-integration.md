# Supabase Integration Documentation

Complete reference for Supabase setup, schema, security policies, and integration with Clerk, Liveblocks, and Trigger.dev.

## Current Setup

### Database Schema

**`projects`**
```sql
id              uuid primary key default gen_random_uuid()
owner_id        text not null
name            text not null
slug            text not null unique
created_at      timestamptz not null default now()
updated_at      timestamptz not null default now()

constraint projects_name_length check (char_length(trim(name)) between 1 and 120)
constraint projects_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
```

**`project_members`**
```sql
project_id      uuid not null references projects(id) on delete cascade
user_id         text not null
role            text not null default 'collaborator'
created_at      timestamptz not null default now()

primary key (project_id, user_id)
constraint project_members_role_check check (role = 'collaborator')
index project_members_user_id_idx on user_id
```

Owners are stored in `projects.owner_id`; collaborators in `project_members`.

### Row-Level Security Policies

**Projects:**
- `SELECT`: owners and collaborators can view
- `INSERT`: users can create projects they own
- `UPDATE`: only owners can modify
- `DELETE`: only owners can delete

**Project Members:**
- `SELECT`: users can view their own memberships
- `INSERT`: only project owners can add collaborators
- `DELETE`: only project owners can remove collaborators

All policies use `(select auth.jwt()) ->> 'sub'` to extract Clerk user IDs from session tokens.

### Client Construction

```typescript
// lib/supabase/server.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

interface SupabaseServerOptions {
  getToken: () => Promise<string | null>
}

export function createSupabaseServerClient({
  getToken,
}: SupabaseServerOptions): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !publishableKey) {
    throw new Error("Supabase environment variables are not configured")
  }

  return createClient(url, publishableKey, {
    accessToken: getToken,
  })
}
```

### Clerk Integration

- Clerk configured as Supabase Third-Party Auth provider
- Clerk session tokens include `role: authenticated` claim for Supabase RLS
- Clerk user IDs (from `sub` claim) stored as text in `owner_id` and `user_id` columns
- API routes call `auth()` to get Clerk session, then pass `getToken` to Supabase client

### Current Migrations

- `20260912222527_project_persistence.sql` — initial schema and RLS policies
- `20260912224316_optimize_project_policies.sql` — policy refinements

## Data Access Patterns

### Server-Side (API Routes, Server Actions)

```typescript
import { auth } from "@clerk/nextjs/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET() {
  const { getToken } = await auth()
  const supabase = createSupabaseServerClient({ getToken })
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
  
  // RLS automatically filters to accessible projects
  return Response.json(data)
}
```

### Background Tasks (Trigger.dev)

```typescript
import { createClient } from "@supabase/supabase-js"

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Still verify ownership in application logic
const { data: project } = await supabase
  .from('projects')
  .select('owner_id')
  .eq('id', projectId)
  .single()

if (project.owner_id !== requestingUserId) {
  throw new Error('Unauthorized')
}
```

## Future Extensions

### Artifact Metadata Tables

**`canvas_snapshots`** (future)
```sql
id              uuid primary key default gen_random_uuid()
project_id      uuid not null references projects(id) on delete cascade
blob_path       text not null  -- Vercel Blob or Storage path
version         int not null
created_by      text not null
created_at      timestamptz not null default now()

index canvas_snapshots_project_id_idx on project_id
index canvas_snapshots_version_idx on (project_id, version desc)
```

**`specs`** (future)
```sql
id              uuid primary key default gen_random_uuid()
project_id      uuid not null references projects(id) on delete cascade
blob_path       text not null  -- Vercel Blob or Storage path
title           text not null
generated_by    text not null
task_run_id     text
created_at      timestamptz not null default now()

index specs_project_id_idx on project_id
```

**`task_runs`** (future)
```sql
id              uuid primary key default gen_random_uuid()
project_id      uuid not null references projects(id) on delete cascade
trigger_run_id  text not null unique
task_type       text not null  -- 'design_generation' | 'spec_generation'
status          text not null  -- 'pending' | 'running' | 'completed' | 'failed'
started_by      text not null
started_at      timestamptz not null default now()
completed_at    timestamptz
error_message   text

constraint task_runs_type_check check (task_type in ('design_generation', 'spec_generation'))
constraint task_runs_status_check check (status in ('pending', 'running', 'completed', 'failed'))
index task_runs_project_id_idx on project_id
index task_runs_status_idx on status
```

All future tables need:
- RLS enabled
- Policies for owners and collaborators to read
- Policies for owners to delete
- Foreign key cascade on project deletion

### Supabase Storage Migration

When migrating from Vercel Blob to Supabase Storage:

**1. Create storage buckets:**
```sql
insert into storage.buckets (id, name, public)
values 
  ('canvas-snapshots', 'canvas-snapshots', false),
  ('generated-specs', 'generated-specs', false);
```

**2. Storage RLS policies:**
```sql
-- Canvas snapshots: upload policy
create policy "Users can upload canvas snapshots"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'canvas-snapshots'
    and exists (
      select 1 from public.projects
      where id::text = (storage.foldername(name))[1]
        and (
          owner_id = ((select auth.jwt()) ->> 'sub')
          or exists (
            select 1 from public.project_members
            where project_members.project_id = projects.id
              and project_members.user_id = ((select auth.jwt()) ->> 'sub')
          )
        )
    )
  );

-- Canvas snapshots: read policy
create policy "Users can read canvas snapshots"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'canvas-snapshots'
    and exists (
      select 1 from public.projects
      where id::text = (storage.foldername(name))[1]
        and (
          owner_id = ((select auth.jwt()) ->> 'sub')
          or exists (
            select 1 from public.project_members
            where project_members.project_id = projects.id
              and project_members.user_id = ((select auth.jwt()) ->> 'sub')
          )
        )
    )
  );

-- Similar policies for generated-specs bucket
```

**3. Path structure:**
- Canvas: `{projectId}/canvas-{version}.json`
- Specs: `{projectId}/specs/{specId}.md`

**4. Client usage:**
```typescript
const { data, error } = await supabase.storage
  .from('canvas-snapshots')
  .upload(`${projectId}/canvas-${version}.json`, jsonBlob, {
    contentType: 'application/json',
    upsert: false
  })

const { data: url } = supabase.storage
  .from('canvas-snapshots')
  .getPublicUrl(`${projectId}/canvas-${version}.json`)
```

**5. Update `blob_path` columns** to store Storage paths instead of Vercel Blob URLs.

### Liveblocks Integration

Liveblocks handles real-time collaboration state; Supabase stores persistent metadata:

**Room access control:**
```typescript
// app/api/liveblocks-auth/route.ts
import { auth } from "@clerk/nextjs/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { Liveblocks } from "@liveblocks/node"

const liveblocks = new Liveblocks({ secret: process.env.LIVEBLOCKS_SECRET_KEY! })

export async function POST(request: Request) {
  const { getToken, userId } = await auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const { room } = await request.json()
  const projectId = room.replace('project:', '')

  // Verify project access via Supabase
  const supabase = createSupabaseServerClient({ getToken })
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .single()

  if (!project) return new Response('Forbidden', { status: 403 })

  // Issue room token
  const session = liveblocks.prepareSession(userId, {
    userInfo: { name: 'User Name' }
  })
  session.allow(room, session.FULL_ACCESS)
  
  const { body, status } = await session.authorize()
  return new Response(body, { status })
}
```

**Canvas snapshot workflow:**
1. User triggers snapshot save
2. Canvas state exported from Liveblocks
3. JSON uploaded to Supabase Storage or Vercel Blob
4. Metadata row inserted into `canvas_snapshots` table
5. Latest snapshot path stored on `projects` table (optional)

**Room naming convention:** `project:{projectId}` for consistent mapping.

### Trigger.dev Integration

Background tasks reference Supabase for context and persistence:

**Task execution pattern:**
```typescript
import { task } from "@trigger.dev/sdk/v3"
import { createClient } from "@supabase/supabase-js"

export const generateDesign = task({
  id: "generate-design",
  run: async (payload: { projectId: string; userId: string; prompt: string }) => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verify ownership
    const { data: project } = await supabase
      .from('projects')
      .select('owner_id')
      .eq('id', payload.projectId)
      .single()

    if (project?.owner_id !== payload.userId) {
      throw new Error('Unauthorized')
    }

    // Create task run record
    const { data: taskRun } = await supabase
      .from('task_runs')
      .insert({
        project_id: payload.projectId,
        trigger_run_id: context.run.id,
        task_type: 'design_generation',
        status: 'running',
        started_by: payload.userId
      })
      .select()
      .single()

    try {
      // Generate design...
      const result = await generateDesignFromPrompt(payload.prompt)

      // Update status
      await supabase
        .from('task_runs')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', taskRun.id)

      return result
    } catch (error) {
      // Log error
      await supabase
        .from('task_runs')
        .update({ 
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_message: error.message
        })
        .eq('id', taskRun.id)

      throw error
    }
  }
})
```

**Triggering from API routes:**
```typescript
import { tasks } from "@trigger.dev/sdk/v3"
import { generateDesign } from "@/trigger/generate-design"

export async function POST(request: Request) {
  const { userId } = await auth()
  const { projectId, prompt } = await request.json()

  const handle = await tasks.trigger<typeof generateDesign>(
    "generate-design",
    { projectId, userId, prompt }
  )

  return Response.json({ runId: handle.id })
}
```

## Environment Variables

**Current:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://dwydopeutiwjhclptril.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

**Future additions:**
```bash
SUPABASE_SERVICE_ROLE_KEY=...      # for Trigger.dev tasks and admin operations
LIVEBLOCKS_SECRET_KEY=...          # for room access token generation
TRIGGER_API_KEY=...                # for triggering background tasks
TRIGGER_API_URL=...                # Trigger.dev endpoint
```

**Security constraints:**
- `NEXT_PUBLIC_*` keys may be exposed to browsers; publishable key is safe
- `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS; never expose to client
- Use service role key only in Trigger.dev tasks and server-only operations
- Verify project ownership in application code even when using service role

## Migration Workflow

**Creating a new migration:**
```bash
supabase migration new descriptive_name
```

**Migration file structure:**
```sql
-- Enable RLS
alter table public.new_table enable row level security;

-- Create table
create table public.new_table (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  -- other columns
  created_at timestamptz not null default now()
);

-- Create indexes
create index new_table_project_id_idx on public.new_table(project_id);

-- Grant permissions
grant select, insert, update, delete on public.new_table to authenticated;

-- Create RLS policies
create policy "Users can view accessible records"
  on public.new_table
  for select
  to authenticated
  using (
    exists (
      select 1 from public.projects
      where projects.id = new_table.project_id
        and (
          projects.owner_id = ((select auth.jwt()) ->> 'sub')
          or exists (
            select 1 from public.project_members
            where project_members.project_id = projects.id
              and project_members.user_id = ((select auth.jwt()) ->> 'sub')
          )
        )
    )
  );
```

**Testing locally:**
```bash
supabase db reset  # applies all migrations
```

**Applying to production:**
```bash
supabase db push
# or via Supabase Dashboard > Database > Migrations
```

**Generating TypeScript types:**
```bash
supabase gen types typescript --local > types/database.ts
```

## Invariants

1. Clerk is the sole identity provider; Supabase Auth is not used for user sign-in
2. All user IDs in the database are Clerk user IDs (from JWT `sub` claim)
3. Every table has RLS enabled with policies enforcing ownership semantics
4. Publishable keys may be exposed to browsers; service role keys must remain server-only
5. Database stores artifact URLs/paths, not large generated content
6. Cascade deletes propagate project deletion to memberships and artifact metadata
7. Background tasks verify ownership even when using service role keys
8. Migration files are versioned and idempotent
9. RLS policies use `(select auth.jwt()) ->> 'sub'` to extract user IDs from Clerk tokens
10. Client components never receive service role keys
