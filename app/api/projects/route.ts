import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import {
  createProject,
  listProjects,
  ProjectServiceError,
} from "@/lib/projects/project-service"

function errorResponse(error: unknown) {
  if (error instanceof ProjectServiceError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }
  return NextResponse.json({ error: "Unexpected server error" }, { status: 500 })
}

export async function GET() {
  const { userId, getToken } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const supabase = createSupabaseServerClient({ getToken })
    return NextResponse.json({ projects: await listProjects(supabase, userId) })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function POST(request: Request) {
  const { userId, getToken } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body: unknown = await request.json()
    if (!body || typeof body !== "object" || !("name" in body)) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 })
    }

    const name = (body as { name: unknown }).name
    if (typeof name !== "string") {
      return NextResponse.json({ error: "Project name must be a string" }, { status: 400 })
    }

    const supabase = createSupabaseServerClient({ getToken })
    const project = await createProject(supabase, userId, { name })
    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    return errorResponse(error)
  }
}
