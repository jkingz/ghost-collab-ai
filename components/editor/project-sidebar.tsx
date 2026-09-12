"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Plus } from "lucide-react"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <aside className="fixed top-0 left-0 bottom-0 w-80 bg-card border-r border-border z-50 flex flex-col shadow-xl animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-heading font-medium text-lg text-card-foreground">Projects</h2>
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
                className="rounded-lg text-xs font-medium text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all"
              >
                My Projects
              </TabsTrigger>
              <TabsTrigger
                value="shared"
                className="rounded-lg text-xs font-medium text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all"
              >
                Shared
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-projects" className="flex-1 mt-4">
              <div className="h-full flex items-center justify-center border border-dashed border-border rounded-xl p-6 text-center text-muted-foreground text-sm bg-muted/20">
                No projects yet. Create your first project below.
              </div>
            </TabsContent>

            <TabsContent value="shared" className="flex-1 mt-4">
              <div className="h-full flex items-center justify-center border border-dashed border-border rounded-xl p-6 text-center text-muted-foreground text-sm bg-muted/20">
                No shared projects available.
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer with New Project Action */}
        <div className="p-4 border-t border-border">
          <Button className="w-full" size="default">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}
