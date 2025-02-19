import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '../store'

interface FavoritesState {
  favorites: { [userId: string]: string[] }
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
      action: PayloadAction<{ userId: string; recipeId: string }>,
    ) => {
      const { userId, recipeId } = action.payload
      const userFavorites = state.favorites[userId] || []
      const isExist = userFavorites.includes(recipeId)

      if (isExist) {
        state.favorites[userId] = userFavorites.filter(id => id !== recipeId)
      } else {
        state.favorites[userId] = [...userFavorites, recipeId]
      }
    },
  },
})

export const selectFavoriteIds = (state: RootState, userId: string) =>
  state.favorites.favorites[userId] || []

export const selectIsInFavorites = createSelector(
  [
    (state: RootState, userId: string) => selectFavoriteIds(state, userId),
    (_, __, id: string) => id,
  ],
  (favoriteIds, id) => favoriteIds.includes(id),
)

export const { toggleToFavorites } = favoritesSlice.actions
export default favoritesSlice.reducer
