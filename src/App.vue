<script setup lang="ts">
import { watch } from 'vue'
import moon from '@/icons/moon.svg?raw'
import sun from '@/icons/sun.svg?raw'
import IconGlyph from '@/icons/IconGlyph.vue'
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
        <IconGlyph v-if="isDark" v-bind:source="sun" v-bind:size="20" aria-hidden="true" />
        <IconGlyph v-else v-bind:source="moon" v-bind:size="20" aria-hidden="true" />
      </button>
    </div>
    <RecordInputView />
  </div>
</template>
