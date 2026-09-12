export interface Project {
  id: string
  name: string
  slug: string
  updatedAt: string
  isOwner: boolean
}

export interface ProjectRow {
  id: string
  owner_id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}
