<script setup lang="ts">
import { storeToRefs } from 'pinia'
import ScoreForm from '@/components/ScoreForm.vue'
import { useRecordStore } from '@/stores/record'

const store = useRecordStore()
const { isComplete, totalScore, copyState } = storeToRefs(store)

async function onCopy() {
  await store.copyFormattedText()
}
</script>

<template>
  <main class="mx-auto max-w-lg px-4 py-8">
    <h1 class="text-2xl font-semibold text-stone-900">日々の気分チェック</h1>
    <p class="mt-2 text-sm text-stone-600">
      7問すべてに答えると、合計とコピーが使えます。記録はアプリ内に残さず、クリップボードへコピーします。
    </p>

    <div class="mt-8">
      <ScoreForm />
    </div>

    <section class="mt-10 rounded-lg border border-stone-200 bg-white p-4">
      <p class="text-sm text-stone-600">合計</p>
      <p class="mt-1 text-2xl font-semibold text-stone-900">
        <template v-if="totalScore === null">— / 21</template>
        <template v-else>{{ totalScore }} / 21</template>
      </p>
      <button
        type="button"
        class="mt-4 w-full rounded-lg px-4 py-3 text-base font-medium"
        v-bind:class="
          isComplete ? 'bg-stone-800 text-white' : 'cursor-not-allowed bg-stone-200 text-stone-500'
        "
        v-bind:disabled="!isComplete"
        v-on:click="onCopy"
      >
        整形テキストをコピー
      </button>
      <p v-if="copyState === 'copied'" class="mt-3 text-sm text-green-700">コピーしました</p>
      <p v-else-if="copyState === 'error'" class="mt-3 text-sm text-red-700">
        コピーできませんでした。ブラウザの権限を確認してください。
      </p>
    </section>
  </main>
</template>
