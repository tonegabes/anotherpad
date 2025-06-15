<template>
  <div class="h-full flex flex-col">
    <!-- Sidebar Header -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-semibold text-gray-900 dark:text-white">
          {{ filters.folderId ? 'Notas da Pasta' : 'Todas as Notas' }}
        </h2>
        <span class="text-xs text-gray-500 dark:text-gray-400">{{
          notes.length
        }}</span>
      </div>

      <!-- Filters -->
      <div class="space-y-2">
        <!-- Sort -->
        <select
          :value="filters.sortBy"
          @change="updateSortBy"
          class="w-full px-2 py-1.5 bg-transparent border border-gray-200 dark:border-gray-600 rounded text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-green-500 focus:border-green-500"
        >
          <option value="updatedAt">Recently Updated</option>
          <option value="createdAt">Date Created</option>
          <option value="title">Title A-Z</option>
        </select>

        <!-- Tags Filter -->
        <select
          v-if="allTags.length > 0"
          :value="filters.tag || ''"
          @change="updateTagFilter"
          class="w-full px-2 py-1.5 bg-transparent border border-gray-200 dark:border-gray-600 rounded text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-green-500 focus:border-green-500"
        >
          <option value="">All Tags</option>
          <option v-for="tag in allTags" :key="tag" :value="tag">
            {{ tag }}
          </option>
        </select>

        <!-- Show Pinned Toggle -->
        <label
          class="flex items-center text-xs text-gray-600 dark:text-gray-400"
        >
          <input
            type="checkbox"
            :checked="filters.showPinnedOnly"
            @change="updatePinnedFilter"
            class="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          Pinned only
        </label>
      </div>
    </div>

    <!-- Notes List -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="notes.length === 0" class="p-4 text-center">
        <div class="text-gray-400 dark:text-gray-500 text-sm">
          <FileText :size="24" class="mx-auto mb-2" />
          <p>{{ filters.folderId ? 'Nenhuma nota nesta pasta' : 'Nenhuma nota encontrada' }}</p>
          <p class="text-xs mt-1">{{ filters.folderId ? 'Crie sua primeira nota nesta pasta' : 'Crie sua primeira nota para começar' }}</p>
        </div>
      </div>

      <div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
        <div
          v-for="note in notes"
          :key="note.id"
          @click="$emit('select-note', note)"
          :class="[
            'group p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors note-item',
            {
              'bg-green-50 dark:bg-green-900/20 active':
                currentNote?.id === note.id,
            },
          ]"
        >
          <!-- Note Header -->
          <div class="flex items-start justify-between mb-2">
            <h3
              class="font-medium text-gray-900 dark:text-white text-sm leading-tight line-clamp-2"
            >
              {{ note.title || "Untitled" }}
            </h3>
            <div class="flex items-center space-x-1 ml-2 flex-shrink-0">
              <Pin
                v-if="note.isPinned"
                :size="12"
                class="text-green-600 dark:text-green-400"
              />
              <button
                @click.stop="$emit('toggle-pin', note.id)"
                class="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-all"
                :title="note.isPinned ? 'Unpin' : 'Pin'"
              >
                <Pin
                  :size="12"
                  :class="[
                    note.isPinned
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-400 hover:text-green-600',
                  ]"
                />
              </button>
              <button
                @click.stop="$emit('delete-note', note.id)"
                class="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-all"
                title="Delete note"
              >
                <Trash2 :size="12" class="text-gray-400 hover:text-red-600" />
              </button>
              
              <!-- Move to folder dropdown -->
              <div v-if="folders && folders.length > 0" class="relative opacity-0 group-hover:opacity-100">
                <select
                  @click.stop
                  @change="moveNote(note, $event)"
                  :value="note.folderId || ''"
                  class="p-1 text-xs bg-transparent border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  title="Mover para pasta"
                >
                  <option value="">Sem pasta</option>
                  <option v-for="folder in folders" :key="folder.id" :value="folder.id">
                    {{ folder.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Note Preview -->
          <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 mb-2">
            {{ getPreviewText(note.content) }}
          </p>

          <!-- Note Meta -->
          <div
            class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
          >
            <span>{{ formatDate(note.updatedAt) }}</span>
            <div class="flex items-center space-x-1">
              <span>{{ getWordCount(note.content) }} words</span>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="note.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
            <span
              v-for="tag in note.tags.slice(0, 3)"
              :key="tag"
              class="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 rounded"
            >
              {{ tag }}
            </span>
            <span
              v-if="note.tags.length > 3"
              class="text-xs text-gray-500 dark:text-gray-400"
            >
              +{{ note.tags.length - 3 }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText, Pin, Trash2 } from "lucide-vue-next";
import type { Note, NoteFilters } from "../types";

interface Props {
  notes: Note[];
  currentNote: Note | null;
  filters: NoteFilters;
  allTags: string[];
  folders?: Array<{ id: string; name: string; color?: string }>;
}

defineProps<Props>();

const emit = defineEmits<{
  selectNote: [note: Note];
  deleteNote: [id: string];
  togglePin: [id: string];
  updateFilters: [filters: Partial<NoteFilters>];
  moveNote: [noteId: string, folderId: string | null];
}>();

const updateSortBy = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("updateFilters", {
    sortBy: target.value as "updatedAt" | "createdAt" | "title",
  });
};

const updateTagFilter = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("updateFilters", { tag: target.value || null });
};

const updatePinnedFilter = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("updateFilters", { showPinnedOnly: target.checked });
};

const formatDate = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (days === 1) {
    return "Yesterday";
  } else if (days < 7) {
    return `${days}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

const getPreviewText = (content: string) => {
  // Remove markdown formatting and get plain text preview
  return (
    content
      .replace(/[#*`_~]/g, "") // Remove markdown symbols
      .replace(/\n/g, " ") // Replace line breaks with spaces
      .trim()
      .substring(0, 100) + (content.length > 100 ? "..." : "")
  );
};

const getWordCount = (content: string) => {
  return content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
};

const moveNote = (note: Note, event: Event) => {
  const target = event.target as HTMLSelectElement;
  const folderId = target.value || null;
  if (folderId !== note.folderId) {
    emit('moveNote', note.id, folderId);
  }
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>
