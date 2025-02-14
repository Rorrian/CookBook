import { useState } from 'react'

export enum IngredientSelectionMode {
  ALL = 'all',
  ANY = 'any',
}

export interface Filters {
  category?: string
  complexity?: string
  ingredients?: string[]
  ingredientSelectionMode: IngredientSelectionMode
}

export const DEFAULT_FILTERS = {
  category: undefined,
  complexity: undefined,
  ingredients: [],
  ingredientSelectionMode: IngredientSelectionMode.ANY,
}

export const useFilters = () => {
  const [filters, setFilters] = useState<Filters>({ ...DEFAULT_FILTERS })

  const updateFilter = (key: keyof Filters, value: string | string[]) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value.length ? value : undefined,
    }))
  }

  const resetFilters = () => {
    setFilters({ ...DEFAULT_FILTERS })
  }

  return {
    filters,
    updateFilter,
    resetFilters,
  }
}
