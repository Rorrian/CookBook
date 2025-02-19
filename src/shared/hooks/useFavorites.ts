import { useDispatch } from 'react-redux'

import {
  selectFavoriteIds,
  selectIsInFavorites,
  toggleToFavorites,
} from '@shared/store/favorites/favorites.slice'
import { RootState } from '@shared/store/store'

import { useTypedSelector } from './useTypedSelector'

export const useFavorites = (userId: string) => {
  const dispatch = useDispatch()

  const favoriteIds = useTypedSelector(state =>
    selectFavoriteIds(state, userId),
  )

  const toggleFavorite = (recipeId: string) =>
    dispatch(toggleToFavorites({ userId, recipeId }))

  const isInFavorites = (recipeId: string) =>
    useTypedSelector((state: RootState) =>
      selectIsInFavorites(state, userId, recipeId),
    )

  return {
    favoriteIds,
    toggleFavorite,
    isInFavorites,
  }
}
