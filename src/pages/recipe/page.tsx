import { useNavigate, useParams } from 'react-router-dom'
import { addToast, Button, Image, useDisclosure } from '@heroui/react'
import { motion as m } from 'framer-motion'
import { lazy, Suspense } from 'react'

import {
  useDeleteRecipeMutation,
  useGetRecipeIngredientsQuery,
  useGetRecipeQuery,
  useGetStepsQuery,
} from '@shared/store/api'
import { IngredientsList, NutritionFacts, StepsList } from '@modules/recipes'
import { RoutePaths } from '@shared/utils/navigation'
import { Loader, StarRating } from '@shared/components'
import { DEFAULT_PAGE_ANIMATION } from '@shared/utils/constants'
import { EditIcon, DeleteIcon } from '@shared/icons'

const EditRecipeModal = lazy(() =>
  import('@modules/recipes/lazy').then(module => ({
    default: module.EditRecipeModal,
  })),
)

export function RecipePage() {
  const navigate = useNavigate()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { id } = useParams<{ id: string }>()

  if (!id) return <div>Идентификатор рецепта неверный</div>

  const {
    data: recipe,
    isLoading: isRecipeLoading,
    isError: isRecipeError,
  } = useGetRecipeQuery(id)
  const { data: ingredients, isLoading: isIngredientsLoading } =
    useGetRecipeIngredientsQuery(id)
  const { data: steps, isLoading: isStepsLoading } = useGetStepsQuery(id)
  const [deleteRecipe] = useDeleteRecipeMutation()

  if (isRecipeLoading || isIngredientsLoading || isStepsLoading)
    return <Loader />

  if (isRecipeError) return <div>Ошибка при загрузке данных рецепта</div>
  if (!recipe) return <div>Рецепт не найден</div>

  const {
    title,
    description,
    category_title,
    image_url,
    complexity,
    preparation_time,
    servings_count,
    macronutrients,
  } = recipe

  // console.log('recipe')
  // console.log(recipe)

  const onDeleteRecipe = async (id: string) => {
    try {
      await deleteRecipe(id).unwrap()
      addToast({
        title: 'Рецепт успешно удален!',
        color: 'success',
      })

      navigate(RoutePaths.HOME)
    } catch (error) {
      addToast({
        title: 'Ошибка при удалении рецепта:',
        description: error?.toString(),
        color: 'danger',
        timeout: 5000,
      })
    }
  }

  return (
    <m.div
      className="flex flex-col gap-4 p-[1rem_1rem_1rem_2.5rem]"
      {...DEFAULT_PAGE_ANIMATION}
    >
      <div className="flex gap-4">
        <div className="flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 items-start">
            <h2 className="text-3xl text-center font-bold font-heading uppercase text-gray-700 min-w-0">
              {title}
            </h2>

            <div className="flex gap-2 justify-end">
              <Button
                className="bg-white/70 text-83c5be hover:text-006d77 transition-all"
                isIconOnly
                size="sm"
                onPress={onOpen}
              >
                <EditIcon width={20} />
              </Button>
              <Button
                className="bg-white/70 text-e29578 hover:text-red-600 transition-all"
                isIconOnly
                size="sm"
                onPress={() => onDeleteRecipe(id)}
              >
                <DeleteIcon width={20} />
              </Button>
            </div>
          </div>

          <div className="relative p-2 bg-white/60 rounded-xl border-2 border-83C5BE text-xl text-006d77">
            {image_url && (
              <Image
                alt="Рецепт"
                className="float-right m-4 w-full lg:max-w-[300px] xl:max-w-[400px] 2xl:max-w-[400px] h-64 2xl:h-96 object-cover rounded-xl border-2 border-83C5BE shadow-md"
                isBlurred
                removeWrapper
                src={image_url}
              />
            )}

            <div className="mb-4 max-w-xs">
              <p>
                <b>Описание:</b>
              </p>
              {description}
            </div>

            <div className="mb-4">
              <p>
                <b>Категория:</b>
              </p>
              {category_title}
            </div>

            {complexity && (
              <div className="mb-4">
                <p>
                  <b>Сложность:</b>
                </p>
                <StarRating rating={complexity} />
              </div>
            )}

            {preparation_time && (
              <div className="mb-4">
                <p>
                  <b>Общее время приготовления:</b>
                </p>
                {preparation_time}
              </div>
            )}

            {servings_count && (
              <div className="mb-4">
                <p>
                  <b>Количество порций:</b>
                </p>
                {servings_count}
              </div>
            )}

            {macronutrients &&
              Object.values(macronutrients).some(value => value > 0) && (
                <NutritionFacts macronutrients={macronutrients} />
              )}

            <div className="clear-both"></div>
          </div>
        </div>

        <IngredientsList ingredients={ingredients ?? []} recipe_id={id!} />
      </div>

      <StepsList steps={steps ?? []} recipe_id={id!} />

      {isOpen && (
        <Suspense fallback={<div>Загрузка модалки...</div>}>
          <EditRecipeModal
            recipe={recipe}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
          />
        </Suspense>
      )}
    </m.div>
  )
}
