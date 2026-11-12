<script setup lang="ts">
import type { Component } from 'vue'
import { Annoyed, Frown, Meh, Smile } from '@/icons'
import { scaleLabels } from '@/constants/checkItems'

defineProps<{
  label: string
  modelValue: number | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const faceByValue: Record<(typeof scaleLabels)[number]['value'], Component> = {
  0: Smile,
  1: Meh,
  2: Frown,
  3: Annoyed,
}
</script>

<template>
  <fieldset>
    <legend class="mb-0.5 text-sm font-medium">{{ label }}</legend>
    <div class="grid grid-cols-4 gap-1.5">
      <button
        v-for="option in scaleLabels"
        v-bind:key="option.value"
        type="button"
        class="flex min-h-13.5 items-center justify-center rounded-lg border-2 px-1"
        v-bind:class="
          modelValue === option.value
            ? 'border-select bg-select text-on-select'
            : 'border-line bg-card text-ink'
        "
        v-bind:aria-label="option.label"
        v-bind:aria-pressed="modelValue === option.value"
        v-on:click="emit('update:modelValue', option.value)"
      >
        <component
          v-bind:is="faceByValue[option.value]"
          v-bind:size="27"
          v-bind:stroke-width="2"
          aria-hidden="true"
        />
      </button>
    </div>
  </fieldset>
</template>
