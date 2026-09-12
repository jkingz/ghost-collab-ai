"use client"

import { EditorHome } from "@/components/editor/editor-home"
import { useProjectDialogContext } from "@/components/editor/project-dialog-context"

export default function EditorPage() {
  const { openCreateDialog } = useProjectDialogContext()

  return <EditorHome onNewProject={openCreateDialog} />
}
