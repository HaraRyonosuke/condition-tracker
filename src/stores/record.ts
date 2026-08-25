import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { checkItemDefinitions, emptyScores, type CheckItemId } from '@/constants/checkItems'
import { getBrowserTimeZone } from '@/utils/datetime'
import { formatCopyText } from '@/utils/formatCopyText'

export const useRecordStore = defineStore('record', () => {
  const scores = ref(emptyScores())
  const copyState = ref<'idle' | 'copied' | 'error'>('idle')

  const isComplete = computed(() =>
    checkItemDefinitions.every((item) => scores.value[item.id] !== null),
  )

  const totalScore = computed(() => {
    if (!isComplete.value) return null
    return checkItemDefinitions.reduce((sum, item) => sum + (scores.value[item.id] ?? 0), 0)
  })

  function setScore(id: CheckItemId, value: number) {
    scores.value[id] = value
    copyState.value = 'idle'
  }

  async function copyFormattedText(): Promise<void> {
    if (!isComplete.value || totalScore.value === null) return

    const recordedAt = new Date()
    const timeZone = getBrowserTimeZone()
    const answered = {} as Record<CheckItemId, number>
    for (const item of checkItemDefinitions) {
      const value = scores.value[item.id]
      if (value === null) return
      answered[item.id] = value
    }

    const text = formatCopyText({
      recordedAt,
      timeZone,
      scores: answered,
      totalScore: totalScore.value,
    })

    try {
      await navigator.clipboard.writeText(text)
      copyState.value = 'copied'
    } catch {
      copyState.value = 'error'
    }
  }

  return {
    scores,
    copyState,
    isComplete,
    totalScore,
    setScore,
    copyFormattedText,
  }
})
