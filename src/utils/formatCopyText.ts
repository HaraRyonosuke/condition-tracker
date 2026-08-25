import { checkItemDefinitions, type CheckItemId } from '@/constants/checkItems'
import { formatCopyDateTime } from '@/utils/datetime'

export function formatCopyText(input: {
  recordedAt: Date
  timeZone: string
  scores: Record<CheckItemId, number>
  totalScore: number
}): string {
  const { dateStr, timeStr, weekday } = formatCopyDateTime(input.recordedAt, input.timeZone)

  const lines = [
    '【日々の気分チェック記録】',
    `日時: ${dateStr} (${weekday}) ${timeStr} ${input.timeZone}`,
    `合計: ${input.totalScore}/21`,
    '',
    '[症状]',
  ]

  checkItemDefinitions.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.label}: ${input.scores[item.id]}/3`)
  })

  return lines.join('\n')
}
