"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface EditorHomeProps {
  onNewProject: () => void
}

export function EditorHome({ onNewProject }: EditorHomeProps) {
  return (
    <div className="flex items-center justify-center flex-1">
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        <div className="space-y-2">
          <h1 className="text-2xl font-heading font-medium text-foreground">
            Create a project or open an existing one
          </h1>
          <p className="text-muted-foreground">
            Start a new architecture workspace, or choose a project from the sidebar.
          </p>
        </div>

        <Button onClick={onNewProject} size="lg">
          <Plus className="h-5 w-5" />
          New Project
        </Button>
      </div>
    </div>
  )
}
