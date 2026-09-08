import { describe, expect, it } from 'vitest'
import { emptyScores } from '@/constants/checkItems'
import { formatCopyText } from '@/utils/formatCopyText'

const recordedAt = new Date('2026-08-25T13:15:00+09:00')
const timeZone = 'Asia/Tokyo'

describe('formatCopyText', () => {
  it('未回答は合計と各項目をダッシュにする', () => {
    const text = formatCopyText({
      recordedAt,
      timeZone,
      scores: emptyScores(),
      totalScore: null,
    })

    expect(text).toContain('【日々の気分チェック記録】')
    expect(text).toContain('合計: —/21')
    expect(text).toContain('1. 気分・憂うつ: —/3')
    expect(text).toContain('7. 集中力: —/3')
  })

  it('全問回答は渡した合計を出す', () => {
    const text = formatCopyText({
      recordedAt,
      timeZone,
      scores: {
        q1: 2,
        q2: 1,
        q3: 2,
        q4: 3,
        q5: 1,
        q6: 2,
        q7: 1,
      },
      totalScore: 12,
    })

    expect(text).toContain('合計: 12/21')
    expect(text).toContain('1. 気分・憂うつ: 2/3')
    expect(text).toContain('日時: 2026-08-25 (火) 13:15 Asia/Tokyo')
  })

  it('帯ラベルと4択の言葉を出さない', () => {
    const text = formatCopyText({
      recordedAt,
      timeZone,
      scores: {
        q1: 2,
        q2: 1,
        q3: 2,
        q4: 3,
        q5: 1,
        q6: 2,
        q7: 1,
      },
      totalScore: 12,
    })

    expect(text).not.toMatch(/低|軽度|中等度|要注意/)
    expect(text).not.toContain('なし')
    expect(text).not.toContain('少し')
    expect(text).not.toContain('かなり')
    expect(text).not.toContain('とても')
  })
})
