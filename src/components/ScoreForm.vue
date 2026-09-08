<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { checkItemDefinitions, type CheckItemId } from '@/constants/checkItems'
import { useRecordStore } from '@/stores/record'
import ScoreItemInput from '@/components/ScoreItemInput.vue'

const store = useRecordStore()
const { scores } = storeToRefs(store)

function onScoreChange(id: CheckItemId, value: number) {
  store.setScore(id, value)
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <ScoreItemInput
      v-for="item in checkItemDefinitions"
      v-bind:key="item.id"
      v-bind:text="item.text"
      v-bind:model-value="scores[item.id]"
      v-on:update:model-value="onScoreChange(item.id, $event)"
    />
  </div>
</template>
