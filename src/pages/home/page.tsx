import { Button, Image, useDisclosure } from '@heroui/react'
import { motion as m } from 'framer-motion'
import { Suspense, useEffect, useState } from 'react'

import { RecipesList } from '@modules/recipes'
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
import { AddIcon } from '@shared/icons'
import { CreateRecipeModal } from '@modules/recipes/lazy'

// TODO: разделить запросы для списка рецептов и для страницы конкретного рецепта или - повод попробовать GraphQL ?

export function HomePage() {
  const { uid } = useAuth()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { filters, updateFilter, resetFilters } = useFilters()
  const { searchTerm, setSearchTerm } = useSearch('')

  const [hasRecipes, setHasRecipes] = useState<boolean | null>(null)

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

  useEffect(() => {
    if (hasRecipes === null || !hasRecipes) {
      setHasRecipes(!!recipes?.length)
    }
  }, [recipes])

  if (isLoading) return <Loader />
  if (isError) return <div>Error loading recipes</div>

  const hasFilteredResults = recipes && recipes.length > 0

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
          startContent={<AddIcon width={20} />}
        >
          Создать ✨
        </Button>
      </div>

      {hasRecipes ? (
        <>
          <SearchForm
            placeholder="Поиск рецептов..."
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="col-span-1 lg:col-span-1">
              <FiltersForm
                filters={filters}
                updateFilter={updateFilter}
                resetFilters={resetFilters}
              />
            </div>

            <div className="col-span-3 lg:col-span-3">
              {hasFilteredResults ? (
                <RecipesList recipes={recipes || []} />
              ) : (
                <div className="w-full mt-8 text-2xl text-center text-gray-800">
                  <Image
                    alt=""
                    className="mx-auto mb-4 w-36 h-auto"
                    removeWrapper
                    src="/no-food_opt.webp"
                  />
                  Не найдено рецептов по заданным фильтрам или поиску
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="w-full mt-8 text-2xl text-center text-gray-800">
          <Image
            alt=""
            className="mx-auto mb-4 w-36 h-auto"
            removeWrapper
            src="/new_opt.webp"
          />
          Рецепты пока не добавлены. Начните с создания первого рецепта!
        </div>
      )}

      {isOpen && (
        <Suspense fallback={<div>Загрузка модалки...</div>}>
          <CreateRecipeModal isOpen={isOpen} onOpenChange={onOpenChange} />
        </Suspense>
      )}
    </m.div>
  )
}
