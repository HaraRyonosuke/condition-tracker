import { computed, onScopeDispose, ref } from 'vue'

function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyDarkClass(isDark: boolean) {
  document.documentElement.classList.toggle('dark', isDark)
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
}

// タブ内だけ。記録ストアと localStorage には置かない。
export function useColorScheme() {
  const systemDark = ref(systemPrefersDark())
  const override = ref<'light' | 'dark' | null>(null)
  const isDark = computed(() =>
    override.value === null ? systemDark.value : override.value === 'dark',
  )

  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const onSystemChange = (event: MediaQueryListEvent) => {
    systemDark.value = event.matches
  }
  media.addEventListener('change', onSystemChange)
  onScopeDispose(() => {
    media.removeEventListener('change', onSystemChange)
  })

  function toggle() {
    override.value = isDark.value ? 'light' : 'dark'
  }

  function sync() {
    applyDarkClass(isDark.value)
  }

  return { isDark, toggle, sync }
}
