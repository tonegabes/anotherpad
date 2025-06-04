<template>
  <div class="h-full flex flex-col">
    <div v-if="note" class="h-full flex flex-col">
      <!-- Editor Header -->
      <div
        class="flex-shrink-0 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      >
        <!-- Title Input -->
        <input
          v-model="localTitle"
          @input="debouncedUpdate"
          type="text"
          placeholder="Title your note..."
          class="w-full text-2xl font-semibold bg-transparent border-0 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-0 mb-3"
        />

        <!-- Note Info Bar -->
        <div
          class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
        >
          <div class="flex items-center space-x-4">
            <span>{{ formatDate(note.updatedAt) }}</span>
            <span>{{ wordCount }} words</span>
            <span>{{ characterCount }} characters</span>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="$emit('togglePin', note.id)"
              :class="[
                'p-1.5 rounded transition-colors',
                note.isPinned
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  : 'text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20',
              ]"
              title="Pin note"
            >
              <Pin :size="14" />
            </button>
          </div>
        </div>

        <!-- Tags Section -->
        <div class="mt-3">
          <div class="flex flex-wrap gap-1.5 mb-2">
            <span
              v-for="tag in note.tags"
              :key="tag"
              class="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
            >
              {{ tag }}
              <button
                @click="removeTag(tag)"
                class="ml-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X :size="12" />
              </button>
            </span>
            <button
              v-if="!showTagInput"
              @click="showTagInput = true"
              class="inline-flex items-center px-2 py-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <Tag :size="12" class="mr-1" />
              Add tag
            </button>
          </div>

          <div v-if="showTagInput" class="flex items-center space-x-2">
            <input
              ref="tagInput"
              v-model="newTag"
              @keyup.enter="addTag"
              @keyup.escape="cancelTagInput"
              @blur="cancelTagInput"
              type="text"
              placeholder="Tag name..."
              class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 border-0 rounded text-gray-900 dark:text-white placeholder-gray-500 focus:ring-1 focus:ring-green-500"
            />
            <button
              @click="addTag"
              class="p-1 text-green-600 hover:text-green-700"
            >
              <Check :size="12" />
            </button>
            <button
              @click="cancelTagInput"
              class="p-1 text-gray-400 hover:text-gray-600"
            >
              <X :size="12" />
            </button>
          </div>
        </div>
      </div>

      <!-- Editor Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <textarea
          v-model="localContent"
          @input="debouncedUpdate"
          placeholder="Start writing..."
          class="flex-1 w-full px-6 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 border-0 resize-none focus:outline-none focus:ring-0 text-base leading-relaxed"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="h-full flex items-center justify-center">
      <div class="text-center">
        <FileText
          :size="48"
          class="mx-auto text-gray-300 dark:text-gray-600 mb-4"
        />
        <h3 class="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
          No note selected
        </h3>
        <p class="text-sm text-gray-400 dark:text-gray-500 mb-4">
          Choose a note from the sidebar to start editing
        </p>
        <button
          @click="$emit('create-note')"
          class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
        >
          <Plus :size="16" class="mr-2" />
          Create New Note
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, FileText, Pin, Plus, Tag, X } from "lucide-vue-next";
import { computed, nextTick, ref, watch } from "vue";
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
const newTag = ref("");
const showTagInput = ref(false);
const tagInput = ref<HTMLInputElement>();

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

const characterCount = computed(() => {
  return localContent.value.length;
});

// Tag management
const addTag = async () => {
  const tag = newTag.value.trim().replace("#", "");
  if (tag && props.note && !props.note.tags.includes(tag)) {
    emit("updateNote", props.note.id, {
      tags: [...props.note.tags, tag],
    });
  }
  newTag.value = "";
  showTagInput.value = false;
};

const cancelTagInput = () => {
  newTag.value = "";
  showTagInput.value = false;
};

const removeTag = (tagToRemove: string) => {
  if (props.note) {
    emit("updateNote", props.note.id, {
      tags: props.note.tags.filter((tag) => tag !== tagToRemove),
    });
  }
};

// Watch for tag input visibility to focus
watch(showTagInput, async (show) => {
  if (show) {
    await nextTick();
    tagInput.value?.focus();
  }
});

// Date formatting
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
</script>
