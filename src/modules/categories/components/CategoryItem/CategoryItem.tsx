import { toast } from 'react-toastify'
import { MdEdit, MdDelete } from 'react-icons/md'
import { Button, Image, useDisclosure } from '@nextui-org/react'

import { Category } from '@/src/types'
import { useDeleteCategoryMutation } from '@shared/store/api'

import { EditCategoryModal } from '../EditCategoryModal/EditCategoryModal'

interface CategoryItemProps {
  category: Category
}

export const CategoryItem = ({ category }: CategoryItemProps) => {
  const { id, title, image_url } = category

  const [deleteCategory] = useDeleteCategoryMutation()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  // console.log(`category ===`)
  // console.log(category)

  const onDelete = async (id: string) => {
    try {
      await deleteCategory(id).unwrap()
      toast.success('Категория успешно удалена!')
    } catch (error) {
      console.error('Ошибка при удалении категории:', error)
    }
  }

  if (!category) return <div>No category data</div>

  return (
    <div className="w-full flex flex-col gap-4 p-4 rounded-2xl shadow-lg bg-white border border-gray-200 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-center gap-4">
        <h3 className="text-xl font-semibold text-006D77">{title}</h3>

        <div className="flex gap-2">
          <Button
            isIconOnly
            onPress={onOpen}
            className="bg-edf6f9 text-83c5be hover:text-006d77 transition-all"
          >
            <MdEdit size={20} />
          </Button>
          <Button
            isIconOnly
            onPress={() => onDelete(id)}
            className="bg-edf6f9 text-e29578 hover:text-red-600 transition-all"
          >
            <MdDelete size={20} />
          </Button>
        </div>
      </div>

      {image_url && (
        <Image
          isBlurred
          removeWrapper
          className="w-full h-48 object-cover rounded-xl border-4 border-83C5BE shadow-md"
          alt="Category Image"
          src={image_url}
        />
      )}

      {isOpen && (
        <EditCategoryModal
          category={category}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )}
    </div>
  )
}
