import { MdAdd } from 'react-icons/md'
import { Button, useDisclosure } from '@nextui-org/react'

import { RecipesList } from '@modules/recipes'
import { useGetRecipesQuery } from '@shared/store/api'
import { Loader } from '@shared/components'
import { CreateRecipeModal } from '@modules/recipes/components'

export function HomePage() {
  const { data: recipes, isLoading, isError } = useGetRecipesQuery()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  if (isLoading) return <Loader />
  if (isError) return <div>Error loading recipes</div>

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex justify-center items-center gap-2 text-2xl font-bold text-center text-006d77">
        <h2 className="text-006d77 text-xl font-semibold">Рецепты</h2>
        <Button
          onPress={onOpen}
          color="primary"
          className="bg-006d77 text-white hover:bg-83c5be transition"
          startContent={<MdAdd />}
        >
          Добавить
        </Button>
      </div>

      <RecipesList recipes={recipes || []} />

      {isOpen && (
        <CreateRecipeModal isOpen={isOpen} onOpenChange={onOpenChange} />
      )}
    </div>
  )
}
