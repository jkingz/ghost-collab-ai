"use client"

import * as React from "react"
import { EditorNavbar } from "./editor-navbar"
import { ProjectSidebar } from "./project-sidebar"
import type { Project } from "@/types/project"

interface EditorLayoutProps {
  children: React.ReactNode
  onCreateProject?: () => void
  onRenameProject?: (projectId: string, currentName: string) => void
  onDeleteProject?: (projectId: string, projectName: string) => void
  projects: Project[]
  isProjectsLoading: boolean
  projectsError: string | null
}

export function EditorLayout({
  children,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
  projects,
  isProjectsLoading,
  projectsError,
}: EditorLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onCreateProject={onCreateProject}
        onRenameProject={onRenameProject}
        onDeleteProject={onDeleteProject}
        projects={projects}
        isLoading={isProjectsLoading}
        error={projectsError}
      />
      <main className="flex-1 pt-14 flex flex-col">
        {children}
      </main>
    </div>
  )
}
