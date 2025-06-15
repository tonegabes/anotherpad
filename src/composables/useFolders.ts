import { computed, ref, watch } from 'vue'
import type { Folder } from '../types'

const FOLDERS_STORAGE_KEY = 'anotherpad-folders'

export function useFolders() {
  const folders = ref<Folder[]>([])
  const currentFolderId = ref<string | null>(null)

  // Load folders from localStorage
  const loadFolders = () => {
    try {
      const stored = localStorage.getItem(FOLDERS_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        folders.value = parsed.map((folder: any) => ({
          ...folder,
          createdAt: new Date(folder.createdAt)
        }))
      }
    } catch (error) {
      console.error('Error loading folders:', error)
    }
  }

  // Save folders to localStorage
  const saveFolders = () => {
    try {
      localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders.value))
    } catch (error) {
      console.error('Error saving folders:', error)
    }
  }

  // Create a new folder
  const createFolder = (name: string, color?: string) => {
    const folder: Folder = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date(),
      color: color || '#10b981' // default green
    }
    folders.value.push(folder)
    saveFolders()
    return folder
  }

  // Update a folder
  const updateFolder = (id: string, updates: Partial<Folder>) => {
    const index = folders.value.findIndex(folder => folder.id === id)
    if (index !== -1) {
      folders.value[index] = {
        ...folders.value[index],
        ...updates
      }
      saveFolders()
    }
  }

  // Delete a folder
  const deleteFolder = (id: string) => {
    const index = folders.value.findIndex(folder => folder.id === id)
    if (index !== -1) {
      folders.value.splice(index, 1)
      if (currentFolderId.value === id) {
        currentFolderId.value = null
      }
      saveFolders()
    }
  }

  // Select a folder
  const selectFolder = (id: string | null) => {
    currentFolderId.value = id
  }

  // Get current folder
  const currentFolder = computed(() => {
    if (!currentFolderId.value) return null
    return folders.value.find(f => f.id === currentFolderId.value) || null
  })

  // Initialize
  loadFolders()

  return {
    folders,
    currentFolderId,
    currentFolder,
    createFolder,
    updateFolder,
    deleteFolder,
    selectFolder,
    loadFolders
  }
} 