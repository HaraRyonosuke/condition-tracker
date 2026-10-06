import { mealSlotDefinitions, type MealTimes } from '@/constants/behavior'
import { checkItemDefinitions, type CheckItemId } from '@/constants/checkItems'
import { formatCopyDateTime } from '@/utils/datetime'

function scorePart(value: number | null): string {
  return value === null ? '—' : String(value)
}

function bathingPart(value: boolean | null): string {
  if (value === null) return '—'
  return value ? '入れた' : '入れなかった'
}

function outdoorPart(value: boolean | null): string {
  if (value === null) return '—'
  return value ? 'できた' : 'できなかった'
}

function mealPart(value: string | null): string {
  return value === null ? '—' : value
}

export function formatCopyText(input: {
  recordedAt: Date
  timeZone: string
  scores: Record<CheckItemId, number | null>
  totalScore: number | null
  bathing: boolean | null
  outdoor: boolean | null
  meals: MealTimes
}): string {
  const { dateStr, timeStr, weekday } = formatCopyDateTime(input.recordedAt, input.timeZone)

  const lines = [
    '【日々の気分チェック記録】',
    `日時: ${dateStr} (${weekday}) ${timeStr} ${input.timeZone}`,
    `合計: ${scorePart(input.totalScore)}/21`,
    '',
    '[行動]',
    `お風呂・シャワー: ${bathingPart(input.bathing)}`,
    `外出: ${outdoorPart(input.outdoor)}`,
    '',
    '[食事]',
    ...mealSlotDefinitions.map((slot) => `${slot.label}: ${mealPart(input.meals[slot.id])}`),
    '',
    '[症状]',
  ]

  checkItemDefinitions.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.label}: ${scorePart(input.scores[item.id])}/3`)
  })

  return lines.join('\n')
}
