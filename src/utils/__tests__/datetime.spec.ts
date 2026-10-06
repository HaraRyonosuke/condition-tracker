import { describe, expect, it } from 'vitest'
import { formatMealDisplay12h, toMealHm } from '@/utils/datetime'

describe('formatMealDisplay12h', () => {
  it('午前0時は12時として出す', () => {
    expect(formatMealDisplay12h('00:00')).toEqual({ period: '午前', hour: 12, minute: '00' })
  })

  it('正午は午後12時として出す', () => {
    expect(formatMealDisplay12h('12:00')).toEqual({ period: '午後', hour: 12, minute: '00' })
  })

  it('午後の時はゼロ埋めしない', () => {
    expect(formatMealDisplay12h('13:08')).toEqual({ period: '午後', hour: 1, minute: '08' })
  })

  it('23時台は午後11時', () => {
    expect(formatMealDisplay12h('23:59')).toEqual({ period: '午後', hour: 11, minute: '59' })
  })

  it('秒付きのネイティブ値でも分まで使う', () => {
    expect(formatMealDisplay12h('08:30:00')).toEqual({ period: '午前', hour: 8, minute: '30' })
    expect(toMealHm('08:30:00')).toBe('08:30')
  })

  it('不正な文字列は null', () => {
    expect(formatMealDisplay12h('')).toBeNull()
    expect(formatMealDisplay12h('abc')).toBeNull()
  })
})
