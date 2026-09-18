<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { clockTimeHm, toMealHm } from '@/utils/datetime'

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
    <p class="text-base font-medium">{{ title }}</p>
    <p class="mt-4 text-sm text-stone-700">時刻</p>
    <div class="relative mt-2">
      <input
        ref="timeInputEl"
        v-model="localTime"
        type="time"
        tabindex="-1"
        class="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-base text-stone-900"
      />
      <button
        type="button"
        class="absolute inset-0 cursor-pointer rounded-md bg-transparent"
        aria-label="時刻を選ぶ"
        v-on:click="onTimeFieldClick"
      ></button>
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
