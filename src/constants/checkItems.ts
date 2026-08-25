export const checkItemDefinitions = [
  { id: 'q1', label: '気分・憂うつ', text: '気分が落ち込む・憂うつに感じた' },
  { id: 'q2', label: '興味・喜びの減退', text: '物事への興味や喜びが感じられなかった' },
  { id: 'q3', label: '疲労・気力', text: '疲れやすい・気力がなかった' },
  { id: 'q4', label: '睡眠', text: '睡眠に問題があった(入眠困難・中途覚醒・過眠など)' },
  { id: 'q5', label: '食欲の変化', text: '食欲の変化があった(低下または増加)' },
  { id: 'q6', label: '自己否定', text: '自分を責める気持ち・無価値感があった' },
  { id: 'q7', label: '集中力', text: '集中することが難しかった' },
] as const

export type CheckItemId = (typeof checkItemDefinitions)[number]['id']

export const scaleLabels = [
  { value: 0, label: 'なし' },
  { value: 1, label: '少し' },
  { value: 2, label: 'かなり' },
  { value: 3, label: 'とても' },
] as const

export type ScoreValue = (typeof scaleLabels)[number]['value']

export function emptyScores(): Record<CheckItemId, number | null> {
  return {
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
    q6: null,
    q7: null,
  }
}
