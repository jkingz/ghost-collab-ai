import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import {
  deleteProject,
  getProject,
  ProjectServiceError,
  renameProject,
} from "@/lib/projects/project-service"

function errorResponse(error: unknown) {
  if (error instanceof ProjectServiceError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }
  return NextResponse.json({ error: "Unexpected server error" }, { status: 500 })
}

interface RouteContext {
  params: Promise<{ projectId: string }>
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { userId, getToken } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { projectId } = await params
    const supabase = createSupabaseServerClient({ getToken })
    const project = await getProject(supabase, userId, projectId)
    return NextResponse.json({ project })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
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

    const { projectId } = await params
    const supabase = createSupabaseServerClient({ getToken })
    const project = await renameProject(supabase, userId, { projectId, name })
    return NextResponse.json({ project })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { userId, getToken } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { projectId } = await params
    const supabase = createSupabaseServerClient({ getToken })
    await deleteProject(supabase, projectId)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return errorResponse(error)
  }
}
