import { Button, Select, SelectItem } from '@heroui/react'
import { useState } from 'react'
import { isMobile } from 'react-device-detect'

import {
  useGetAllRecipeIngredientsOfCurrentUserQuery,
  useGetCategoriesQuery,
} from '@shared/store/api'
import { Loader } from '@shared/components'
import { getComplexityLevels } from '@shared/utils/complexityLevels'
import { useAuth } from '@shared/hooks'
import { CancelIcon } from '@shared/icons'

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
    <div className="flex flex-col gap-4 p-2 rounded-2xl shadow-lg bg-white/70">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-006d77">Фильтры</h3>

        <div className="flex gap-y-1">
          {showResetButton && (
            <Button
              size="sm"
              className="text-md bg-edf6f9 hover:text-e29578 transition-all"
              onPress={resetFilters}
            >
              Сбросить <CancelIcon width={20} />
            </Button>
          )}

          {isMobile && (
            <Button
              size="sm"
              className="text-md bg-edf6f9 hover:text-e29578 transition-all"
              onPress={() => setIsVisible(prev => !prev)}
            >
              {isVisible ? 'Скрыть' : 'Показать'}
            </Button>
          )}
        </div>
      </div>

      {isVisible && (
        <div className="text-heading space-y-2">
          <Select
            size="lg"
            label="Категория"
            placeholder="Выберите категорию"
            variant="bordered"
            selectedKeys={new Set([selectedCategory])}
            onSelectionChange={keys => {
              const selectedValue = String([...keys][0] || '')
              updateFilter('category', selectedValue)
            }}
          >
            {(categories || []).map(category => (
              <SelectItem key={category.id} textValue={category.title}>
                {category.title}
              </SelectItem>
            ))}
          </Select>

          <Select
            size="lg"
            label="Сложность"
            placeholder="Выберите сложность"
            variant="bordered"
            selectedKeys={new Set([selectedComplexity])}
            onSelectionChange={keys => {
              const selectedValue = String(Array.from(keys)[0] || '')
              updateFilter('complexity', selectedValue)
            }}
            renderValue={items => {
              if (!items.length) return 'Выберите сложность'

              const selectedItem = items[0]
              const selectedValue = selectedItem.key

              const level = getComplexityLevels().find(
                item => item.value === selectedValue,
              )

              return level ? (
                <span>{level.label}</span>
              ) : (
                <span>
                  {selectedValue?.toString() ?? 'Неизвестное значение'}
                </span>
              )
            }}
          >
            {getComplexityLevels().map(({ value, label }) => (
              <SelectItem key={value} textValue={value}>
                {label}
              </SelectItem>
            ))}
          </Select>

          {!!ingredients?.length && (
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
