<script setup lang="ts">
import { storeToRefs } from 'pinia'
import ScoreForm from '@/components/ScoreForm.vue'
import { useRecordStore } from '@/stores/record'

const store = useRecordStore()
const { previewText, copyState } = storeToRefs(store)

async function onCopy() {
  await store.copyFormattedText()
}
</script>

<template>
  <main class="mx-auto max-w-lg px-4 py-8">
    <h1 class="text-2xl font-semibold text-stone-900">日々の気分チェック</h1>
    <p class="mt-2 text-sm text-stone-600">
      下の文面は選ぶたびに更新されます。そのままコピーして外部スレッドへ貼ってください。アプリ内には残りません。
    </p>

    <div class="mt-8">
      <ScoreForm />
    </div>

    <section class="mt-10 rounded-lg border border-stone-200 bg-white p-4">
      <p class="text-sm font-medium text-stone-700">コピーする文面</p>
      <pre
        class="mt-3 overflow-x-auto whitespace-pre-wrap rounded-md bg-stone-50 p-3 text-sm leading-relaxed text-stone-800"
        >{{ previewText }}</pre>
      <button
        type="button"
        class="mt-4 w-full rounded-lg bg-stone-800 px-4 py-3 text-base font-medium text-white"
        v-on:click="onCopy"
      >
        テキストをコピー
      </button>
      <p v-if="copyState === 'copied'" class="mt-3 text-sm text-green-700">コピーしました</p>
      <p v-else-if="copyState === 'error'" class="mt-3 text-sm text-red-700">
        コピーできませんでした。ブラウザの権限を確認してください。
      </p>
    </section>
  </main>
</template>
