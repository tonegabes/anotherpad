import { computed, ref, watch } from 'vue'
import type { Note, NoteFilters } from '../types'

const STORAGE_KEY = 'anotherpad-notes'
const FILTERS_KEY = 'anotherpad-filters'

export function useNotes() {
  const notes = ref<Note[]>([])
  const currentNote = ref<Note | null>(null)
  const filters = ref<NoteFilters>({
    search: '',
    tag: null,
    sortBy: 'updatedAt',
    sortOrder: 'desc',
    showPinnedOnly: false
  })

  // Load notes from localStorage
  const loadNotes = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        notes.value = parsed.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }))
      }
    } catch (error) {
      console.error('Error loading notes:', error)
    }
  }

  // Load filters from localStorage
  const loadFilters = () => {
    try {
      const stored = localStorage.getItem(FILTERS_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        filters.value = { ...filters.value, ...parsed }
      }
    } catch (error) {
      console.error('Error loading filters:', error)
    }
  }

  // Save notes to localStorage
  const saveNotes = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes.value))
    } catch (error) {
      console.error('Error saving notes:', error)
    }
  }

  // Save filters to localStorage
  const saveFilters = () => {
    try {
      localStorage.setItem(FILTERS_KEY, JSON.stringify(filters.value))
    } catch (error) {
      console.error('Error saving filters:', error)
    }
  }

  // Create a new note
  const createNote = (title = 'Untitled Note', content = '', folderId?: string) => {
    const note: Note = {
      id: crypto.randomUUID(),
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      isPinned: false,
      folderId
    }
    notes.value.unshift(note)
    currentNote.value = note
    saveNotes()
    return note
  }

  // Update a note
  const updateNote = (id: string, updates: Partial<Note>) => {
    const index = notes.value.findIndex(note => note.id === id)
    if (index !== -1) {
      notes.value[index] = {
        ...notes.value[index],
        ...updates,
        updatedAt: new Date()
      }
      if (currentNote.value?.id === id) {
        currentNote.value = notes.value[index]
      }
      saveNotes()
    }
  }

  // Delete a note
  const deleteNote = (id: string) => {
    const index = notes.value.findIndex(note => note.id === id)
    if (index !== -1) {
      notes.value.splice(index, 1)
      if (currentNote.value?.id === id) {
        currentNote.value = notes.value[0] || null
      }
      saveNotes()
    }
  }

  // Toggle pin status
  const togglePin = (id: string) => {
    const note = notes.value.find(n => n.id === id)
    if (note) {
      updateNote(id, { isPinned: !note.isPinned })
    }
  }

  // Get all unique tags
  const allTags = computed(() => {
    const tagSet = new Set<string>()
    notes.value.forEach(note => {
      note.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  })

  // Filtered and sorted notes
  const filteredNotes = computed(() => {
    let filtered = notes.value

    // Filter by search
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(search) ||
        note.content.toLowerCase().includes(search) ||
        note.tags.some(tag => tag.toLowerCase().includes(search))
      )
    }

    // Filter by tag
    if (filters.value.tag) {
      filtered = filtered.filter(note => note.tags.includes(filters.value.tag!))
    }

    // Filter by folder
    if (filters.value.folderId !== undefined) {
      if (filters.value.folderId === null) {
        // Show all notes when "All Notes" is selected
      } else {
        filtered = filtered.filter(note => note.folderId === filters.value.folderId)
      }
    }

    // Filter by pinned
    if (filters.value.showPinnedOnly) {
      filtered = filtered.filter(note => note.isPinned)
    }

    // Sort
    filtered.sort((a, b) => {
      const { sortBy, sortOrder } = filters.value
      let comparison = 0

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'createdAt':
          comparison = a.createdAt.getTime() - b.createdAt.getTime()
          break
        case 'updatedAt':
        default:
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime()
          break
      }

      // Pinned notes always come first
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1

      return sortOrder === 'desc' ? -comparison : comparison
    })

    return filtered
  })

  // Watch for filter changes and save them
  watch(filters, saveFilters, { deep: true })

  // Initialize
  loadNotes()
  loadFilters()

  return {
    notes,
    currentNote,
    filters,
    filteredNotes,
    allTags,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    loadNotes
  }
}
