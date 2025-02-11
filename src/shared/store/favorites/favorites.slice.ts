import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Recipe } from '@/src/types'

import { RootState } from '../store'

interface FavoritesState {
  favorites: Recipe[]
}

const initialState: FavoritesState = {
  favorites: [],
}

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleToFavorites: (state, action: PayloadAction<Recipe>) => {
      const recipe = action.payload
      const isExist = state.favorites.some(
        recipeItem => recipeItem.id === recipe.id,
      )

      if (isExist) {
        state.favorites = state.favorites.filter(item => item.id !== recipe.id)
      } else {
        state.favorites.push(recipe)
      }
    },
  },
})

export const selectFavorites = (state: RootState) => state.favorites.favorites

export const selectIsInFavorites = createSelector(
  [selectFavorites, (_, id: string) => id],
  (favorites, id) => favorites.some((item: Recipe) => item.id === id),
)

export const { toggleToFavorites } = favoritesSlice.actions
export default favoritesSlice.reducer
