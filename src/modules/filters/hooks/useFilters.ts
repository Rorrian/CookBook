import { useState } from 'react'

export interface Filters {
  category?: string
  complexity?: string
}

const DEFAULT_FILTERS = {
  category: undefined,
  complexity: undefined,
}

export const useFilters = () => {
  const [filters, setFilters] = useState<Filters>({ ...DEFAULT_FILTERS })

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value || undefined,
    }))
  }

  const resetFilters = () => {
    setFilters({ ...DEFAULT_FILTERS })
  }

  return { filters, updateFilter, resetFilters }
}
