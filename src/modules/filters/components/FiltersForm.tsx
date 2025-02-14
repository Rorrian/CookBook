import { Button, Select, SelectItem } from '@nextui-org/react'
import { MdCancel } from 'react-icons/md'
import { useState } from 'react'
import { isMobile } from 'react-device-detect'

import {
  useGetAllRecipeIngredientsOfCurrentUserQuery,
  useGetCategoriesQuery,
} from '@shared/store/api'
import { Loader } from '@shared/components'
import { getComplexityLevels } from '@shared/utils/complexityLevels'
import { useAuth } from '@shared/hooks'

import { DEFAULT_FILTERS, Filters } from '../hooks/useFilters'
import { IngredientsFilter } from './IngredientsFilter'

interface FiltersFormProps {
  filters: Filters
  updateFilter: (key: keyof Filters, value: string | string[]) => void
  resetFilters: () => void
}

export const FiltersForm = ({
  filters,
  updateFilter,
  resetFilters,
}: FiltersFormProps) => {
  const { uid } = useAuth()

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useGetCategoriesQuery()
  const {
    data: ingredients,
    isLoading: isIngredientsLoading,
    isError: isIngredientsError,
  } = useGetAllRecipeIngredientsOfCurrentUserQuery(uid!)

  const [isVisible, setIsVisible] = useState(true)

  const showResetButton =
    JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS)
  const selectedCategory = filters.category || ''
  const selectedComplexity = filters.complexity || ''

  const IngredientsFilterSelectHandler = (
    name: string,
    isSelected: boolean,
  ) => {
    const updatedIngredients = isSelected
      ? [...(filters.ingredients ?? []), name]
      : (filters.ingredients ?? []).filter(
          ingredientName => ingredientName !== name,
        )
    updateFilter('ingredients', updatedIngredients)
  }

  if (isCategoriesLoading || isIngredientsLoading) return <Loader />
  if (isCategoriesError || isIngredientsError)
    return <div>Ошибка загрузки данных</div>

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-006d77">Фильтры</h3>

        <div className="flex gap-y-1">
          {showResetButton && (
            <Button
              size="sm"
              className="bg-edf6f9 hover:text-e29578 transition-all"
              onPress={resetFilters}
            >
              Сбросить <MdCancel />
            </Button>
          )}

          {isMobile && (
            <Button
              size="sm"
              className="bg-edf6f9 hover:text-e29578 transition-all"
              onPress={() => setIsVisible(prev => !prev)}
            >
              {isVisible ? 'Скрыть' : 'Показать'}
            </Button>
          )}
        </div>
      </div>

      {isVisible && (
        <div className="space-y-4">
          <Select
            label="Категория"
            placeholder="Выберите категорию"
            selectedKeys={new Set([selectedCategory])}
            variant="bordered"
            onSelectionChange={keys => {
              const selectedKey = [...keys][0] || ''
              updateFilter('category', selectedKey)
            }}
          >
            {categories?.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.title}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Сложность"
            placeholder="Выберите сложность"
            selectedKeys={new Set([selectedComplexity])}
            variant="bordered"
            onSelectionChange={keys => {
              const selectedKey = Array.from(keys)[0] || ''
              updateFilter('complexity', selectedKey)
            }}
          >
            {getComplexityLevels().map(({ value, label }) => (
              <SelectItem
                key={value}
                value={value}
                textValue={value.toString()}
              >
                {label}
              </SelectItem>
            ))}
          </Select>

          {ingredients?.length && (
            <IngredientsFilter
              ingredients={ingredients}
              ingredientSelectionMode={filters.ingredientSelectionMode}
              selectedIngredients={filters.ingredients || []}
              onSelect={IngredientsFilterSelectHandler}
              updateFilter={updateFilter}
            />
          )}
        </div>
      )}
    </div>
  )
}
