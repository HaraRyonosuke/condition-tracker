import { describe, expect, it } from 'vitest'
import { emptyMeals } from '@/constants/behavior'
import { emptyScores } from '@/constants/checkItems'
import { formatCopyText } from '@/utils/formatCopyText'

const recordedAt = new Date('2026-08-25T13:15:00+09:00')
const timeZone = 'Asia/Tokyo'

const unanswered = {
  recordedAt,
  timeZone,
  scores: emptyScores(),
  totalScore: null,
  bathing: null,
  outdoor: null,
  meals: emptyMeals(),
}

describe('formatCopyText', () => {
  it('未回答は合計と各項目をダッシュにする', () => {
    const text = formatCopyText(unanswered)

    expect(text).toContain('【日々の気分チェック記録】')
    expect(text).toContain('合計: —/21')
    expect(text).toContain('お風呂・シャワー: —')
    expect(text).toContain('外出: —')
    expect(text).toContain('朝ごはん: —')
    expect(text).toContain('間食: —')
    expect(text).toContain('1. 気分・憂うつ: —/3')
    expect(text).toContain('7. 集中力: —/3')
  })

  it('行動と食事を症状の前に置く', () => {
    const text = formatCopyText({
      ...unanswered,
      bathing: true,
      outdoor: null,
      meals: {
        breakfast: '08:30',
        lunch: null,
        dinner: '19:00',
        snack: null,
      },
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

    expect(text).toContain(
      [
        '合計: 12/21',
        '',
        '[行動]',
        'お風呂・シャワー: 入れた',
        '外出: —',
        '',
        '[食事]',
        '朝ごはん: 08:30',
        '昼ごはん: —',
        '夜ごはん: 19:00',
        '間食: —',
        '',
        '[症状]',
        '1. 気分・憂うつ: 2/3',
      ].join('\n'),
    )
    expect(text.indexOf('[行動]')).toBeLessThan(text.indexOf('[食事]'))
    expect(text.indexOf('[食事]')).toBeLessThan(text.indexOf('[症状]'))
    expect(text).toContain('日時: 2026-08-25 (火) 13:15 Asia/Tokyo')
  })

  it('入浴と外出の偽は入れなかった・できなかったにする', () => {
    const text = formatCopyText({
      ...unanswered,
      bathing: false,
      outdoor: false,
    })

    expect(text).toContain('お風呂・シャワー: 入れなかった')
    expect(text).toContain('外出: できなかった')
  })

  it('帯ラベルと4択の言葉を出さない', () => {
    const text = formatCopyText({
      ...unanswered,
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
