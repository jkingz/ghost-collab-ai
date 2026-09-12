"use client"

import * as React from "react"
import { EditorLayout } from "@/components/editor/editor-layout"
import {
  ProjectDialogProvider,
  useProjectDialogContext,
} from "@/components/editor/project-dialog-context"

function EditorLayoutWithContext({ children }: { children: React.ReactNode }) {
  const {
    projects,
    isProjectsLoading,
    projectsError,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
  } = useProjectDialogContext()

  return (
    <EditorLayout
      onCreateProject={openCreateDialog}
      onRenameProject={openRenameDialog}
      onDeleteProject={openDeleteDialog}
      projects={projects}
      isProjectsLoading={isProjectsLoading}
      projectsError={projectsError}
    >
      {children}
    </EditorLayout>
  )
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProjectDialogProvider>
      <EditorLayoutWithContext>{children}</EditorLayoutWithContext>
    </ProjectDialogProvider>
  )
}
