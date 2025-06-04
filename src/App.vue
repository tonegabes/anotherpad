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

          <!-- New Note Button -->
          <button
            @click="createNote"
            class="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            <Plus :size="14" class="mr-1.5" />
            New
          </button>
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
      <!-- Sidebar -->
      <div
        class="w-80 flex-shrink-0 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
      >
        <NoteSidebar
          :notes="filteredNotes"
          :current-note="currentNote"
          :filters="filters"
          :all-tags="allTags"
          @select-note="selectNote"
          @delete-note="deleteNote"
          @toggle-pin="togglePin"
          @update-filters="updateFilters"
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
import { Edit3, Moon, Plus, Search, Sun } from "lucide-vue-next";
import NoteEditor from "./components/NoteEditor.vue";
import NoteSidebar from "./components/NoteSidebar.vue";
import { useNotes } from "./composables/useNotes";
import { useTheme } from "./composables/useTheme";
import type { Note, NoteFilters } from "./types";

const {
  currentNote,
  filters,
  filteredNotes,
  allTags,
  createNote: createNewNote,
  updateNote,
  deleteNote,
  togglePin,
} = useNotes();

const { isDark, toggleTheme } = useTheme();

const createNote = () => {
  createNewNote();
};

const selectNote = (note: Note) => {
  currentNote.value = note;
};

const updateFilters = (newFilters: Partial<NoteFilters>) => {
  Object.assign(filters.value, newFilters);
};

// Create initial note if none exist
if (filteredNotes.value.length === 0) {
  createNewNote(
    "Welcome to AnotherPad!",
    "Start typing your thoughts here...\n\nThis notepad saves everything automatically to your browser's local storage.\n\n**Features:**\n- Create and organize notes\n- Search through your notes\n- Tag your notes for better organization\n- Pin important notes\n- Dark/light theme toggle\n- Responsive design\n\nEnjoy writing! ✨"
  );
}
</script>
