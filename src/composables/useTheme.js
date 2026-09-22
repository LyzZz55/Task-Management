import { ref, watch } from 'vue'

const THEME_KEY = 'task-manager:theme'

function getInitialTheme() {
  const stored = localStorage.getItem(THEME_KEY)
  if (stored) return stored === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const isDark = ref(getInitialTheme())

function applyTheme(dark) {
  document.documentElement.classList.toggle('dark', dark)
}

// 初始化时立即应用
applyTheme(isDark.value)

watch(isDark, (dark) => {
  applyTheme(dark)
  localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
})

export function useTheme() {
  function toggleTheme() {
    isDark.value = !isDark.value
  }
  return { isDark, toggleTheme }
}
