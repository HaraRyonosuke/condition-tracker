<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { mealSlotDefinitions, type MealSlotId } from '@/constants/behavior'
import { useRecordStore } from '@/stores/record'
import MealTimeDialog from '@/components/MealTimeDialog.vue'

const store = useRecordStore()
const { bathing, outdoor, meals } = storeToRefs(store)

const openSlot = ref<MealSlotId | null>(null)

const bathingOptions = [
  { value: true, label: '入れた' },
  { value: false, label: '入れなかった' },
] as const

const outdoorOptions = [
  { value: true, label: 'できた' },
  { value: false, label: 'できなかった' },
] as const

function openMeal(id: MealSlotId) {
  openSlot.value = id
}

function onMealConfirm(value: string) {
  if (openSlot.value === null) return
  store.setMealTime(openSlot.value, value)
  openSlot.value = null
}

function onMealClear() {
  if (openSlot.value === null) return
  store.setMealTime(openSlot.value, null)
  openSlot.value = null
}

function onMealCancel() {
  openSlot.value = null
}

function slotLabel(id: MealSlotId | null): string {
  if (id === null) return ''
  return mealSlotDefinitions.find((slot) => slot.id === id)?.label ?? ''
}

function slotDisplay(id: MealSlotId): string {
  return meals.value[id] ?? '—'
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <fieldset class="border-0 p-0">
      <legend class="mb-3 text-base font-medium text-stone-900">お風呂・シャワー</legend>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="option in bathingOptions"
          v-bind:key="String(option.value)"
          type="button"
          class="flex min-h-16 items-center justify-center rounded-lg border-2 px-2 py-2 text-base"
          v-bind:class="
            bathing === option.value
              ? 'border-stone-800 bg-stone-800 text-white'
              : 'border-stone-300 bg-white text-stone-800'
          "
          v-on:click="store.setBathing(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </fieldset>

    <fieldset class="border-0 p-0">
      <legend class="mb-3 text-base font-medium text-stone-900">外出</legend>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="option in outdoorOptions"
          v-bind:key="String(option.value)"
          type="button"
          class="flex min-h-16 items-center justify-center rounded-lg border-2 px-2 py-2 text-base"
          v-bind:class="
            outdoor === option.value
              ? 'border-stone-800 bg-stone-800 text-white'
              : 'border-stone-300 bg-white text-stone-800'
          "
          v-on:click="store.setOutdoor(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </fieldset>

    <fieldset class="border-0 p-0">
      <legend class="mb-3 text-base font-medium text-stone-900">食事</legend>
      <div class="relative z-10 grid grid-cols-2 gap-2">
        <button
          v-for="slot in mealSlotDefinitions"
          v-bind:key="slot.id"
          type="button"
          class="flex min-h-16 flex-col items-center justify-center rounded-lg border-2 border-stone-300 bg-white px-2 py-2 text-stone-800"
          v-on:click="openMeal(slot.id)"
        >
          <span class="text-sm text-stone-600">{{ slot.label }}</span>
          <span class="mt-1 text-base font-medium">{{ slotDisplay(slot.id) }}</span>
        </button>
      </div>
    </fieldset>

    <MealTimeDialog
      v-bind:open="openSlot !== null"
      v-bind:title="slotLabel(openSlot)"
      v-bind:draft-value="openSlot === null ? null : meals[openSlot]"
      v-on:confirm="onMealConfirm"
      v-on:clear="onMealClear"
      v-on:cancel="onMealCancel"
    />
  </div>
</template>
