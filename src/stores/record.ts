import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { emptyMeals, type MealSlotId } from '@/constants/behavior'
import { checkItemDefinitions, emptyScores, type CheckItemId } from '@/constants/checkItems'
import { getBrowserTimeZone, toMealHm } from '@/utils/datetime'
import { formatCopyText } from '@/utils/formatCopyText'

export const useRecordStore = defineStore('record', () => {
  const scores = ref(emptyScores())
  const bathing = ref<boolean | null>(null)
  const outdoor = ref<boolean | null>(null)
  const meals = ref(emptyMeals())
  const copyState = ref<'idle' | 'copied' | 'error'>('idle')
  /** Bumps when draft changes so the preview datetime refreshes. */
  const previewClock = ref(0)

  const isComplete = computed(() =>
    checkItemDefinitions.every((item) => scores.value[item.id] !== null),
  )

  const totalScore = computed(() => {
    if (!isComplete.value) return null
    return checkItemDefinitions.reduce((sum, item) => sum + (scores.value[item.id] ?? 0), 0)
  })

  function copyInput(recordedAt: Date) {
    return {
      recordedAt,
      timeZone: getBrowserTimeZone(),
      scores: scores.value,
      totalScore: totalScore.value,
      bathing: bathing.value,
      outdoor: outdoor.value,
      meals: meals.value,
    }
  }

  const previewText = computed(() => {
    void previewClock.value
    return formatCopyText(copyInput(new Date()))
  })

  function touchDraft() {
    previewClock.value += 1
    copyState.value = 'idle'
  }

  function setScore(id: CheckItemId, value: number) {
    scores.value[id] = value
    touchDraft()
  }

  function setBathing(value: boolean) {
    bathing.value = value
    touchDraft()
  }

  function setOutdoor(value: boolean) {
    outdoor.value = value
    touchDraft()
  }

  function setMealTime(id: MealSlotId, value: string | null) {
    meals.value[id] = value === null ? null : toMealHm(value)
    touchDraft()
  }

  async function copyFormattedText(): Promise<void> {
    const text = formatCopyText(copyInput(new Date()))

    try {
      await navigator.clipboard.writeText(text)
      copyState.value = 'copied'
    } catch {
      copyState.value = 'error'
    }
  }

  return {
    scores,
    bathing,
    outdoor,
    meals,
    copyState,
    isComplete,
    totalScore,
    previewText,
    setScore,
    setBathing,
    setOutdoor,
    setMealTime,
    copyFormattedText,
  }
})
