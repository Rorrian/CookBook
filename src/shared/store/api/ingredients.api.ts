import { Ingredient, NewIngredient } from '@/src/types'

import { api } from './api'

export const ingredientsApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllRecipeIngredientsOfCurrentUser: builder.query<
      { name: string }[],
      string
    >({
      query: current_user_id => ({
        url: '/rpc/get_ingredients_for_user',
        params: { current_user_id },
      }),
      providesTags: () => [{ type: 'Ingredients' }],
    }),

    getRecipeIngredients: builder.query<Ingredient[], string>({
      query: id => ({
        url: `/rpc/get_ingredients_with_units`,
        method: 'POST',
        body: { p_recipe_id: id },
      }),
      providesTags: (_, __, id) => [{ type: 'Ingredients', id }],
    }),

    // getIngredient: builder.query<Ingredient, void>({
    //   query: id => ({
    //     url: `/ingredients?id=eq.${id}`,
    //   }),
    //   query: () => ({
    //     url: `/rpc/get_ingredients_with_units?id=eq.${id}`,
    //   }),
    //   transformResponse: (response: Ingredient[]) => response[0],
    //   providesTags: (_, __, id) => [{ type: "Ingredient", id }],
    // }),

    createIngredient: builder.mutation<null, NewIngredient>({
      query: newIngredient => ({
        url: '/ingredients',
        method: 'POST',
        body: newIngredient,
      }),
      invalidatesTags: (_, __, { recipe_id }) => [
        { type: 'Ingredients', id: recipe_id },
      ],
    }),

    editIngredient: builder.mutation<null, Ingredient>({
      query: ({ id, name, quantity, unit_id }) => ({
        url: `/ingredients?id=eq.${id}`,
        method: 'PATCH',
        body: { id, name, quantity, unit_id },
      }),
      invalidatesTags: (_, __, { id, recipe_id }) => [
        { type: 'Ingredients', recipe_id },
        { type: 'Ingredient', id },
      ],
    }),

    deleteIngredient: builder.mutation<null, string>({
      query: id => ({
        url: `/ingredients?id=eq.${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'Ingredients' },
        { type: 'Ingredient', id },
      ],
    }),
  }),
})

export const {
  useGetAllRecipeIngredientsOfCurrentUserQuery,
  useGetRecipeIngredientsQuery,
  // useGetIngredient,
  useCreateIngredientMutation,
  useEditIngredientMutation,
  useDeleteIngredientMutation,
} = ingredientsApi
