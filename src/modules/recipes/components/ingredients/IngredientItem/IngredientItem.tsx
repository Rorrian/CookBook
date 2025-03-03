import { Button, Card, CardHeader, useDisclosure } from '@heroui/react'
import { lazy, Suspense } from 'react'

import { Ingredient } from '@/src/types'
import { useDeleteIngredientMutation } from '@shared/store/api'
import { EditIcon, DeleteIcon } from '@shared/icons'

const EditIngredientModal = lazy(
  () => import('../EditIngredientModal/EditIngredientModal'),
)

interface IngredientItemProps {
  ingredient: Ingredient
}

export const IngredientItem = ({ ingredient }: IngredientItemProps) => {
  const { id, name, quantity, unit_name } = ingredient

  const [deleteIngredient] = useDeleteIngredientMutation()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  // console.log(`ingredient ===`)
  // console.log(ingredient)

  const onDelete = async (id: string) => {
    try {
      await deleteIngredient(id).unwrap()
    } catch (error) {
      console.error('Ошибка при удалении ингредиента:', error)
    }
  }

  if (!ingredient) return <div>No ingredient data</div>

  return (
    <Card className="bg-white shadow-md rounded-xl">
      <CardHeader className="flex justify-between items-center p-3 rounded-t-xl">
        <p className="text-006d77 font-medium">
          {name} - {quantity} {unit_name}
        </p>

        <div className="flex gap-2">
          <Button
            className="bg-white text-83c5be hover:text-006d77 transition"
            isIconOnly
            size="sm"
            onPress={onOpen}
          >
            <EditIcon width={20} />
          </Button>

          <Button
            className="bg-white text-e29578 hover:text-red-600 transition"
            isIconOnly
            size="sm"
            onPress={() => onDelete(id)}
          >
            <DeleteIcon width={20} />
          </Button>
        </div>
      </CardHeader>

      {isOpen && (
        <Suspense fallback={<div>Загрузка модалки...</div>}>
          <EditIngredientModal
            ingredient={ingredient}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
          />
        </Suspense>
      )}
    </Card>
  )
}
