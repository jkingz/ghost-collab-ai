"use client"

import { useCallback, useEffect, useState } from "react"
import type { Project } from "@/types/project"

interface ProjectsResponse {
  projects?: Project[]
  error?: string
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshProjects = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/projects", { cache: "no-store" })
      const body = (await response.json()) as ProjectsResponse
      if (!response.ok) throw new Error(body.error || "Unable to load projects")
      setProjects(body.projects || [])
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load projects"
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    fetch("/api/projects", { cache: "no-store" })
      .then(async (response) => {
        const body = (await response.json()) as ProjectsResponse
        if (!response.ok) throw new Error(body.error || "Unable to load projects")
        if (!cancelled) setProjects(body.projects || [])
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load projects"
          )
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { projects, isLoading, error, refreshProjects }
}
