import { MdAdd } from 'react-icons/md'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  useDisclosure,
} from '@nextui-org/react'
import { lazy, Suspense } from 'react'

import { Ingredient } from '@/src/types'

import { IngredientItem } from '../IngredientItem/IngredientItem'

const CreateIngredientModal = lazy(
  () => import('../CreateIngredientModal/CreateIngredientModal'),
)

interface IngredientsListProps {
  ingredients: Ingredient[]
  recipe_id: string
}

export const IngredientsList = ({
  ingredients,
  recipe_id,
}: IngredientsListProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  // console.log(`ingredients ===`)
  // console.log(ingredients)

  return (
    <Card className="bg-edf6f9/50 shadow-lg rounded-2xl p-2 flex-grow xl:max-w-xs 2xl:max-w-2xl border border-006d77/50">
      <CardHeader className="flex gap-2 justify-between items-center border-b border-006d77/50 pb-2">
        <h3 className="text-006d77 font-bold text-xl uppercase">
          Ингредиенты:
        </h3>

        <Button
          className="bg-006d77 text-white text-md hover:bg-83c5be transition"
          color="primary"
          startContent={<MdAdd />}
          onPress={onOpen}
        >
          Добавить
        </Button>
      </CardHeader>

      <CardBody>
        {ingredients.length ? (
          <ul className="flex flex-col gap-2 mt-4 text-xl">
            {ingredients.map((ingredient: Ingredient) => (
              <li key={ingredient.id}>
                <IngredientItem ingredient={ingredient} />
              </li>
            ))}
          </ul>
        ) : (
          <p>Ингредиентов для отображения нет</p>
        )}
      </CardBody>

      {isOpen && (
        <Suspense fallback={<div>Загрузка модалки...</div>}>
          <CreateIngredientModal
            recipe_id={recipe_id}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
          />
        </Suspense>
      )}
    </Card>
  )
}
