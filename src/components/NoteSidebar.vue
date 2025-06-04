<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Filters -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <!-- Mobile Search -->
      <div class="relative mb-4 sm:hidden">
        <Search :size="18" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          :value="filters.search"
          @input="updateSearch"
          type="text"
          placeholder="Search notes..."
          class="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Sort Options -->
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sort by
          </label>
          <select
            :value="filters.sortBy"
            @change="updateSortBy"
            class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="updatedAt">Last Updated</option>
            <option value="createdAt">Date Created</option>
            <option value="title">Title</option>
          </select>
        </div>

        <!-- Tags Filter -->
        <div v-if="allTags.length > 0">
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Filter by tag
          </label>
          <select
            :value="filters.tag || ''"
            @change="updateTagFilter"
            class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All notes</option>
            <option v-for="tag in allTags" :key="tag" :value="tag">
              #{{ tag }}
            </option>
          </select>
        </div>

        <!-- Show Pinned Only -->
        <label class="flex items-center space-x-2 cursor-pointer">
          <input
            :checked="filters.showPinnedOnly"
            @change="updatePinnedFilter"
            type="checkbox"
            class="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">Pinned only</span>
        </label>
      </div>
    </div>

    <!-- Notes List -->
    <div class="max-h-96 overflow-y-auto">
      <div v-if="notes.length === 0" class="p-6 text-center">
        <FileText :size="32" class="mx-auto text-gray-400 mb-2" />
        <p class="text-gray-500 dark:text-gray-400 text-sm">No notes found</p>
      </div>

      <div
        v-for="note in notes"
        :key="note.id"
        :class="[
          'p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group',
          currentNote?.id === note.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''
        ]"
        @click="$emit('selectNote', note)"
      >
        <div class="flex items-start justify-between mb-2">
          <h3 class="font-medium text-gray-900 dark:text-white text-sm truncate flex-1">
            {{ note.title || 'Untitled' }}
          </h3>
          <div class="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              @click.stop="$emit('togglePin', note.id)"
              :class="[
                'p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors',
                note.isPinned ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400'
              ]"
            >
              <Pin :size="14" />
            </button>
            <button
              @click.stop="$emit('deleteNote', note.id)"
              class="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <Trash2 :size="14" />
            </button>
          </div>
        </div>

        <p class="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
          {{ note.content.substring(0, 80) }}{{ note.content.length > 80 ? '...' : '' }}
        </p>

        <div class="flex items-center justify-between">
          <div class="flex flex-wrap gap-1">
            <span
              v-for="tag in note.tags.slice(0, 2)"
              :key="tag"
              class="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
            >
              #{{ tag }}
            </span>
            <span
              v-if="note.tags.length > 2"
              class="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
            >
              +{{ note.tags.length - 2 }}
            </span>
          </div>

          <div class="flex items-center space-x-1">
            <Pin v-if="note.isPinned" :size="12" class="text-yellow-600 dark:text-yellow-400" />
            <time class="text-xs text-gray-400">
              {{ formatDate(note.updatedAt) }}
            </time>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, FileText, Pin, Trash2 } from 'lucide-vue-next'
import type { Note, NoteFilters } from '../types'

interface Props {
  notes: Note[]
  currentNote: Note | null
  filters: NoteFilters
  allTags: string[]
}

defineProps<Props>()

const emit = defineEmits<{
  selectNote: [note: Note]
  deleteNote: [id: string]
  togglePin: [id: string]
  updateFilters: [filters: Partial<NoteFilters>]
}>()

const updateSearch = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('updateFilters', { search: target.value })
}

const updateSortBy = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('updateFilters', { sortBy: target.value as 'updatedAt' | 'createdAt' | 'title' })
}

const updateTagFilter = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('updateFilters', { tag: target.value || null })
}

const updatePinnedFilter = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('updateFilters', { showPinnedOnly: target.checked })
}

const formatDate = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (days === 1) {
    return 'Yesterday'
  } else if (days < 7) {
    return `${days}d ago`
  } else {
    return date.toLocaleDateString()
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
