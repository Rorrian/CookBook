import { MdAdd } from 'react-icons/md'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  useDisclosure,
} from '@nextui-org/react'

import { Ingredient } from '@/src/types'

import { IngredientItem } from '../IngredientItem/IngredientItem'
import { CreateIngredientModal } from '../CreateIngredientModal/CreateIngredientModal'

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
    <Card className="bg-edf6f9 shadow-lg rounded-2xl p-2 flex-grow">
      <CardHeader className="flex justify-between items-center border-b border-83c5be pb-2">
        <h3 className="text-006d77 text-xl font-semibold">Ингредиенты:</h3>
        <Button
          onPress={onOpen}
          color="primary"
          className="bg-006d77 text-white hover:bg-83c5be transition"
          startContent={<MdAdd />}
        >
          Добавить
        </Button>
      </CardHeader>

      <CardBody>
        {ingredients.length ? (
          <ul className="flex flex-col gap-2 mt-4">
            {ingredients.map((ingredient: Ingredient) => (
              <li
                key={ingredient.id}
                className="p-3 border border-83c5be rounded-md shadow-md bg-white"
              >
                <IngredientItem ingredient={ingredient} />
              </li>
            ))}
          </ul>
        ) : (
          <p>Ингредиентов для отображения нет</p>
        )}
      </CardBody>

      {isOpen && (
        <CreateIngredientModal
          recipe_id={recipe_id}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )}
    </Card>
  )
}
