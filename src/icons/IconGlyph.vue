<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  source: string
  size: number
}>()

const host = ref<HTMLElement | null>(null)

function paint(): void {
  const el = host.value
  if (!el) return
  const doc = new DOMParser().parseFromString(props.source, 'image/svg+xml')
  const svg = doc.documentElement
  svg.setAttribute('width', String(props.size))
  svg.setAttribute('height', String(props.size))
  el.replaceChildren(document.importNode(svg, true))
}

onMounted(paint)
watch(() => [props.source, props.size] as const, paint)
</script>

<template>
  <span ref="host" class="inline-flex shrink-0" aria-hidden="true" />
</template>
