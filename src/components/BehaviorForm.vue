<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Annoyed, Bath, DoorOpen, House, ShowerHead } from '@/icons'
import { mealSlotDefinitions, type MealSlotId } from '@/constants/behavior'
import { useRecordStore } from '@/stores/record'
import MealTimeDialog from '@/components/MealTimeDialog.vue'

const store = useRecordStore()
const { outdoor, meals } = storeToRefs(store)

const openSlot = ref<MealSlotId | null>(null)
const bathingChoice = ref<'bath' | 'shower' | 'skipped' | null>(null)

const bathingOptions = [
  { choice: 'bath', label: 'お風呂', icon: Bath },
  { choice: 'shower', label: 'シャワー', icon: ShowerHead },
  { choice: 'skipped', label: '入れなかった', icon: Annoyed },
] as const

const outdoorOptions = [
  { value: true, label: 'できた', icon: DoorOpen },
  { value: false, label: 'できなかった', icon: House },
] as const

function selectBathing(choice: 'bath' | 'shower' | 'skipped') {
  bathingChoice.value = choice
  store.setBathing(choice !== 'skipped')
}

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

function mealButtonText(id: MealSlotId): string {
  const slot = mealSlotDefinitions.find((item) => item.id === id)
  return `${slot?.buttonLabel ?? ''}: ${meals.value[id] ?? '—'}`
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-4 md:grid md:grid-cols-5">
      <fieldset class="border-0 p-0 md:col-span-3">
        <legend class="mb-2 text-base font-medium text-ink">お風呂・シャワー</legend>
        <div class="grid grid-cols-3 gap-1.5">
          <button
            v-for="option in bathingOptions"
            v-bind:key="option.choice"
            type="button"
            class="flex min-h-15 items-center justify-center rounded-lg border-2 px-2"
            v-bind:class="
              bathingChoice === option.choice
                ? 'border-select bg-select text-on-select'
                : 'border-line bg-card text-ink'
            "
            v-bind:aria-label="option.label"
            v-bind:aria-pressed="bathingChoice === option.choice"
            v-on:click="selectBathing(option.choice)"
          >
            <component
              v-bind:is="option.icon"
              v-bind:size="27"
              v-bind:stroke-width="2"
              aria-hidden="true"
            />
          </button>
        </div>
      </fieldset>

      <fieldset class="border-0 p-0 md:col-span-2">
        <legend class="mb-2 text-base font-medium text-ink">外出</legend>
        <div class="grid grid-cols-2 gap-1.5">
          <button
            v-for="option in outdoorOptions"
            v-bind:key="String(option.value)"
            type="button"
            class="flex min-h-15 items-center justify-center rounded-lg border-2 px-2"
            v-bind:class="
              outdoor === option.value
                ? 'border-select bg-select text-on-select'
                : 'border-line bg-card text-ink'
            "
            v-bind:aria-label="option.label"
            v-bind:aria-pressed="outdoor === option.value"
            v-on:click="store.setOutdoor(option.value)"
          >
            <component
              v-bind:is="option.icon"
              v-bind:size="27"
              v-bind:stroke-width="2"
              aria-hidden="true"
            />
          </button>
        </div>
      </fieldset>
    </div>

    <fieldset class="border-0 p-0">
      <legend class="mb-2 text-base font-medium text-ink">食事</legend>
      <div class="relative z-10 grid grid-cols-4 gap-1.5">
        <button
          v-for="slot in mealSlotDefinitions"
          v-bind:key="slot.id"
          type="button"
          class="flex min-h-15 items-center justify-center rounded-lg border-2 border-line bg-card px-1 text-sm text-ink"
          v-on:click="openMeal(slot.id)"
        >
          {{ mealButtonText(slot.id) }}
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
