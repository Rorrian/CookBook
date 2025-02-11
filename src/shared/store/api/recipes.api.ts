import { Macronutrients, NewRecipe, Recipe, UpdatedRecipe } from '@/src/types'
import { supabase } from '@libs/supabase'

import { api } from './api'
import { handleError } from '@shared/utils/handleError'

export const recipesApi = api.injectEndpoints({
  endpoints: builder => ({
    getRecipes: builder.query<Recipe[], void>({
      query: () => ({
        url: `/rpc/get_recipes_with_categories`,
      }),
      providesTags: ['Recipes'],
    }),

    getRecipe: builder.query<Recipe, string>({
      // query: id => `/recipes?id=eq.${id}`,
      query: id => ({
        url: `/rpc/get_recipe_with_category`,
        method: 'POST',
        body: { input_recipe_id: id },
      }),
      transformResponse: (response: Recipe[]) => response[0],
      providesTags: (result, error, id) => [{ type: 'Recipe', id }],
    }),

    createRecipe: builder.mutation<null, NewRecipe>({
      // query: newRecipe => ({
      //   url: '/recipes',
      //   method: 'POST',
      // 		body: newRecipe,
      // }),
      async queryFn(newRecipe, api, extraOptions, baseQuery) {
        try {
          const recipeResponse = (await baseQuery({
            url: '/recipes',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Prefer: 'return=representation',
            },
            body: {
              title: newRecipe.title,
              description: newRecipe.description,
              category_id: newRecipe.category_id,
              complexity: newRecipe.complexity,
              preparation_time: newRecipe.preparation_time,
              servings_count: newRecipe.servings_count,
              image_url: newRecipe.image_url,
            },
          })) as { data: Recipe[] }

          if (!recipeResponse.data.length || !recipeResponse.data[0].id) {
            throw new Error(
              `Не удалось создать рецепт: ${JSON.stringify(recipeResponse, null, 2)}`,
            )
          }

          if (
            newRecipe?.macronutrients &&
            Object.values(newRecipe?.macronutrients).every(value => value > 0)
          ) {
            const recipeId = recipeResponse.data[0].id

            const macronutrientsResponse = (await baseQuery({
              url: '/macronutrients',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Prefer: 'return=representation',
              },
              body: {
                recipe_id: recipeId,
                calories: newRecipe?.macronutrients?.calories,
                proteins: newRecipe?.macronutrients?.proteins,
                fats: newRecipe?.macronutrients?.fats,
                carbohydrates: newRecipe?.macronutrients?.carbohydrates,
              },
            })) as { data: Macronutrients[] }

            if (
              !macronutrientsResponse.data.length ||
              !macronutrientsResponse.data[0].calories
            ) {
              throw new Error(
                `Не удалось создать макроэллементы рецепта: ${JSON.stringify(recipeResponse, null, 2)}`,
              )
            }
          }

          return { data: null }
        } catch (error) {
          return {
            error: {
              status: 500,
              statusText: 'Ошибка при создании рецепта',
              data: handleError(error),
            },
          }
        }
      },
      invalidatesTags: (result, error) => [{ type: 'Recipes' }],
    }),

    uploadRecipeImage: builder.mutation<string, File>({
      async queryFn(file, api, extraOptions, baseQuery) {
        try {
          const { data, error } = await supabase.storage
            .from('images')
            .upload(`recipes/${file.name}`, file)
          if (error) {
            throw error
          }
          const { data: publicUrlData } = await supabase.storage
            .from('images')
            .getPublicUrl(data.path)

          return { data: publicUrlData.publicUrl }
        } catch (error) {
          return {
            error: {
              status: 500,
              statusText: 'Ошибка при загрузке изображения рецепта',
              data: handleError(error),
            },
          }
        }
      },
      invalidatesTags: ['Recipes'],
    }),
    deleteRecipeImage: builder.mutation<null, string>({
      async queryFn(imagePath) {
        try {
          const { data, error } = await supabase.storage
            .from('images')
            .remove([imagePath])

          if (error) {
            throw error
          }

          return { data: null }
        } catch (error) {
          return {
            error: {
              status: 500,
              statusText: 'Ошибка при удалении изображения рецепта',
              data: handleError(error),
            },
          }
        }
      },
    }),

    editRecipe: builder.mutation<null, UpdatedRecipe>({
      // query: recipe => ({
      //   url: `/recipes?id=eq.${recipe.id}`,
      //   method: 'PATCH',
      //   body: recipe,
      // }),
      async queryFn(updatedRecipe, api, extraOptions, baseQuery) {
        try {
          const recipeResponse = (await baseQuery({
            url: `/recipes?id=eq.${updatedRecipe.id}`,
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Prefer: 'return=representation',
            },
            body: {
              title: updatedRecipe.title,
              description: updatedRecipe.description,
              category_id: updatedRecipe.category_id,
              complexity: updatedRecipe.complexity,
              preparation_time: updatedRecipe.preparation_time,
              servings_count: updatedRecipe.servings_count,
              image_url: updatedRecipe.image_url,
            },
          })) as { data: Recipe[] }

          if (!recipeResponse.data.length || !recipeResponse.data[0].id) {
            throw new Error(
              `Не удалось обновить рецепт: ${JSON.stringify(recipeResponse, null, 2)}`,
            )
          }

          if (
            updatedRecipe?.macronutrients &&
            Object.values(updatedRecipe?.macronutrients).every(
              value => value > 0,
            )
          ) {
            const recipeId = recipeResponse.data[0].id

            const macronutrientsResponse = (await baseQuery({
              url: `/macronutrients?recipe_id=eq.${recipeId}`,
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Prefer: 'return=representation',
              },
              body: {
                recipe_id: recipeId,
                calories: updatedRecipe?.macronutrients?.calories,
                proteins: updatedRecipe?.macronutrients?.proteins,
                fats: updatedRecipe?.macronutrients?.fats,
                carbohydrates: updatedRecipe?.macronutrients?.carbohydrates,
              },
            })) as { data: Macronutrients[] }

            if (
              !macronutrientsResponse.data.length ||
              !macronutrientsResponse.data[0].calories
            ) {
              throw new Error(
                `Не удалось обновить макроэллементы рецепта: ${JSON.stringify(recipeResponse, null, 2)}`,
              )
            }
          }

          return { data: null }
        } catch (error) {
          return {
            error: {
              status: 500,
              statusText: 'Ошибка при обновлении рецепта',
              data: handleError(error),
            },
          }
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Recipes' },
        { type: 'Recipe', id },
        { type: 'Macronutrients', id },
      ],
    }),

    deleteRecipe: builder.mutation<null, string>({
      //   query: id => ({
      //     url: `/recipes?id=eq.${id}`,
      //     method: 'DELETE',
      //   }),
      async queryFn(id, api, extraOptions, baseQuery) {
        try {
          const { data: recipeData } = (await baseQuery({
            url: `/recipes?id=eq.${id}`,
            method: 'GET',
          })) as { data: Recipe[] }

          if (!recipeData || recipeData.length === 0) {
            throw new Error('Рецепт не найден')
          }

          const recipe = recipeData[0]
          const { image_url } = recipe

          if (image_url) {
            const basePath = '/storage/v1/object/public/images/'
            const relativePath = image_url.includes(basePath)
              ? image_url.split(basePath)[1]
              : null

            if (relativePath) {
              const { error: removeError } = await supabase.storage
                .from('images')
                .remove([relativePath])

              if (removeError) {
                console.error('Не удалось удалить изображение:', removeError)
              }
            }
          }

          await baseQuery({
            url: `/recipes?id=eq.${id}`,
            method: 'DELETE',
          })

          return { data: null }
        } catch (error) {
          return {
            error: {
              status: 500,
              statusText: 'Ошибка при удалении рецепта',
              data: handleError(error),
            },
          }
        }
      },
      invalidatesTags: (result, error, id) => [
        { type: 'Recipes' },
        { type: 'Recipe', id },
      ],
    }),
  }),
})

export const {
  useGetRecipesQuery,
  useGetRecipeQuery,
  useCreateRecipeMutation,
  useUploadRecipeImageMutation,
  useDeleteRecipeImageMutation,
  useEditRecipeMutation,
  useDeleteRecipeMutation,
} = recipesApi
