"use client"

import { useState } from "react"

type DialogType = "create" | "rename" | "delete" | null

interface ProjectDialogState {
  type: DialogType
  projectId?: string
  projectName?: string
}

export function useProjectDialogs() {
  const [dialogState, setDialogState] = useState<ProjectDialogState>({
    type: null,
  })
  const [formState, setFormState] = useState({
    name: "",
    slug: "",
  })
  const [isLoading, setIsLoading] = useState(false)

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
  }

  const openRenameDialog = (projectId: string, currentName: string) => {
    setDialogState({ type: "rename", projectId, projectName: currentName })
    setFormState({ name: currentName, slug: generateSlug(currentName) })
  }

  const openDeleteDialog = (projectId: string, projectName: string) => {
    setDialogState({ type: "delete", projectId, projectName })
  }

  // Close dialog
  const closeDialog = () => {
    setDialogState({ type: null })
    setFormState({ name: "", slug: "" })
    setIsLoading(false)
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
    try {
      // Mock delay - no API call yet
      await new Promise((resolve) => setTimeout(resolve, 500))
      console.log("Creating project:", formState)
      closeDialog()
    } catch (error) {
      console.error("Error creating project:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle rename project
  const handleRename = async () => {
    if (!formState.name.trim() || !dialogState.projectId) return

    setIsLoading(true)
    try {
      // Mock delay - no API call yet
      await new Promise((resolve) => setTimeout(resolve, 500))
      console.log("Renaming project:", dialogState.projectId, formState)
      closeDialog()
    } catch (error) {
      console.error("Error renaming project:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle delete project
  const handleDelete = async () => {
    if (!dialogState.projectId) return

    setIsLoading(true)
    try {
      // Mock delay - no API call yet
      await new Promise((resolve) => setTimeout(resolve, 500))
      console.log("Deleting project:", dialogState.projectId)
      closeDialog()
    } catch (error) {
      console.error("Error deleting project:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    dialogState,
    formState,
    isLoading,
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
