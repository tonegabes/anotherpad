<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <!-- Header -->
    <header
      class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo and Title -->
          <div class="flex items-center space-x-3">
            <div
              class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
            >
              <Edit3 :size="18" class="text-white" />
            </div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">
              AnotherPad
            </h1>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-3">
            <!-- Search -->
            <div class="relative hidden sm:block">
              <Search
                :size="18"
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                v-model="filters.search"
                type="text"
                placeholder="Search notes..."
                class="pl-10 pr-4 py-2 w-64 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600"
              />
            </div>

            <!-- New Note Button -->
            <button
              @click="createNote"
              class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors btn-hover focus-ring"
            >
              <Plus :size="16" class="mr-2" />
              New Note
            </button>

            <!-- Theme Toggle -->
            <button
              @click="toggleTheme"
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus-ring"
            >
              <Sun v-if="isDark" :size="20" />
              <Moon v-else :size="20" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar -->
        <div class="lg:col-span-1">
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
        <div class="lg:col-span-3">
          <NoteEditor
            :note="currentNote"
            @update-note="updateNote"
            @create-note="createNote"
          />
        </div>
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
