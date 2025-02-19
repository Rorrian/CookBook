import { motion as m } from 'framer-motion'

import { RecipesList } from '@modules/recipes'
import { useAuth, useFavorites } from '@shared/hooks'
import { DEFAULT_PAGE_ANIMATION } from '@shared/utils/constants'
import { Loader } from '@shared/components'
import { useGetRecipesByIdsQuery } from '@shared/store/api'

export function FavoritesPage() {
  const { uid } = useAuth()
  const { favoriteIds } = useFavorites(uid!)

  const {
    data: favorites,
    isLoading,
    isError,
  } = useGetRecipesByIdsQuery(favoriteIds)

  if (isLoading) return <Loader />
  if (isError) return <div>Ошибка загрузки избранных рецептов</div>

  return (
    <m.div className="flex flex-col gap-8 p-4" {...DEFAULT_PAGE_ANIMATION}>
      <h2 className="text-3xl font-bold text-center font-heading uppercase text-gray-700">
        Избранное
      </h2>

      {!!favorites?.length ? (
        <RecipesList recipes={favorites} />
      ) : (
        <p>Вы еще не добавили ни одного рецепта в избранное</p>
      )}
    </m.div>
  )
}
