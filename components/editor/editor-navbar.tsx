"use client"

import { Button } from "@/components/ui/button"
import { PanelLeftOpen, PanelLeftClose } from "lucide-react"
import { UserButton } from "@clerk/nextjs"

interface EditorNavbarProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

export function EditorNavbar({ isSidebarOpen, onToggleSidebar }: EditorNavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-card border-b border-border flex items-center px-4 z-40">
      <div className="flex items-center gap-2 flex-1">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="flex items-center justify-center flex-1">
        {/* Center section - empty for now */}
      </div>

      <div className="flex items-center justify-end gap-2 flex-1">
        <UserButton />
      </div>
    </nav>
  )
}
