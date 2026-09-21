function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function part(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  return parts.find((p) => p.type === type)?.value ?? ''
}

export function getBrowserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
}

/** Local clock as HH:MM. Meal copy has no time zone name. */
export function clockTimeHm(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/** Native `input type=time` may include seconds. Copy uses HH:MM. */
export function toMealHm(value: string): string | null {
  const match = /^(\d{2}):(\d{2})/.exec(value.trim())
  if (!match) return null
  return `${match[1]}:${match[2]}`
}

export type MealDisplay12h = {
  period: '午前' | '午後'
  hour: number
  minute: string
}

/** Screen label for a meal time. Copy stays 24h HH:MM. Hour is 1–12, not zero-padded. */
export function formatMealDisplay12h(value: string): MealDisplay12h | null {
  const hm = toMealHm(value)
  if (!hm) return null
  const hours = Number(hm.slice(0, 2))
  const minute = hm.slice(3, 5)
  if (!Number.isInteger(hours) || hours < 0 || hours > 23) return null
  const period = hours < 12 ? '午前' : '午後'
  const hour = hours % 12 === 0 ? 12 : hours % 12
  return { period, hour, minute }
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
