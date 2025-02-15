import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Recipe } from '@/src/types'

import { RootState } from '../store'

interface FavoritesState {
  favorites: { [userId: string]: Recipe[] }
}

const initialState: FavoritesState = {
  favorites: {},
}

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleToFavorites: (
      state,
      action: PayloadAction<{ userId: string; recipe: Recipe }>,
    ) => {
      const { userId, recipe } = action.payload
      const userFavorites = state.favorites[userId] || []
      const isExist = userFavorites.some(
        recipeItem => recipeItem.id === recipe.id,
      )

      if (isExist) {
        state.favorites[userId] = userFavorites.filter(
          item => item.id !== recipe.id,
        )
      } else {
        state.favorites[userId] = [...userFavorites, recipe]
      }
    },
  },
})

export const selectFavorites = (state: RootState, userId: string) =>
  state.favorites.favorites[userId] || []

export const selectIsInFavorites = createSelector(
  [
    (state: RootState, userId: string) => selectFavorites(state, userId),
    (_, __, id: string) => id,
  ],
  (favorites, id) => favorites.some((item: Recipe) => item.id === id),
)

export const { toggleToFavorites } = favoritesSlice.actions
export default favoritesSlice.reducer
