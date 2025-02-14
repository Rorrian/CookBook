import { Category, NewCategory } from '@/src/types'
import { handleError } from '@shared/utils/handleError'
import { supabase } from '@libs/supabase'

import { api } from './api'

export const categoriesApi = api.injectEndpoints({
  endpoints: builder => ({
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      providesTags: [{ type: 'Categories' }],
    }),

    getCategory: builder.query<Category, string>({
      query: id => ({
        url: `/categories?id=eq.${id}`,
      }),
      transformResponse: (response: Category[]) => response[0],
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),

    createCategory: builder.mutation<null, NewCategory>({
      query: newCategory => ({
        url: '/categories',
        method: 'POST',
        body: newCategory,
      }),
      invalidatesTags: ['Categories'],
    }),

    uploadCategoryImage: builder.mutation<string, File>({
      async queryFn(file, api, extraOptions, baseQuery) {
        try {
          const { data, error } = await supabase.storage
            .from('images')
            .upload(`categories/${file.name}`, file)

          if (error) {
            throw error
          }

          const { data: publicUrlData } = await supabase.storage
            .from('images')
            .getPublicUrl(data.path)
          return { data: publicUrlData.publicUrl }
        } catch (error: unknown) {
          return {
            error: {
              status: 500,
              statusText: 'Ошибка при загрузке изображения категории',
              data: handleError(error),
            },
          }
        }
      },
    }),
    deleteCategoryImage: builder.mutation<null, string>({
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
              statusText: 'Ошибка при удалении изображения категории',
              data: handleError(error),
            },
          }
        }
      },
    }),

    editCategory: builder.mutation<null, Category>({
      query: ({ id, title, image_url }) => ({
        url: `/categories?id=eq.${id}`,
        method: 'PATCH',
        body: { title, image_url },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Categories' },
        { type: 'Category', id },
      ],
    }),

    deleteCategory: builder.mutation<null, string>({
      async queryFn(id, api, extraOptions, baseQuery) {
        try {
          const { data: categoryData } = (await baseQuery({
            url: `/categories?id=eq.${id}`,
            method: 'GET',
          })) as { data: Category[] }

          if (!categoryData || categoryData.length === 0) {
            throw new Error('Категория не найдена')
          }

          const category = categoryData[0]
          const { image_url } = category

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
                console.error(
                  'Не удалось удалить изображение категории:',
                  removeError,
                )
              }
            }
          }

          await baseQuery({
            url: `/categories?id=eq.${id}`,
            method: 'DELETE',
          })

          return { data: null }
        } catch (error) {
          return {
            error: {
              status: 500,
              statusText: 'Ошибка при удалении категории',
              data: handleError(error),
            },
          }
        }
      },
      invalidatesTags: (result, error, id) => [
        { type: 'Categories' },
        { type: 'Category', id },
      ],
    }),
  }),
})

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUploadCategoryImageMutation,
  useDeleteCategoryImageMutation,
  useEditCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi
