<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { clockTimeHm, formatMealDisplay12h, toMealHm } from '@/utils/datetime'

const props = defineProps<{
  open: boolean
  title: string
  draftValue: string | null
}>()

const emit = defineEmits<{
  confirm: [value: string]
  clear: []
  cancel: []
}>()

const dialogEl = ref<HTMLDialogElement | null>(null)
const timeInputEl = ref<HTMLInputElement | null>(null)
const localTime = ref('00:00')
let closeReason: 'confirm' | 'clear' | 'cancel' = 'cancel'

const display12h = computed(() => {
  const hm = toMealHm(localTime.value) ?? clockTimeHm(new Date())
  return formatMealDisplay12h(hm) ?? { period: '午前' as const, hour: 12, minute: '00' }
})

const timeFieldLabel = computed(() => {
  const { period, hour, minute } = display12h.value
  return `時刻を選ぶ、${period} ${hour}時${minute}分`
})

function onTimeFieldClick() {
  const el = timeInputEl.value
  if (!el || typeof el.showPicker !== 'function') return
  try {
    el.showPicker()
  } catch {
    // Not a user gesture, or the picker is already open.
  }
}

function syncLocalTime() {
  localTime.value = props.draftValue ?? clockTimeHm(new Date())
}

function closeDialog() {
  dialogEl.value?.close()
}

function onConfirm() {
  const hm = toMealHm(localTime.value) ?? clockTimeHm(new Date())
  closeReason = 'confirm'
  emit('confirm', hm)
  closeDialog()
}

function onClear() {
  closeReason = 'clear'
  emit('clear')
  closeDialog()
}

function onCancelClick() {
  closeReason = 'cancel'
  closeDialog()
}

function onDialogClose() {
  if (closeReason === 'cancel') {
    emit('cancel')
  }
  closeReason = 'cancel'
}

watch(
  () => props.open,
  async (isOpen) => {
    const el = dialogEl.value
    if (!el) return
    if (isOpen) {
      closeReason = 'cancel'
      syncLocalTime()
      if (!el.open) {
        el.showModal()
        await nextTick()
      }
      return
    }
    if (el.open) {
      el.close()
    }
  },
  { flush: 'post' },
)
</script>

<template>
  <dialog
    ref="dialogEl"
    class="m-auto w-[min(100%,20rem)] rounded-lg border border-stone-200 bg-white p-4 text-stone-900 backdrop:bg-stone-900/40"
    v-bind:inert="!open"
    v-on:close="onDialogClose"
  >
    <p class="text-center text-base font-medium">{{ title }}</p>
    <p class="mt-4 text-center text-sm text-stone-700">時刻</p>
    <div class="relative mt-2">
      <input
        ref="timeInputEl"
        v-model="localTime"
        type="time"
        tabindex="-1"
        aria-hidden="true"
        class="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
      />
      <button
        type="button"
        class="grid w-full cursor-pointer grid-cols-[1.75rem_minmax(0,1fr)_1.75rem] items-center rounded-md border border-stone-300 bg-white px-3 py-3 text-stone-900"
        v-bind:aria-label="timeFieldLabel"
        v-on:click="onTimeFieldClick"
      >
        <span class="col-start-2 text-center text-base font-medium tracking-wide text-stone-700">
          {{ display12h.period }}
        </span>
        <span
          class="col-start-2 mt-0.5 text-center text-3xl font-medium tabular-nums tracking-wider text-stone-900"
        >
          {{ display12h.hour }}:{{ display12h.minute }}
        </span>
        <span class="col-start-3 row-start-2 justify-self-end text-stone-800" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </span>
      </button>
    </div>
    <div class="mt-6 flex flex-col gap-2">
      <button
        type="button"
        class="w-full rounded-lg bg-stone-800 px-4 py-3 text-base font-medium text-white"
        v-on:click="onConfirm"
      >
        決定
      </button>
      <button
        type="button"
        class="w-full rounded-lg border-2 border-stone-300 bg-white px-4 py-3 text-base font-medium text-stone-800"
        v-on:click="onClear"
      >
        クリア
      </button>
      <button
        type="button"
        class="w-full rounded-lg px-4 py-3 text-base font-medium text-stone-700"
        v-on:click="onCancelClick"
      >
        キャンセル
      </button>
    </div>
  </dialog>
</template>
