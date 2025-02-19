import { MdAdd } from 'react-icons/md'
import { Button, useDisclosure } from '@nextui-org/react'
import { motion as m } from 'framer-motion'

import { RecipesList, CreateRecipeModal } from '@modules/recipes'
import { useGetRecipesWithSearchAndFiltersQuery } from '@shared/store/api'
import { Loader } from '@shared/components'
import { useSearch, SearchForm } from '@modules/search'
import {
  FiltersForm,
  IngredientSelectionMode,
  useFilters,
} from '@modules/filters'
import { useAuth } from '@shared/hooks'
import { DEFAULT_PAGE_ANIMATION } from '@shared/utils/constants'

// TODO: одновременное использование поиска и фильтров

// TODO: разделить запросы для списка рецептов и для страницы конкретного рецепта или - повод попробовать GraphQL ?

export function HomePage() {
  const { uid } = useAuth()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { filters, updateFilter, resetFilters } = useFilters()
  const { searchTerm, setSearchTerm } = useSearch('')

  const {
    data: recipes,
    isLoading,
    isError,
  } = useGetRecipesWithSearchAndFiltersQuery({
    userId: uid!,
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
    <m.div className="flex flex-col gap-4 p-4" {...DEFAULT_PAGE_ANIMATION}>
      <div className="relative flex justify-center items-center gap-2 text-2xl font-bold text-center text-006d77">
        <h2 className="text-3xl font-bold text-center font-heading uppercase text-gray-700">
          Рецепты
        </h2>

        <Button
          onPress={onOpen}
          color="primary"
          className="absolute right-0 bg-006d77 text-white hover:bg-83c5be transition"
          startContent={<MdAdd />}
        >
          Создать ✨
        </Button>
      </div>

      <SearchForm
        placeholder="Поиск рецептов..."
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="col-span-1 lg:col-span-1">
            <FiltersForm
              filters={filters}
              updateFilter={updateFilter}
              resetFilters={resetFilters}
            />
          </div>

          <div className="col-span-3 lg:col-span-3">
            {!recipes?.length ? (
              <div className="w-full mt-8 text-2xl text-center text-gray-800">
                <img
                  alt=""
                  className="mx-auto mb-4 w-36 h-auto"
                  src="/no-food.gif"
                />
                Рецептов не найдено
              </div>
            ) : (
              <RecipesList recipes={recipes} />
            )}
          </div>
        </div>
      </>

      {isOpen && (
        <CreateRecipeModal isOpen={isOpen} onOpenChange={onOpenChange} />
      )}
    </m.div>
  )
}
