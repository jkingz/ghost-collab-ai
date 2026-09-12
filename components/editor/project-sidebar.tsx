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
import type { Project } from "@/types/project"

function formatUpdatedAt(value: string): string {
  const elapsed = Date.now() - new Date(value).getTime()
  const minutes = Math.floor(elapsed / 60000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  onCreateProject?: () => void
  onRenameProject?: (projectId: string, currentName: string) => void
  onDeleteProject?: (projectId: string, projectName: string) => void
  projects: Project[]
  isLoading: boolean
  error: string | null
}

function ProjectEmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex items-center justify-center border border-dashed border-border rounded-xl p-6 text-center text-muted-foreground text-sm bg-muted/20">
      {children}
    </div>
  )
}

export function ProjectSidebar({
  isOpen,
  onClose,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
  projects,
  isLoading,
  error,
}: ProjectSidebarProps) {
  if (!isOpen) return null

  const ownedProjects = projects.filter((project) => project.isOwner)
  const sharedProjects = projects.filter((project) => !project.isOwner)

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity" onClick={onClose} aria-hidden="true" />
      <aside className="fixed top-0 left-0 bottom-0 w-80 bg-card border-r border-border z-50 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-heading font-medium text-lg text-card-foreground">Projects</h2>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close projects sidebar"><X className="h-4 w-4" /></Button>
        </div>

        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          <Tabs defaultValue="my-projects" className="flex-1 flex flex-col">
            <TabsList className="w-full grid grid-cols-2 p-1 bg-muted/60 rounded-xl border border-border">
              <TabsTrigger value="my-projects" className="rounded-lg text-xs font-medium text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all cursor-pointer">My Projects ({ownedProjects.length})</TabsTrigger>
              <TabsTrigger value="shared" className="rounded-lg text-xs font-medium text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all cursor-pointer">Shared ({sharedProjects.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="my-projects" className="flex-1 mt-4 overflow-y-auto space-y-2 pr-1">
              {isLoading ? <ProjectEmptyState>Loading projects...</ProjectEmptyState> : error ? <ProjectEmptyState>{error}</ProjectEmptyState> : ownedProjects.length === 0 ? <ProjectEmptyState>No projects yet. Create your first project below.</ProjectEmptyState> : ownedProjects.map((project) => (
                <div key={project.id} className="group flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-border bg-card/50 hover:bg-accent/40 transition-colors cursor-pointer">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-sm font-medium text-foreground truncate">{project.name}</p>
                    <p className="text-xs text-muted-foreground truncate">Updated {formatUpdatedAt(project.updatedAt)}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon-xs" className="opacity-80 group-hover:opacity-100 hover:bg-muted" aria-label={`Actions for ${project.name}`} />}><MoreVertical className="h-3.5 w-3.5" /></DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="bottom">
                      <DropdownMenuItem onClick={() => onRenameProject?.(project.id, project.name)} className="cursor-pointer"><Edit2 className="h-4 w-4 mr-2" /> Rename</DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => onDeleteProject?.(project.id, project.name)} className="cursor-pointer"><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="shared" className="flex-1 mt-4 overflow-y-auto space-y-2 pr-1">
              {isLoading ? <ProjectEmptyState>Loading projects...</ProjectEmptyState> : error ? <ProjectEmptyState>{error}</ProjectEmptyState> : sharedProjects.length === 0 ? <ProjectEmptyState>No shared projects available.</ProjectEmptyState> : sharedProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-border bg-card/50 hover:bg-accent/40 transition-colors cursor-pointer">
                  <div className="flex-1 min-w-0"><p className="text-sm font-medium text-foreground truncate">{project.name}</p><p className="text-xs text-muted-foreground truncate">Updated {formatUpdatedAt(project.updatedAt)}</p></div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        <div className="p-4 border-t border-border"><Button onClick={onCreateProject} className="w-full" size="default"><Plus className="h-4 w-4 mr-2" /> New Project</Button></div>
      </aside>
    </>
  )
}
