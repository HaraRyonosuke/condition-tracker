<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ChevronsDown } from '@/icons'
import BehaviorForm from '@/components/BehaviorForm.vue'
import ScoreForm from '@/components/ScoreForm.vue'
import { useRecordStore } from '@/stores/record'

const store = useRecordStore()
const { previewText, copyState, clearState } = storeToRefs(store)
const moodPane = ref<HTMLElement | null>(null)
const moodHasMore = ref(false)
let moodObserver: ResizeObserver | null = null

function updateMoodMore() {
  const el = moodPane.value
  if (!el) {
    moodHasMore.value = false
    return
  }
  moodHasMore.value = el.scrollHeight - el.scrollTop - el.clientHeight > 2
}

function scrollMoodDown() {
  const el = moodPane.value
  if (!el) return
  el.scrollBy({ top: Math.max(160, Math.round(el.clientHeight * 0.6)), behavior: 'smooth' })
}

onMounted(() => {
  updateMoodMore()
  const el = moodPane.value
  if (!el || typeof ResizeObserver === 'undefined') return
  moodObserver = new ResizeObserver(() => updateMoodMore())
  moodObserver.observe(el)
  for (const child of el.children) moodObserver.observe(child)
})

onBeforeUnmount(() => {
  moodObserver?.disconnect()
})

async function onCopy() {
  await store.copyFormattedText()
}

async function onClearClipboard() {
  await store.clearClipboard()
}
</script>

<template>
  <main class="flex flex-col px-4 pt-3 pb-8 md:min-h-0 md:overflow-hidden md:pb-4">
    <header class="shrink-0">
      <h1 class="pr-12 text-2xl font-semibold">日々の気分チェック</h1>
      <p class="mt-2 pr-12 text-sm text-muted">
        下の文面は選ぶたびに更新されます。そのままコピーして外部スレッドへ貼ってください。アプリ内には残りません。
      </p>
    </header>

    <div class="mt-4 md:grid md:min-h-0 md:flex-1 md:grid-cols-2 md:gap-10">
      <div class="relative md:h-full md:min-h-0">
        <div
          ref="moodPane"
          class="flex flex-col gap-8 md:h-full md:overflow-y-auto"
          v-on:scroll="updateMoodMore"
        >
          <ScoreForm />
          <BehaviorForm />
        </div>
        <button
          v-if="moodHasMore"
          type="button"
          class="absolute inset-x-0 bottom-0 z-10 hidden h-9 items-center justify-center border-t border-line bg-card text-select md:flex"
          aria-label="下に続く"
          v-on:click="scrollMoodDown"
        >
          <ChevronsDown v-bind:size="22" v-bind:stroke-width="2" aria-hidden="true" />
        </button>
      </div>

      <div class="mt-10 md:mt-0 md:h-full md:min-h-0">
        <section
          class="rounded-lg border border-line bg-card p-4 md:flex md:h-full md:min-h-0 md:flex-col"
        >
          <p class="shrink-0 text-sm font-medium text-muted">コピーする文面</p>
          <pre
            class="mt-3 overflow-x-auto whitespace-pre-wrap rounded-md bg-page p-3 text-sm leading-relaxed text-ink md:min-h-0 md:flex-1 md:overflow-y-auto"
            >{{ previewText }}</pre>
          <div
            class="mt-4 flex shrink-0 gap-3 rounded-xl border border-danger bg-page px-4 py-3"
            role="note"
          >
            <span
              class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-danger text-xs font-bold text-on-select"
              aria-hidden="true"
            >
              !
            </span>
            <p class="text-sm leading-relaxed text-danger">
              クリップボードと貼った先に残ります。空にしても、すでに貼った先やコピー直後の拡張機能からは消えません。
            </p>
          </div>
          <button
            type="button"
            class="mt-4 w-full shrink-0 rounded-lg bg-select px-4 py-3 font-medium text-on-select"
            v-on:click="onCopy"
          >
            テキストをコピー
          </button>
          <button
            type="button"
            class="mt-2 w-full shrink-0 rounded-lg border-2 border-line bg-card px-4 py-3 font-medium text-ink"
            v-on:click="onClearClipboard"
          >
            クリップボードを空にする
          </button>
          <p v-if="copyState === 'copied'" class="mt-3 shrink-0 text-sm text-select">
            コピーしました
          </p>
          <p v-else-if="copyState === 'error'" class="mt-3 shrink-0 text-sm text-danger">
            コピーできませんでした。ブラウザの権限を確認してください。
          </p>
          <p v-if="clearState === 'cleared'" class="mt-3 shrink-0 text-sm text-select">
            クリップボードを空にしました
          </p>
          <p v-else-if="clearState === 'error'" class="mt-3 shrink-0 text-sm text-danger">
            クリップボードを空にできませんでした。ブラウザの権限を確認してください。
          </p>
        </section>
      </div>
    </div>
  </main>
</template>
