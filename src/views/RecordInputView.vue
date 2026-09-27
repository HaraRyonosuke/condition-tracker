<script setup lang="ts">
import { storeToRefs } from 'pinia'
import BehaviorForm from '@/components/BehaviorForm.vue'
import ScoreForm from '@/components/ScoreForm.vue'
import { useRecordStore } from '@/stores/record'

const store = useRecordStore()
const { previewText, copyState, clearState } = storeToRefs(store)

async function onCopy() {
  await store.copyFormattedText()
}

async function onClearClipboard() {
  await store.clearClipboard()
}
</script>

<template>
  <main class="mx-auto max-w-lg px-4 pt-2 pb-8">
    <h1 class="text-2xl font-semibold">日々の気分チェック</h1>
    <p class="mt-2 text-sm text-muted">
      下の文面は選ぶたびに更新されます。そのままコピーして外部スレッドへ貼ってください。アプリ内には残りません。
    </p>

    <div class="mt-8">
      <ScoreForm />
    </div>

    <div class="mt-10">
      <BehaviorForm />
    </div>

    <section class="mt-10 rounded-lg border border-line bg-card p-4">
      <p class="text-sm font-medium text-muted">コピーする文面</p>
      <pre
        class="mt-3 overflow-x-auto whitespace-pre-wrap rounded-md bg-page p-3 text-sm leading-relaxed text-ink"
        >{{ previewText }}</pre>
      <div class="mt-4 flex gap-3 rounded-xl border border-danger bg-page px-4 py-3" role="note">
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
        class="mt-4 w-full rounded-lg bg-select px-4 py-3 font-medium text-on-select"
        v-on:click="onCopy"
      >
        テキストをコピー
      </button>
      <button
        type="button"
        class="mt-2 w-full rounded-lg border-2 border-line bg-card px-4 py-3 font-medium text-ink"
        v-on:click="onClearClipboard"
      >
        クリップボードを空にする
      </button>
      <p v-if="copyState === 'copied'" class="mt-3 text-sm text-select">コピーしました</p>
      <p v-else-if="copyState === 'error'" class="mt-3 text-sm text-danger">
        コピーできませんでした。ブラウザの権限を確認してください。
      </p>
      <p v-if="clearState === 'cleared'" class="mt-3 text-sm text-select">
        クリップボードを空にしました
      </p>
      <p v-else-if="clearState === 'error'" class="mt-3 text-sm text-danger">
        クリップボードを空にできませんでした。ブラウザの権限を確認してください。
      </p>
    </section>
  </main>
</template>
