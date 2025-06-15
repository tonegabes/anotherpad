<script setup lang="ts">
import { ref } from 'vue'
import { Folder, FolderPlus, Plus, MoreVertical, Edit2, Trash2, FolderOpen } from 'lucide-vue-next'
import type { Folder as FolderType } from '../types'

interface Props {
  folders: FolderType[]
  currentFolderId: string | null
  notesCount: Record<string, number>
}

defineProps<Props>()

const emit = defineEmits<{
  selectFolder: [id: string | null]
  createFolder: [name: string]
  updateFolder: [id: string, updates: Partial<FolderType>]
  deleteFolder: [id: string]
  createNote: []
}>()

const showNewFolderInput = ref(false)
const newFolderName = ref('')
const editingFolderId = ref<string | null>(null)
const editingFolderName = ref('')

const createFolder = () => {
  if (newFolderName.value.trim()) {
    emit('createFolder', newFolderName.value.trim())
    newFolderName.value = ''
    showNewFolderInput.value = false
  }
}

const startEditing = (folder: FolderType) => {
  editingFolderId.value = folder.id
  editingFolderName.value = folder.name
}

const saveEdit = () => {
  if (editingFolderId.value && editingFolderName.value.trim()) {
    emit('updateFolder', editingFolderId.value, { name: editingFolderName.value.trim() })
    editingFolderId.value = null
    editingFolderName.value = ''
  }
}

const cancelEdit = () => {
  editingFolderId.value = null
  editingFolderName.value = ''
}

const cancelNewFolder = () => {
  showNewFolderInput.value = false
  newFolderName.value = ''
}
</script>

<template>
  <div class="h-full flex flex-col bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
    <!-- Header -->
    <div class="p-3 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-semibold text-gray-900 dark:text-white">
          Pastas
        </h2>
        <button
          @click="showNewFolderInput = true"
          class="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          title="Nova pasta"
        >
          <FolderPlus :size="16" class="text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <!-- Add Note Button -->
      <button
        @click="$emit('createNote')"
        class="w-full flex items-center justify-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
      >
        <Plus :size="14" class="mr-1.5" />
        Nova Nota
      </button>
    </div>

    <!-- New Folder Input -->
    <div v-if="showNewFolderInput" class="p-3 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-2">
        <input
          v-model="newFolderName"
          @keyup.enter="createFolder"
          @keyup.escape="cancelNewFolder"
          type="text"
          placeholder="Nome da pasta"
          class="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-green-500 focus:border-green-500"
          autofocus
        />
        <button
          @click="createFolder"
          class="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
        >
          OK
        </button>
        <button
          @click="cancelNewFolder"
          class="px-2 py-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 text-xs rounded transition-colors"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Folders List -->
    <div class="flex-1 overflow-y-auto">
      <!-- All Notes -->
      <div
        @click="$emit('selectFolder', null)"
        :class="[
          'flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors',
          {
            'bg-green-100 dark:bg-green-900/30 border-r-2 border-green-600': currentFolderId === null
          }
        ]"
      >
        <FolderOpen :size="16" class="text-gray-600 dark:text-gray-400 mr-2" />
        <span class="text-sm text-gray-900 dark:text-white flex-1">Todas as Notas</span>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ notesCount['all'] || 0 }}
        </span>
      </div>

      <!-- Folder Items -->
      <div v-for="folder in folders" :key="folder.id" class="group">
        <div
          @click="$emit('selectFolder', folder.id)"
          :class="[
            'flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors',
            {
              'bg-green-100 dark:bg-green-900/30 border-r-2 border-green-600': currentFolderId === folder.id
            }
          ]"
        >
          <div
            class="w-3 h-3 rounded mr-2 flex-shrink-0"
            :style="{ backgroundColor: folder.color }"
          ></div>
          
          <!-- Editing Input -->
          <input
            v-if="editingFolderId === folder.id"
            v-model="editingFolderName"
            @keyup.enter="saveEdit"
            @keyup.escape="cancelEdit"
            @blur="saveEdit"
            type="text"
            class="flex-1 px-1 py-0.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-green-500 focus:border-green-500"
            autofocus
          />
          
          <!-- Folder Name -->
          <span
            v-else
            class="text-sm text-gray-900 dark:text-white flex-1 truncate"
          >
            {{ folder.name }}
          </span>

          <div class="flex items-center space-x-1 ml-2">
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ notesCount[folder.id] || 0 }}
            </span>
            
            <!-- Actions -->
            <div class="opacity-0 group-hover:opacity-100 flex items-center space-x-1 transition-opacity">
              <button
                @click.stop="startEditing(folder)"
                class="p-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
                title="Editar pasta"
              >
                <Edit2 :size="12" class="text-gray-500 dark:text-gray-400" />
              </button>
              <button
                @click.stop="$emit('deleteFolder', folder.id)"
                class="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                title="Excluir pasta"
              >
                <Trash2 :size="12" class="text-gray-500 hover:text-red-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 