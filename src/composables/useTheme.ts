import { ref, watch } from 'vue'

const THEME_KEY = 'anotherpad-theme'

export function useTheme() {
  const isDark = ref(false)

  const loadTheme = () => {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored) {
      isDark.value = stored === 'dark'
    } else {
      // Default to system preference
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    updateTheme()
  }

  const updateTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  // Save theme preference
  watch(isDark, (value) => {
    localStorage.setItem(THEME_KEY, value ? 'dark' : 'light')
    updateTheme()
  })

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      isDark.value = e.matches
    }
  })

  // Initialize
  loadTheme()

  return {
    isDark,
    toggleTheme
  }
}
