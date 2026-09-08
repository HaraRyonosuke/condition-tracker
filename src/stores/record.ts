import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { checkItemDefinitions, emptyScores, type CheckItemId } from '@/constants/checkItems'
import { getBrowserTimeZone } from '@/utils/datetime'
import { formatCopyText } from '@/utils/formatCopyText'

export const useRecordStore = defineStore('record', () => {
  const scores = ref(emptyScores())
  const copyState = ref<'idle' | 'copied' | 'error'>('idle')
  /** Bumps when a score changes so the preview datetime refreshes. */
  const previewClock = ref(0)

  const isComplete = computed(() =>
    checkItemDefinitions.every((item) => scores.value[item.id] !== null),
  )

  const totalScore = computed(() => {
    if (!isComplete.value) return null
    return checkItemDefinitions.reduce((sum, item) => sum + (scores.value[item.id] ?? 0), 0)
  })

  const previewText = computed(() => {
    void previewClock.value
    return formatCopyText({
      recordedAt: new Date(),
      timeZone: getBrowserTimeZone(),
      scores: scores.value,
      totalScore: totalScore.value,
    })
  })

  function setScore(id: CheckItemId, value: number) {
    scores.value[id] = value
    previewClock.value += 1
    copyState.value = 'idle'
  }

  async function copyFormattedText(): Promise<void> {
    const text = formatCopyText({
      recordedAt: new Date(),
      timeZone: getBrowserTimeZone(),
      scores: scores.value,
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
    previewText,
    setScore,
    copyFormattedText,
  }
})
