export type NutritionData = {
  id: number
  name: string
  energy: number
  protein: number
  total_fat: number
  total_carbohydrates: number
  fibra: number
  calcium: number
  fosforo: number
  zinc: number
  iron: number
  sodium: number
  potassium: number
  image?: string
}

export type NutrientKey = keyof Omit<NutritionData, "id" | "name" | "image">

export type SortConfig = {
  key: NutrientKey
  direction: "asc" | "desc"
}
