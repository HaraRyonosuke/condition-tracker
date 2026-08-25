import { checkItemDefinitions, type CheckItemId } from '@/constants/checkItems'
import { formatCopyDateTime } from '@/utils/datetime'

function scorePart(value: number | null): string {
  return value === null ? '—' : String(value)
}

export function formatCopyText(input: {
  recordedAt: Date
  timeZone: string
  scores: Record<CheckItemId, number | null>
  totalScore: number | null
}): string {
  const { dateStr, timeStr, weekday } = formatCopyDateTime(input.recordedAt, input.timeZone)

  const lines = [
    '【日々の気分チェック記録】',
    `日時: ${dateStr} (${weekday}) ${timeStr} ${input.timeZone}`,
    `合計: ${scorePart(input.totalScore)}/21`,
    '',
    '[症状]',
  ]

  checkItemDefinitions.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.label}: ${scorePart(input.scores[item.id])}/3`)
  })

  return lines.join('\n')
}
