import { lazy } from 'react'

const CreateRecipeModal = lazy(
  () => import('./recipes/CreateRecipeModal/CreateRecipeModal'),
)
const EditRecipeModal = lazy(
  () => import('./recipes/EditRecipeModal/EditRecipeModal'),
)

export { CreateRecipeModal, EditRecipeModal }
