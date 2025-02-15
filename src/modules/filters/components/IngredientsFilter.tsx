import { useMemo, useState } from 'react'
import { Button, Checkbox, Radio, RadioGroup } from '@nextui-org/react'

import { SearchForm, useSearch } from '@modules/search'

import { Filters, IngredientSelectionMode } from '../hooks/useFilters'
import clsx from 'clsx'

const MAX_VISIBLE_LIST_ITEMS = 3

interface IngredientsFilterProps {
  ingredients: { name: string }[]
  ingredientSelectionMode: IngredientSelectionMode
  selectedIngredients: string[]
  onSelect: (ingredientId: string, isChecked: boolean) => any
  updateFilter: (key: keyof Filters, value: string | string[]) => void
}

export const IngredientsFilter = ({
  ingredients,
  ingredientSelectionMode,
  selectedIngredients,
  onSelect,
  updateFilter,
}: IngredientsFilterProps) => {
  const { searchTerm, setSearchTerm } = useSearch('')
  const [isExpanded, setIsExpanded] = useState(false)

  const filteredIngredients = useMemo(
    () =>
      ingredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [ingredients, searchTerm],
  )
  const visibleIngredients = isExpanded
    ? filteredIngredients
    : filteredIngredients.slice(0, MAX_VISIBLE_LIST_ITEMS)

  // console.log(ingredients)

  return (
    <div className="border p-4 border-divider rounded-medium">
      <p className="text-sm text-gray-500 mb-2">Подбор ингредиентов:</p>

      <div className="flex flex-col gap-y-2 text-sm">
        <RadioGroup
          className="border p-2 border-divider rounded-medium"
          label="Текущий режим подбора рецептов:"
          value={ingredientSelectionMode}
          onValueChange={value =>
            updateFilter('ingredientSelectionMode', value)
          }
        >
          <Radio value={IngredientSelectionMode.ALL} size="sm">
            В рецепте должны быть все указанные ингредиенты
          </Radio>
          <Radio value={IngredientSelectionMode.ANY} size="sm">
            В рецепте должен быть хотя бы один из указанных ингредиентов
          </Radio>
        </RadioGroup>

        <SearchForm
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Поиск по ингредиентам..."
        />
      </div>

      <div
        className={clsx(
          'flex flex-col gap-3 mt-4 transition-all',
          isExpanded ? 'max-h-96 overflow-y-scroll' : 'max-h-24',
        )}
      >
        {visibleIngredients.map(ingredient => {
          const isSelected = selectedIngredients.includes(ingredient.name)

          return (
            <Checkbox
              key={ingredient.name}
              isSelected={isSelected}
              onValueChange={newValue => onSelect(ingredient.name, newValue)}
            >
              <span className="text-sm">{ingredient.name}</span>
            </Checkbox>
          )
        })}
      </div>

      {filteredIngredients.length > 5 && (
        <Button
          size="sm"
          variant="bordered"
          className="mt-4"
          onClick={() => setIsExpanded(prev => !prev)}
        >
          {isExpanded ? 'Скрыть' : 'Показать больше'}
        </Button>
      )}
    </div>
  )
}
