import { Unit } from '@/src/types'

import { api } from './api'

export const unitsApi = api.injectEndpoints({
  endpoints: builder => ({
    getUnits: builder.query<Unit[], void>({
      query: () => '/units',
      providesTags: ['Units'],
    }),

    // getUnit: builder.query<Unit, string>({
    //   query: id => ({
    //     url: `/units?id=eq.${id}`,
    //   }),
    //   transformResponse: (response: Unit[]) => response[0],
    //   providesTags: (result, error, id) => [{ type: "Unit", id }],
    // }),
  }),
})

export const {
  useGetUnitsQuery,
  // useGetUnitQuery
} = unitsApi
