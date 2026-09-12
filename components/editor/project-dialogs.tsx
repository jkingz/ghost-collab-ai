"use client"

import { useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  name: string
  slug: string
  onNameChange: (name: string) => void
  onSubmit: () => void
  isLoading: boolean
  error?: string | null
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  name,
  slug,
  onNameChange,
  onSubmit,
  isLoading,
  error,
}: CreateProjectDialogProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading && name.trim()) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Start a new architecture workspace.
          </DialogDescription>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="project-name" className="text-sm font-medium">
              Project Name
            </label>
            <Input
              id="project-name"
              placeholder="My Architecture Project"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              autoFocus
            />
          </div>

          {slug && (
            <div className="rounded-lg bg-muted px-3 py-2 border border-border">
              <div className="text-xs text-muted-foreground mb-1">Slug</div>
              <div className="text-sm font-mono text-foreground">{slug}</div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isLoading || !name.trim()}>
            {isLoading ? "Creating..." : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface RenameProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentName: string
  name: string
  onNameChange: (name: string) => void
  onSubmit: () => void
  isLoading: boolean
  error?: string | null
}

export function RenameProjectDialog({
  open,
  onOpenChange,
  currentName,
  name,
  onNameChange,
  onSubmit,
  isLoading,
  error,
}: RenameProjectDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && inputRef.current) {
      // Auto-focus and select all text
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 0)
    }
  }, [open])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading && name.trim()) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Rename Project</DialogTitle>
          <DialogDescription>
            Rename &quot;{currentName}&quot;
          </DialogDescription>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="rename-project-name" className="text-sm font-medium">
              Project Name
            </label>
            <Input
              id="rename-project-name"
              ref={inputRef}
              placeholder="My Architecture Project"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isLoading || !name.trim()}>
            {isLoading ? "Renaming..." : "Rename"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface DeleteProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectName: string
  onConfirm: () => void
  isLoading: boolean
  error?: string | null
}

export function DeleteProjectDialog({
  open,
  onOpenChange,
  projectName,
  onConfirm,
  isLoading,
  error,
}: DeleteProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{projectName}&quot;? This action
            cannot be undone.
          </DialogDescription>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
