import type { SupabaseClient } from "@supabase/supabase-js"
import type { Project, ProjectRow } from "@/types/project"

export class ProjectServiceError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message)
    this.name = "ProjectServiceError"
  }
}

interface ProjectInput {
  name: string
}

interface ProjectUpdate extends ProjectInput {
  projectId: string
}

function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, " ")
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function assertProjectName(name: string): string {
  const normalizedName = normalizeName(name)
  if (normalizedName.length < 1 || normalizedName.length > 120) {
    throw new ProjectServiceError(
      "Project name must be between 1 and 120 characters",
      400
    )
  }

  const slug = slugify(normalizedName)
  if (!slug) {
    throw new ProjectServiceError(
      "Project name must contain at least one letter or number",
      400
    )
  }

  return normalizedName
}

function toProject(row: ProjectRow, userId: string): Project {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    updatedAt: row.updated_at,
    isOwner: row.owner_id === userId,
  }
}

function isUniqueViolation(error: { code?: string } | null): boolean {
  return error?.code === "23505"
}

async function insertWithAvailableSlug(
  supabase: SupabaseClient,
  ownerId: string,
  name: string
): Promise<ProjectRow> {
  const baseSlug = slugify(name)

  for (let suffix = 0; suffix < 10; suffix += 1) {
    const slug = suffix === 0 ? baseSlug : `${baseSlug}-${suffix + 1}`
    const { data, error } = await supabase
      .from("projects")
      .insert({ owner_id: ownerId, name, slug })
      .select("id, owner_id, name, slug, created_at, updated_at")
      .single()

    if (!error && data) return data as ProjectRow
    if (!isUniqueViolation(error)) {
      throw new ProjectServiceError("Unable to create project", 500)
    }
  }

  throw new ProjectServiceError(
    "Unable to generate a unique project slug",
    409
  )
}

export async function listProjects(
  supabase: SupabaseClient,
  userId: string
): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("id, owner_id, name, slug, created_at, updated_at")
    .order("updated_at", { ascending: false })

  if (error) throw new ProjectServiceError("Unable to load projects", 500)
  return (data as ProjectRow[]).map((row) => toProject(row, userId))
}

export async function getProject(
  supabase: SupabaseClient,
  userId: string,
  projectId: string
): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .select("id, owner_id, name, slug, created_at, updated_at")
    .eq("id", projectId)
    .maybeSingle()

  if (error || !data) {
    throw new ProjectServiceError("Project not found", 404)
  }
  return toProject(data as ProjectRow, userId)
}

export async function createProject(
  supabase: SupabaseClient,
  userId: string,
  input: ProjectInput
): Promise<Project> {
  const name = assertProjectName(input.name)
  const row = await insertWithAvailableSlug(supabase, userId, name)
  return toProject(row, userId)
}

export async function renameProject(
  supabase: SupabaseClient,
  userId: string,
  input: ProjectUpdate
): Promise<Project> {
  const name = assertProjectName(input.name)
  const slug = slugify(name)
  const { data, error } = await supabase
    .from("projects")
    .update({ name, slug, updated_at: new Date().toISOString() })
    .eq("id", input.projectId)
    .select("id, owner_id, name, slug, created_at, updated_at")
    .single()

  if (isUniqueViolation(error)) {
    throw new ProjectServiceError("A project with this slug already exists", 409)
  }
  if (error || !data) {
    throw new ProjectServiceError("Project not found or not owned by you", 404)
  }

  const project = toProject(data as ProjectRow, userId)
  if (!project.isOwner) {
    throw new ProjectServiceError("Project not found or not owned by you", 404)
  }
  return project
}

export async function deleteProject(
  supabase: SupabaseClient,
  projectId: string
): Promise<void> {
  const { data, error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .select("id")
    .maybeSingle()
  if (error) throw new ProjectServiceError("Unable to delete project", 500)
  if (!data) throw new ProjectServiceError("Project not found or not owned by you", 404)
}
