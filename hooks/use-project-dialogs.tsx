"use client"

import { useState } from "react"
import type { Project } from "@/types/project"

type DialogType = "create" | "rename" | "delete" | null

interface ProjectDialogState {
  type: DialogType
  projectId?: string
  projectName?: string
}

export function useProjectDialogs(onProjectsChanged?: () => Promise<void>) {
  const [dialogState, setDialogState] = useState<ProjectDialogState>({
    type: null,
  })
  const [formState, setFormState] = useState({
    name: "",
    slug: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generate slug from name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  // Open dialogs
  const openCreateDialog = () => {
    setDialogState({ type: "create" })
    setFormState({ name: "", slug: "" })
    setError(null)
  }

  const openRenameDialog = (projectId: string, currentName: string) => {
    setDialogState({ type: "rename", projectId, projectName: currentName })
    setFormState({ name: currentName, slug: generateSlug(currentName) })
    setError(null)
  }

  const openDeleteDialog = (projectId: string, projectName: string) => {
    setDialogState({ type: "delete", projectId, projectName })
    setError(null)
  }

  // Close dialog
  const closeDialog = () => {
    setDialogState({ type: null })
    setFormState({ name: "", slug: "" })
    setIsLoading(false)
    setError(null)
  }

  // Update name and auto-generate slug
  const updateName = (name: string) => {
    setFormState({
      name,
      slug: generateSlug(name),
    })
  }

  // Handle create project
  const handleCreate = async () => {
    if (!formState.name.trim()) return

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formState.name }),
      })
      const body = (await response.json()) as { error?: string; project?: Project }
      if (!response.ok) throw new Error(body.error || "Unable to create project")
      await onProjectsChanged?.()
      closeDialog()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to create project")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle rename project
  const handleRename = async () => {
    if (!formState.name.trim() || !dialogState.projectId) return

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/projects/${dialogState.projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formState.name }),
      })
      const body = (await response.json()) as { error?: string; project?: Project }
      if (!response.ok) throw new Error(body.error || "Unable to rename project")
      await onProjectsChanged?.()
      closeDialog()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to rename project")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle delete project
  const handleDelete = async () => {
    if (!dialogState.projectId) return

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/projects/${dialogState.projectId}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const body = (await response.json()) as { error?: string }
        throw new Error(body.error || "Unable to delete project")
      }
      await onProjectsChanged?.()
      closeDialog()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to delete project")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    dialogState,
    formState,
    isLoading,
    error,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    updateName,
    handleCreate,
    handleRename,
    handleDelete,
  }
}
