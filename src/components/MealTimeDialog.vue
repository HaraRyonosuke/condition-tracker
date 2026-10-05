<script setup lang="ts">
import { Clock } from '@lucide/vue'
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

function onTimeFieldClick(event: MouseEvent) {
  const el = event.currentTarget
  if (!(el instanceof HTMLInputElement) || typeof el.showPicker !== 'function') return
  try {
    el.showPicker()
  } catch {
    // dialog 内では showPicker が拒否されることがある。タップ自体はネイティブ入力へ届いている。
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
    class="m-auto w-[min(100%,20rem)] rounded-lg border border-line bg-card p-4 text-ink backdrop:bg-ink/40"
    v-bind:inert="!open"
    v-on:close="onDialogClose"
  >
    <p class="text-center text-base font-medium">{{ title }}</p>
    <p class="mt-4 text-center text-sm text-muted">時刻</p>
    <div class="relative mt-2">
      <div
        class="grid w-full grid-cols-[1.75rem_minmax(0,1fr)_1.75rem] items-center rounded-md border border-line bg-card px-3 py-3 text-ink"
        aria-hidden="true"
      >
        <span class="col-start-2 text-center text-base font-medium tracking-wide text-muted">
          {{ display12h.period }}
        </span>
        <span
          class="col-start-2 mt-0.5 text-center text-3xl font-medium tabular-nums tracking-wider text-ink"
        >
          {{ display12h.hour }}:{{ display12h.minute }}
        </span>
        <span class="col-start-3 row-start-2 justify-self-end text-ink">
          <Clock v-bind:size="20" v-bind:stroke-width="2" />
        </span>
      </div>
      <input
        v-model="localTime"
        type="time"
        class="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        v-bind:aria-label="timeFieldLabel"
        v-on:click="onTimeFieldClick"
      />
    </div>
    <div class="mt-6 flex flex-col gap-2">
      <button
        type="button"
        class="w-full rounded-lg bg-select px-4 py-3 text-base font-medium text-on-select"
        v-on:click="onConfirm"
      >
        決定
      </button>
      <button
        type="button"
        class="w-full rounded-lg border-2 border-line bg-card px-4 py-3 text-base font-medium text-ink"
        v-on:click="onClear"
      >
        クリア
      </button>
      <button
        type="button"
        class="w-full rounded-lg px-4 py-3 text-base font-medium text-muted"
        v-on:click="onCancelClick"
      >
        キャンセル
      </button>
    </div>
  </dialog>
</template>
