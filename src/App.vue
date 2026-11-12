<script setup lang="ts">
import { Moon, Sun } from '@/icons'
import { watch } from 'vue'
import RecordInputView from '@/views/RecordInputView.vue'
import { useColorScheme } from '@/composables/useColorScheme'

const { isDark, toggle, sync } = useColorScheme()

watch(isDark, () => sync(), { immediate: true })
</script>

<template>
  <div class="min-h-screen bg-page text-ink antialiased md:h-dvh md:min-h-dvh md:overflow-hidden">
    <div class="relative mx-auto flex w-full max-w-lg flex-col md:h-full md:max-w-5xl md:min-h-0">
      <button
        type="button"
        class="absolute top-3 right-4 z-10 flex size-10 items-center justify-center rounded-lg border border-line bg-card text-ink"
        v-bind:aria-label="isDark ? 'ライトに切り替える' : 'ダークに切り替える'"
        v-on:click="toggle"
      >
        <Sun v-if="isDark" v-bind:size="20" v-bind:stroke-width="2" aria-hidden="true" />
        <Moon v-else v-bind:size="20" v-bind:stroke-width="2" aria-hidden="true" />
      </button>
      <RecordInputView class="md:min-h-0 md:flex-1" />
    </div>
  </div>
</template>
