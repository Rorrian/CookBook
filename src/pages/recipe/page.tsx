import { toast } from 'react-toastify'
import { MdEdit, MdDelete } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  useDisclosure,
} from '@nextui-org/react'

import {
  useDeleteRecipeMutation,
  useGetRecipeIngredientsQuery,
  useGetRecipeQuery,
  useGetStepsQuery,
} from '@shared/store/api'
import {
  EditRecipeModal,
  IngredientsList,
  NutritionFacts,
  StepsList,
} from '@modules/recipes'
import { RoutePaths } from '@shared/utils/navigation'
import { Loader, StarRating } from '@shared/components'

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
      toast.success('Рецепт успешно удален!')

      navigate(RoutePaths.HOME)
    } catch (error) {
      console.error('Ошибка при удалении рецепта:', error)
    }
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-md rounded-xl border border-83c5be transition-all">
          <CardHeader className="flex justify-between items-center bg-edf6f9 p-4 rounded-t-xl">
            <h2 className="font-bold text-2xl text-006d77 min-w-0 truncate">
              {title}
            </h2>

            <div className="flex gap-2">
              <Button
                isIconOnly
                onPress={onOpen}
                className="bg-white text-83c5be hover:text-006d77 transition-all"
              >
                <MdEdit size={20} />
              </Button>
              <Button
                isIconOnly
                onPress={() => onDeleteRecipe(id)}
                className="bg-white text-e29578 hover:text-red-600 transition-all"
              >
                <MdDelete size={20} />
              </Button>
            </div>
          </CardHeader>

          <CardBody className="flex flex-col gap-6 p-4">
            {image_url && (
              <img
                src={image_url}
                alt="Рецепт"
                className="w-full md:w-auto max-h-96 object-cover rounded-lg shadow-md"
              />
            )}

            <div className="flex flex-col gap-4">
              <div className="text-lg text-006d77">
                <p>
                  <b>Описание:</b>
                </p>
                {description}
              </div>

              <div className="text-lg text-006d77">
                <p>
                  <b>Категория:</b>
                </p>
                {category_title}
              </div>

              {complexity && (
                <div className="text-lg text-006d77">
                  <p>
                    <b>Сложность:</b>
                  </p>
                  <StarRating rating={complexity} />
                </div>
              )}

              {preparation_time && (
                <div className="text-lg text-006d77">
                  <p>
                    <b>Общее время приготовления:</b>
                  </p>
                  {preparation_time}
                </div>
              )}

              {servings_count && (
                <div className="text-lg text-006d77">
                  <p>
                    <b>Количество порций:</b>
                  </p>
                  {servings_count}
                </div>
              )}

              {macronutrients &&
                Object.values(macronutrients).every(value => value > 0) && (
                  <NutritionFacts macronutrients={macronutrients} />
                )}
            </div>
          </CardBody>
        </Card>

        <IngredientsList ingredients={ingredients ?? []} recipe_id={id!} />
      </div>

      <StepsList steps={steps ?? []} recipe_id={id!} />

      {isOpen && (
        <EditRecipeModal
          recipe={recipe}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )}
    </div>
  )
}
