drop policy if exists "Users can view accessible projects" on public.projects;
drop policy if exists "Users can create projects they own" on public.projects;
drop policy if exists "Owners can update projects" on public.projects;
drop policy if exists "Owners can delete projects" on public.projects;
drop policy if exists "Users can view project memberships" on public.project_members;
drop policy if exists "Owners can add project memberships" on public.project_members;
drop policy if exists "Owners can remove project memberships" on public.project_members;

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
