export interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  tags: string[]
  isPinned: boolean
  folderId?: string
}

export interface Folder {
  id: string
  name: string
  createdAt: Date
  color?: string
}

export interface NoteFilters {
  search: string
  tag: string | null
  sortBy: 'updatedAt' | 'createdAt' | 'title'
  sortOrder: 'asc' | 'desc'
  showPinnedOnly: boolean
  folderId?: string | null
}
