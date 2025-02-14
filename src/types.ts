export type AuthCredentials = {
  email: string
  password: string
}

export interface Category {
  id: string
  title: string
  image_url?: string
}
export type NewCategory = Omit<Category, 'id'>

export type Unit = {
  id: string
  name: string
}

export type Ingredient = {
  id: string
  name: string
  quantity: number
  unit_id: string
  unit_name?: string
  recipe_id: string
}
export type NewIngredient = Omit<Ingredient, 'id' | 'unit_name'>

export type Step = {
  id: string
  description: string
  step_number: number
  recipe_id: string
}
export type NewStep = Omit<Step, 'id'>

export type Macronutrients = {
  calories: number
  proteins: number
  fats: number
  carbohydrates: number
}

export interface Recipe {
  id: string
  title: string
  description?: string
  category_id: string
  category_title: string
  image_url?: string
  complexity?: number
  preparation_time?: string
  servings_count?: number
  macronutrients?: Macronutrients
}
export type NewRecipe = Omit<Recipe, 'id' | 'category_title'>
export type UpdatedRecipe = Omit<Recipe, 'category_title'>
