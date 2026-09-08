function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function part(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  return parts.find((p) => p.type === type)?.value ?? ''
}

export function getBrowserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
}

/** ISO 8601 with numeric offset. Uses the host local clock, not VPN IP. */
export function toIsoWithOffset(date: Date): string {
  const offsetMinutes = -date.getTimezoneOffset()
  const sign = offsetMinutes >= 0 ? '+' : '-'
  const abs = Math.abs(offsetMinutes)
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` +
    `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`
  )
}

export function formatCopyDateTime(
  date: Date,
  timeZone: string,
): { dateStr: string; timeStr: string; weekday: string } {
  const parts = new Intl.DateTimeFormat('ja-JP', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    hourCycle: 'h23',
  }).formatToParts(date)

  const weekday = part(parts, 'weekday').replace('曜日', '')

  return {
    dateStr: `${part(parts, 'year')}-${part(parts, 'month')}-${part(parts, 'day')}`,
    timeStr: `${part(parts, 'hour')}:${part(parts, 'minute')}`,
    weekday,
  }
}
