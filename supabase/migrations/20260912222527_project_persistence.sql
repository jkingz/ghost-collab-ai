create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_name_length check (char_length(trim(name)) between 1 and 120),
  constraint projects_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id text not null,
  role text not null default 'collaborator',
  created_at timestamptz not null default now(),
  primary key (project_id, user_id),
  constraint project_members_role_check check (role = 'collaborator')
);

create index project_members_user_id_idx on public.project_members(user_id);

grant select, insert, update, delete on public.projects to authenticated;
grant select, insert, delete on public.project_members to authenticated;

alter table public.projects enable row level security;
alter table public.project_members enable row level security;

create policy "Users can view accessible projects"
  on public.projects
  for select
  to authenticated
  using (
    owner_id = ((select auth.jwt()) ->> 'sub')
    or exists (
      select 1
      from public.project_members
      where project_members.project_id = projects.id
        and project_members.user_id = ((select auth.jwt()) ->> 'sub')
    )
  );

create policy "Users can create projects they own"
  on public.projects
  for insert
  to authenticated
  with check (owner_id = ((select auth.jwt()) ->> 'sub'));

create policy "Owners can update projects"
  on public.projects
  for update
  to authenticated
  using (owner_id = ((select auth.jwt()) ->> 'sub'))
  with check (owner_id = ((select auth.jwt()) ->> 'sub'));

create policy "Owners can delete projects"
  on public.projects
  for delete
  to authenticated
  using (owner_id = ((select auth.jwt()) ->> 'sub'));

create policy "Users can view project memberships"
  on public.project_members
  for select
  to authenticated
  using (user_id = ((select auth.jwt()) ->> 'sub'));

create policy "Owners can add project memberships"
  on public.project_members
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.projects
      where projects.id = project_members.project_id
        and projects.owner_id = ((select auth.jwt()) ->> 'sub')
    )
  );

create policy "Owners can remove project memberships"
  on public.project_members
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.projects
      where projects.id = project_members.project_id
        and projects.owner_id = ((select auth.jwt()) ->> 'sub')
    )
  );
