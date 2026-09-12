"use client"

import * as React from "react"
import { createContext, useContext } from "react"
import { useProjectDialogs } from "@/hooks/use-project-dialogs"
import {
  CreateProjectDialog,
  RenameProjectDialog,
  DeleteProjectDialog,
} from "@/components/editor/project-dialogs"

interface ProjectDialogContextValue {
  openCreateDialog: () => void
  openRenameDialog: (projectId: string, currentName: string) => void
  openDeleteDialog: (projectId: string, projectName: string) => void
}

const ProjectDialogContext = createContext<ProjectDialogContextValue | null>(null)

export function useProjectDialogContext() {
  const context = useContext(ProjectDialogContext)
  if (!context) {
    throw new Error(
      "useProjectDialogContext must be used within a ProjectDialogProvider"
    )
  }
  return context
}

export function ProjectDialogProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const {
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
  } = useProjectDialogs()

  return (
    <ProjectDialogContext.Provider
      value={{
        openCreateDialog,
        openRenameDialog,
        openDeleteDialog,
      }}
    >
      {children}

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={dialogState.type === "create"}
        onOpenChange={(open) => !open && closeDialog()}
        name={formState.name}
        slug={formState.slug}
        onNameChange={updateName}
        onSubmit={handleCreate}
        isLoading={isLoading}
      />

      {/* Rename Project Dialog */}
      <RenameProjectDialog
        open={dialogState.type === "rename"}
        onOpenChange={(open) => !open && closeDialog()}
        currentName={dialogState.projectName || ""}
        name={formState.name}
        onNameChange={updateName}
        onSubmit={handleRename}
        isLoading={isLoading}
      />

      {/* Delete Project Dialog */}
      <DeleteProjectDialog
        open={dialogState.type === "delete"}
        onOpenChange={(open) => !open && closeDialog()}
        projectName={dialogState.projectName || ""}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </ProjectDialogContext.Provider>
  )
}
