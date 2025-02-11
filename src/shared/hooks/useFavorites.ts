import { useDispatch } from 'react-redux'

import {
  selectFavorites,
  selectIsInFavorites,
  toggleToFavorites,
} from '@shared/store/favorites/favorites.slice'
import { Recipe } from '@/src/types'
import { RootState } from '@shared/store/store'

import { useTypedSelector } from './useTypedSelector'

export const useFavorites = () => {
  const dispatch = useDispatch()
  const favorites = useTypedSelector(selectFavorites)

  const toggleFavorite = (recipe: Recipe) => {
    dispatch(toggleToFavorites(recipe))
  }

  const isInFavorites = (id: string) =>
    useTypedSelector((state: RootState) => selectIsInFavorites(state, id))

  return {
    favorites,
    toggleFavorite,
    isInFavorites,
  }
}
