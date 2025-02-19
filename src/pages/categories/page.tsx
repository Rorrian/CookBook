import { MdAdd } from 'react-icons/md'
import { Button, useDisclosure } from '@nextui-org/react'
import { motion as m } from 'framer-motion'

import { useGetCategoriesQuery } from '@shared/store/api'
import { CategoryItem, CreateCategoryModal } from '@modules/categories'
import { Category } from '@/src/types'
import { Loader } from '@shared/components'
import { DEFAULT_PAGE_ANIMATION } from '@shared/utils/constants'

export function CategoriesPage() {
  const { data: categories, isLoading, isError } = useGetCategoriesQuery()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  if (isLoading) return <Loader />
  if (isError) return <div>Error loading recipes</div>

  return (
    <m.div className="flex flex-col gap-8 p-4" {...DEFAULT_PAGE_ANIMATION}>
      <div className="relative flex justify-center items-center gap-2 text-2xl font-bold text-center text-006d77">
        <h2 className="text-3xl font-bold text-center font-heading uppercase text-gray-700">
          Категории
        </h2>

        <Button
          onPress={onOpen}
          color="primary"
          className="absolute right-0 bg-006d77 text-white hover:bg-83c5be transition"
          startContent={<MdAdd />}
        >
          Создать ✨
        </Button>
      </div>

      {isOpen && (
        <CreateCategoryModal isOpen={isOpen} onOpenChange={onOpenChange} />
      )}

      <ul className="flex flex-wrap gap-4 justify-between">
        {!!categories?.length
          ? categories.map((category: Category) => (
              <li
                key={category.id}
                className="w-full max-w-64 h-full flex justify-center transition-all duration-300 hover:-translate-y-2 hover:shadow-md"
              >
                <CategoryItem category={category} />
              </li>
            ))
          : 'Категорий не найдено'}
      </ul>
    </m.div>
  )
}
