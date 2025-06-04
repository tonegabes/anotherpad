<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
  >
    <div v-if="note" class="h-full">
      <!-- Editor Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <button
              @click="$emit('togglePin', note.id)"
              :class="[
                'p-2 rounded-lg transition-colors',
                note.isPinned
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400',
              ]"
              title="Pin note"
            >
              <Pin :size="16" />
            </button>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Last updated {{ formatDate(note.updatedAt) }}
            </div>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ wordCount }} words
          </div>
        </div>

        <!-- Title Input -->
        <input
          v-model="localTitle"
          @input="debouncedUpdate"
          type="text"
          placeholder="Note title..."
          class="w-full text-2xl font-bold bg-transparent border-0 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-0"
        />

        <!-- Tags Input -->
        <div class="mt-4">
          <div class="flex flex-wrap gap-2 mb-2">
            <span
              v-for="tag in note.tags"
              :key="tag"
              class="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full"
            >
              #{{ tag }}
              <button
                @click="removeTag(tag)"
                class="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
              >
                <X :size="14" />
              </button>
            </span>
          </div>
          <div class="relative">
            <input
              v-model="tagInput"
              @keydown="handleTagInput"
              @blur="addTag"
              type="text"
              placeholder="Add tags (press Enter)"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <!-- Editor Content -->
      <div class="p-6">
        <textarea
          v-model="localContent"
          @input="debouncedUpdate"
          placeholder="Start writing your note..."
          class="w-full h-96 bg-transparent border-0 text-gray-900 dark:text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-0 prose dark:prose-invert"
          style="
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
          "
        ></textarea>
      </div>

      <!-- Stats Footer -->
      <div
        class="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600"
      >
        <div
          class="flex justify-between text-xs text-gray-500 dark:text-gray-400"
        >
          <span>{{ charCount }} characters</span>
          <span>Created {{ formatDate(note.createdAt) }}</span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex items-center justify-center h-96 text-center">
      <div>
        <Edit3
          :size="48"
          class="mx-auto text-gray-300 dark:text-gray-600 mb-4"
        />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No note selected
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          Select a note from the sidebar or create a new one
        </p>
        <button
          @click="$emit('createNote')"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors btn-hover"
        >
          <Plus :size="16" class="mr-2" />
          Create Note
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Edit3, Pin, Plus, X } from "lucide-vue-next";
import { computed, ref, watch } from "vue";
import type { Note } from "../types";

interface Props {
  note: Note | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  updateNote: [id: string, updates: Partial<Note>];
  createNote: [];
  togglePin: [id: string];
}>();

const localTitle = ref("");
const localContent = ref("");
const tagInput = ref("");

// Debounced update function
let updateTimeout: number | null = null;

const debouncedUpdate = () => {
  if (updateTimeout) {
    clearTimeout(updateTimeout);
  }
  updateTimeout = setTimeout(() => {
    if (props.note) {
      emit("updateNote", props.note.id, {
        title: localTitle.value || "Untitled",
        content: localContent.value,
      });
    }
  }, 500);
};

// Watch for note changes
watch(
  () => props.note,
  (newNote) => {
    if (newNote) {
      localTitle.value = newNote.title;
      localContent.value = newNote.content;
    }
  },
  { immediate: true }
);

// Word and character count
const wordCount = computed(() => {
  if (!localContent.value) return 0;
  return localContent.value
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
});

const charCount = computed(() => {
  return localContent.value.length;
});

// Tag management
const handleTagInput = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addTag();
  }
};

const addTag = () => {
  const tag = tagInput.value.trim().replace("#", "");
  if (tag && props.note && !props.note.tags.includes(tag)) {
    emit("updateNote", props.note.id, {
      tags: [...props.note.tags, tag],
    });
  }
  tagInput.value = "";
};

const removeTag = (tagToRemove: string) => {
  if (props.note) {
    emit("updateNote", props.note.id, {
      tags: props.note.tags.filter((tag) => tag !== tagToRemove),
    });
  }
};

// Date formatting
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
</script>
