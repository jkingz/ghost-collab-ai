"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { X, Plus, MoreVertical, Edit2, Trash2, FolderKanban } from "lucide-react"

export interface Project {
  id: string
  name: string
  slug: string
  updatedAt: string
  isOwner: boolean
}

// Mock project data
export const MOCK_OWNED_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "E-Commerce Architecture",
    slug: "e-commerce-architecture",
    updatedAt: "2 hours ago",
    isOwner: true,
  },
  {
    id: "proj-2",
    name: "Payment Processing Service",
    slug: "payment-processing-service",
    updatedAt: "Yesterday",
    isOwner: true,
  },
  {
    id: "proj-3",
    name: "Realtime Analytics Engine",
    slug: "realtime-analytics-engine",
    updatedAt: "3 days ago",
    isOwner: true,
  },
]

export const MOCK_SHARED_PROJECTS: Project[] = [
  {
    id: "proj-4",
    name: "Global Identity & Auth",
    slug: "global-identity-auth",
    updatedAt: "5 days ago",
    isOwner: false,
  },
]

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  onCreateProject?: () => void
  onRenameProject?: (projectId: string, currentName: string) => void
  onDeleteProject?: (projectId: string, projectName: string) => void
}

export function ProjectSidebar({
  isOpen,
  onClose,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop scrim / overlay for mobile and desktop click-outside */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <aside className="fixed top-0 left-0 bottom-0 w-80 bg-card border-r border-border z-50 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-heading font-medium text-lg text-card-foreground">
              Projects
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close projects sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs for Project Categories */}
        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          <Tabs defaultValue="my-projects" className="flex-1 flex flex-col">
            <TabsList className="w-full grid grid-cols-2 p-1 bg-muted/60 rounded-xl border border-border">
              <TabsTrigger
                value="my-projects"
                className="rounded-lg text-xs font-medium text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all cursor-pointer"
              >
                My Projects ({MOCK_OWNED_PROJECTS.length})
              </TabsTrigger>
              <TabsTrigger
                value="shared"
                className="rounded-lg text-xs font-medium text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all cursor-pointer"
              >
                Shared ({MOCK_SHARED_PROJECTS.length})
              </TabsTrigger>
            </TabsList>

            {/* Owned Projects Tab */}
            <TabsContent
              value="my-projects"
              className="flex-1 mt-4 overflow-y-auto space-y-2 pr-1"
            >
              {MOCK_OWNED_PROJECTS.length === 0 ? (
                <div className="h-full flex items-center justify-center border border-dashed border-border rounded-xl p-6 text-center text-muted-foreground text-sm bg-muted/20">
                  No projects yet. Create your first project below.
                </div>
              ) : (
                MOCK_OWNED_PROJECTS.map((project) => (
                  <div
                    key={project.id}
                    className="group flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-border bg-card/50 hover:bg-accent/40 transition-colors cursor-pointer"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-sm font-medium text-foreground truncate">
                        {project.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Updated {project.updatedAt}
                      </p>
                    </div>

                    {/* Actions dropdown - ONLY for owned projects */}
                    {project.isOwner && (
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="opacity-80 group-hover:opacity-100 hover:bg-muted"
                              aria-label={`Actions for ${project.name}`}
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end" side="bottom">
                          <DropdownMenuItem
                            onClick={() =>
                              onRenameProject?.(project.id, project.name)
                            }
                            className="cursor-pointer"
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() =>
                              onDeleteProject?.(project.id, project.name)
                            }
                            className="cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                ))
              )}
            </TabsContent>

            {/* Shared Projects Tab */}
            <TabsContent
              value="shared"
              className="flex-1 mt-4 overflow-y-auto space-y-2 pr-1"
            >
              {MOCK_SHARED_PROJECTS.length === 0 ? (
                <div className="h-full flex items-center justify-center border border-dashed border-border rounded-xl p-6 text-center text-muted-foreground text-sm bg-muted/20">
                  No shared projects available.
                </div>
              ) : (
                MOCK_SHARED_PROJECTS.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-border bg-card/50 hover:bg-accent/40 transition-colors cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {project.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Updated {project.updatedAt}
                      </p>
                    </div>
                    {/* No action menu for shared projects */}
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer with New Project Action */}
        <div className="p-4 border-t border-border">
          <Button
            onClick={onCreateProject}
            className="w-full"
            size="default"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}
