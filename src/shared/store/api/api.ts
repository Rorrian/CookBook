import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { RootState } from '../store'
import { logout } from '../users/users.slice'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: async (args, api, extraOptions) => {
    let baseQueryResult = await fetchBaseQuery({
      baseUrl: `${import.meta.env.VITE_SUPABASE_URL}/rest/v1`,
      prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).users.token
        if (token) {
          headers.set('Authorization', `Bearer ${token}`)
        }
        headers.set('apikey', import.meta.env.VITE_SUPABASE_KEY)
        return headers
      },
    })(args, api, extraOptions)

    if (baseQueryResult.error && baseQueryResult.error.status === 401) {
      api.dispatch(logout())
    }
    return baseQueryResult
  },
  tagTypes: [
    'Categories',
    'Category',
    'Ingredients',
    'Ingredient',
    'Steps',
    'Step',
    'Units',
    'Recipes',
    'Recipe',
    'Macronutrients',
  ],
  endpoints: builder => {
    void builder
    return {}
  },
})
