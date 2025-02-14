import { authApi } from './auth.api'
import { useGetUnitsQuery } from './units.api'
import {
  useGetStepsQuery,
  useCreateStepMutation,
  useEditStepMutation,
  useDeleteStepMutation,
} from './steps.api'
import {
  useGetRecipesQuery,
  useGetRecipeQuery,
  useCreateRecipeMutation,
  useUploadRecipeImageMutation,
  useDeleteRecipeImageMutation,
  useEditRecipeMutation,
  useDeleteRecipeMutation,
} from './recipes.api'
import {
  useGetAllRecipeIngredientsOfCurrentUserQuery,
  useGetRecipeIngredientsQuery,
  useCreateIngredientMutation,
  useEditIngredientMutation,
  useDeleteIngredientMutation,
} from './ingredients.api'
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUploadCategoryImageMutation,
  useDeleteCategoryImageMutation,
  useEditCategoryMutation,
  useDeleteCategoryMutation,
} from './categories.api'

export {
  authApi,
  useGetUnitsQuery,
  useGetStepsQuery,
  useCreateStepMutation,
  useEditStepMutation,
  useDeleteStepMutation,
  useGetRecipesQuery,
  useGetRecipeQuery,
  useCreateRecipeMutation,
  useUploadRecipeImageMutation,
  useDeleteRecipeImageMutation,
  useEditRecipeMutation,
  useDeleteRecipeMutation,
  useGetAllRecipeIngredientsOfCurrentUserQuery,
  useGetRecipeIngredientsQuery,
  useCreateIngredientMutation,
  useEditIngredientMutation,
  useDeleteIngredientMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUploadCategoryImageMutation,
  useDeleteCategoryImageMutation,
  useEditCategoryMutation,
  useDeleteCategoryMutation,
}
