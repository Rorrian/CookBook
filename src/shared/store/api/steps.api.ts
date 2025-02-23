import { NewStep, Step } from '@/src/types'

import { api } from './api'

export const stepsApi = api.injectEndpoints({
  endpoints: builder => ({
    getSteps: builder.query<Step[], string>({
      query: id => ({
        url: `/steps?recipe_id=eq.${id}`,
      }),
      providesTags: (_, __, id) => [{ type: 'Steps', id }],
    }),

    // getStep: builder.query<Step, string>({
    //   query: id => ({
    //     url: `/steps?id=eq.${id}`,
    //   }),
    //   transformResponse: (response: Step[]) => response[0],
    //   providesTags: (result, error, id) => [{ type: 'Steps', id }],
    // }),

    createStep: builder.mutation<null, NewStep>({
      query: newStep => ({
        url: '/steps',
        method: 'POST',
        body: newStep,
      }),
      invalidatesTags: (_, __, { recipe_id }) => [
        { type: 'Steps', id: recipe_id },
      ],
    }),

    editStep: builder.mutation<null, Step>({
      query: ({ id, step_number, description }) => ({
        url: `/steps?id=eq.${id}`,
        method: 'PATCH',
        body: { step_number, description },
      }),

      invalidatesTags: (_, __, { id, recipe_id }) => [
        { type: 'Steps', recipe_id },
        { type: 'Step', id },
      ],
    }),

    deleteStep: builder.mutation<null, string>({
      query: id => ({
        url: `/steps?id=eq.${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [{ type: 'Steps' }, { type: 'Step', id }],
    }),
  }),
})

export const {
  useGetStepsQuery,
  useCreateStepMutation,
  useEditStepMutation,
  useDeleteStepMutation,
} = stepsApi
