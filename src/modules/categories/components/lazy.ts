import { lazy } from 'react'

const CreateCategoryModal = lazy(
  () => import('./CreateCategoryModal/CreateCategoryModal'),
)

export { CreateCategoryModal }
