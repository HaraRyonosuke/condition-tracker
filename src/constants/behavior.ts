export const mealSlotDefinitions = [
  { id: 'breakfast', label: '朝ごはん', buttonLabel: '朝' },
  { id: 'lunch', label: '昼ごはん', buttonLabel: '昼' },
  { id: 'dinner', label: '夜ごはん', buttonLabel: '夜' },
  { id: 'snack', label: '間食', buttonLabel: '間食' },
] as const

export type MealSlotId = (typeof mealSlotDefinitions)[number]['id']

export type MealTimes = Record<MealSlotId, string | null>

export function emptyMeals(): MealTimes {
  return {
    breakfast: null,
    lunch: null,
    dinner: null,
    snack: null,
  }
}
