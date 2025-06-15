<template>
  <div class="h-screen bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
    <!-- Top Bar -->
    <header
      class="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
    >
      <div class="flex items-center justify-between h-14 px-4">
        <!-- Left section -->
        <div class="flex items-center space-x-4">
          <!-- Logo -->
          <div class="flex items-center space-x-2">
            <div
              class="w-7 h-7 bg-green-600 rounded flex items-center justify-center"
            >
              <Edit3 :size="16" class="text-white" />
            </div>
            <span class="font-semibold text-gray-900 dark:text-white text-lg"
              >AnotherPad</span
            >
          </div>


        </div>

        <!-- Center - Search -->
        <div class="flex-1 max-w-md mx-8">
          <div class="relative">
            <Search
              :size="16"
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search all notes"
              class="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-md text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:bg-white dark:focus:bg-gray-600"
            />
          </div>
        </div>

        <!-- Right section -->
        <div class="flex items-center space-x-2">
          <button
            @click="toggleTheme"
            class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Sun v-if="isDark" :size="18" />
            <Moon v-else :size="18" />
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Folder Sidebar -->
      <div class="w-64 flex-shrink-0">
        <FolderSidebar
          :folders="folders"
          :current-folder-id="currentFolderId"
          :notes-count="notesCount"
          @select-folder="handleSelectFolder"
          @create-folder="handleCreateFolder"
          @update-folder="handleUpdateFolder"
          @delete-folder="handleDeleteFolder"
          @create-note="createNote"
        />
      </div>

      <!-- Notes Sidebar -->
      <div
        class="w-80 flex-shrink-0 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
      >
        <NoteSidebar
          :notes="filteredNotes"
          :current-note="currentNote"
          :filters="filters"
          :all-tags="allTags"
          :folders="folders"
          @select-note="selectNote"
          @delete-note="deleteNote"
          @toggle-pin="togglePin"
          @update-filters="updateFilters"
          @move-note="handleMoveNote"
        />
      </div>

      <!-- Editor -->
      <div class="flex-1 bg-white dark:bg-gray-900">
        <NoteEditor
          :note="currentNote"
          @update-note="updateNote"
          @create-note="createNote"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Edit3, Moon, Plus, Search, Sun } from "lucide-vue-next";
import NoteEditor from "./components/NoteEditor.vue";
import NoteSidebar from "./components/NoteSidebar.vue";
import FolderSidebar from "./components/FolderSidebar.vue";
import { useNotes } from "./composables/useNotes";
import { useFolders } from "./composables/useFolders";
import { useTheme } from "./composables/useTheme";
import type { Note, NoteFilters, Folder } from "./types";

const {
  notes,
  currentNote,
  filters,
  filteredNotes,
  allTags,
  createNote: createNewNote,
  updateNote,
  deleteNote,
  togglePin,
} = useNotes();

const {
  folders,
  currentFolderId,
  currentFolder,
  createFolder,
  updateFolder,
  deleteFolder,
  selectFolder,
} = useFolders();

const { isDark, toggleTheme } = useTheme();

const createNote = () => {
  createNewNote('Untitled Note', '', currentFolderId.value || undefined);
};

const selectNote = (note: Note) => {
  currentNote.value = note;
};

const updateFilters = (newFilters: Partial<NoteFilters>) => {
  Object.assign(filters.value, newFilters);
};

const handleSelectFolder = (folderId: string | null) => {
  selectFolder(folderId);
  updateFilters({ folderId });
};

const handleCreateFolder = (name: string) => {
  createFolder(name);
};

const handleUpdateFolder = (id: string, updates: Partial<Folder>) => {
  updateFolder(id, updates);
};

const handleDeleteFolder = (id: string) => {
  deleteFolder(id);
};

const handleMoveNote = (noteId: string, folderId: string | null) => {
  updateNote(noteId, { folderId: folderId || undefined });
};

// Compute notes count per folder
const notesCount = computed(() => {
  const counts: Record<string, number> = {
    all: notes.value.length
  };
  
  folders.value.forEach(folder => {
    counts[folder.id] = notes.value.filter(note => note.folderId === folder.id).length;
  });
  
  return counts;
});

// Create initial folders if none exist
if (folders.value.length === 0) {
  createFolder("Pessoal", "#10b981");
  createFolder("Trabalho", "#3b82f6");
  createFolder("Ideias", "#f59e0b");
}

// Create initial note if none exist
if (notes.value.length === 0) {
  createNewNote(
    "Bem-vindo ao AnotherPad!",
    "Comece a digitar seus pensamentos aqui...\n\nEste bloco de notas salva tudo automaticamente no armazenamento local do seu navegador.\n\n**Recursos:**\n- Criar e organizar notas em pastas\n- Pesquisar através de suas notas\n- Marcar suas notas para melhor organização\n- Fixar notas importantes\n- Alternar tema escuro/claro\n- Design responsivo\n\nBom trabalho! ✨"
  );
}
</script>
