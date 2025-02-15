import { useDispatch } from 'react-redux'

import {
  selectFavorites,
  selectIsInFavorites,
  toggleToFavorites,
} from '@shared/store/favorites/favorites.slice'
import { Recipe } from '@/src/types'
import { RootState } from '@shared/store/store'

import { useTypedSelector } from './useTypedSelector'

export const useFavorites = (userId: string) => {
  const dispatch = useDispatch()
  const favorites = useTypedSelector(state => selectFavorites(state, userId))

  const toggleFavorite = (recipe: Recipe) =>
    dispatch(toggleToFavorites({ userId, recipe }))

  const isInFavorites = (userId: string, recipeId: string) =>
    useTypedSelector((state: RootState) =>
      selectIsInFavorites(state, userId, recipeId),
    )

  return {
    favorites,
    toggleFavorite,
    isInFavorites,
  }
}
