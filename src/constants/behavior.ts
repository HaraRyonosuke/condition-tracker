export const mealSlotDefinitions = [
  { id: 'breakfast', label: '朝ごはん' },
  { id: 'lunch', label: '昼ごはん' },
  { id: 'dinner', label: '夜ごはん' },
  { id: 'snack', label: '間食' },
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
