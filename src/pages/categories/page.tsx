import { MdAdd } from 'react-icons/md'
import { Button, useDisclosure } from '@nextui-org/react'

import { useGetCategoriesQuery } from '@shared/store/api'
import { CategoryItem, CreateCategoryModal } from '@modules/categories'
import { Category } from '@/src/types'
import { Loader } from '@shared/components'

export function CategoriesPage() {
  const { data: categories, isLoading, isError } = useGetCategoriesQuery()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  if (isLoading) return <Loader />
  if (isError) return <div>Error loading recipes</div>
  if (!categories?.length) return <div>No categories found</div>

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex justify-center items-center gap-2 text-2xl font-bold text-center text-006d77">
        <h2 className="text-006d77 text-xl font-semibold">Категории</h2>
        <Button
          onPress={onOpen}
          color="primary"
          className="bg-006d77 text-white hover:bg-83c5be transition"
          startContent={<MdAdd />}
        >
          Создать
        </Button>
      </div>

      {isOpen && (
        <CreateCategoryModal isOpen={isOpen} onOpenChange={onOpenChange} />
      )}

      <ul className="flex flex-wrap gap-8 justify-center">
        {!!categories?.length &&
          categories.map((category: Category) => (
            <li
              key={category.id}
              className="w-[300px] min-h-[300px] flex justify-center"
            >
              <CategoryItem category={category} />
            </li>
          ))}
      </ul>
    </div>
  )
}
