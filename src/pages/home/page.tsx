import { MdAdd } from 'react-icons/md'
import { Button, useDisclosure } from '@nextui-org/react'

import { RecipesList, CreateRecipeModal } from '@modules/recipes'
import { useGetRecipesQuery } from '@shared/store/api'
import { Loader } from '@shared/components'
import { useSearch, SearchForm } from '@modules/search'
import {
  FiltersForm,
  IngredientSelectionMode,
  useFilters,
} from '@modules/filters'

// TODO: одновременное использование поиска и фильтров

// TODO: разделить запросы для списка рецептов и для страницы конкретного рецепта или - повод попробовать GraphQL ?

export function HomePage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { filters, updateFilter, resetFilters } = useFilters()
  const { searchTerm, setSearchTerm } = useSearch('')

  const {
    data: recipes,
    isLoading,
    isError,
  } = useGetRecipesQuery({
    search: searchTerm || undefined,
    category: filters.category || undefined,
    complexity_level: filters.complexity || undefined,
    selected_ingredients: filters.ingredients?.length
      ? filters.ingredients.map(name => name.toLowerCase()).join(',')
      : undefined,
    is_use_union: filters.ingredients?.length
      ? filters.ingredientSelectionMode === IngredientSelectionMode.ALL
        ? true
        : false
      : undefined,
  })

  if (isLoading) return <Loader />
  if (isError) return <div>Error loading recipes</div>

  return (
    <div className="flex flex-col gap-8 p-4">
      <div className="flex justify-center items-center gap-2 text-2xl font-bold text-center text-006d77">
        <h2 className="text-006d77 text-xl font-semibold">Рецепты</h2>
        <Button
          onPress={onOpen}
          color="primary"
          className="bg-006d77 text-white hover:bg-83c5be transition"
          startContent={<MdAdd />}
        >
          Создать
        </Button>
      </div>

      {!recipes?.length ? (
        <p className="text-center text-gray-500">Рецептов не найдено</p>
      ) : (
        <>
          <SearchForm
            placeholder="Поиск рецептов..."
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
            <div className="col-span-1 lg:col-span-1">
              <FiltersForm
                filters={filters}
                updateFilter={updateFilter}
                resetFilters={resetFilters}
              />
            </div>

            <div className="col-span-3 lg:col-span-3">
              <RecipesList recipes={recipes} />
            </div>
          </div>
        </>
      )}

      {isOpen && (
        <CreateRecipeModal isOpen={isOpen} onOpenChange={onOpenChange} />
      )}
    </div>
  )
}
