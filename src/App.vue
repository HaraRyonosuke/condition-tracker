<script setup lang="ts">
import { Moon, Sun } from '@lucide/vue'
import { watch } from 'vue'
import RecordInputView from '@/views/RecordInputView.vue'
import { useColorScheme } from '@/composables/useColorScheme'

const { isDark, toggle, sync } = useColorScheme()

watch(isDark, () => sync(), { immediate: true })
</script>

<template>
  <div class="min-h-screen bg-page text-ink antialiased">
    <div class="mx-auto flex max-w-lg justify-end px-4 pt-4">
      <button
        type="button"
        class="flex size-11 items-center justify-center rounded-lg border border-line bg-card text-ink"
        v-bind:aria-label="isDark ? 'ライトに切り替える' : 'ダークに切り替える'"
        v-on:click="toggle"
      >
        <Sun v-if="isDark" v-bind:size="20" v-bind:stroke-width="2" aria-hidden="true" />
        <Moon v-else v-bind:size="20" v-bind:stroke-width="2" aria-hidden="true" />
      </button>
    </div>
    <RecordInputView />
  </div>
</template>
