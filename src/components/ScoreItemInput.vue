<script setup lang="ts">
import { scaleLabels } from '@/constants/checkItems'

defineProps<{
  text: string
  modelValue: number | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()
</script>

<template>
  <fieldset class="border-0 p-0">
    <legend class="mb-3 text-base font-medium text-stone-900">{{ text }}</legend>
    <div class="grid grid-cols-4 gap-2">
      <button
        v-for="option in scaleLabels"
        v-bind:key="option.value"
        type="button"
        class="flex min-h-16 flex-col items-center justify-center rounded-lg border-2 px-1 py-2 text-center"
        v-bind:class="
          modelValue === option.value
            ? 'border-stone-800 bg-stone-800 text-white'
            : 'border-stone-300 bg-white text-stone-800'
        "
        v-on:click="emit('update:modelValue', option.value)"
      >
        <span class="text-lg font-semibold leading-none">{{ option.value }}</span>
        <span class="mt-1 text-sm">{{ option.label }}</span>
      </button>
    </div>
  </fieldset>
</template>
