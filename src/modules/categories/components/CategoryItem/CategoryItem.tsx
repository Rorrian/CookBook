import { toast } from 'react-toastify'
import { MdEdit, MdDelete } from 'react-icons/md'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Image,
  useDisclosure,
} from '@nextui-org/react'

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
    <Card className="w-full h-full flex flex-col gap-2 p-2 rounded-2xl bg-white/70 border border-gray-200">
      <CardHeader className="flex justify-between items-center gap-2 p-2">
        <h3 className="text-2xl font-semibold text-006d77 truncate">{title}</h3>

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
      </CardHeader>

      <CardBody className="flex flex-col gap-2 p-2 justify-between">
        {image_url && (
          <Image
            alt="Категория"
            className="w-full max-w-72 h-48 object-cover rounded-xl border-4 border-83C5BE shadow-md"
            isBlurred
            removeWrapper
            src={image_url}
          />
        )}
      </CardBody>

      {isOpen && (
        <EditCategoryModal
          category={category}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )}
    </Card>
  )
}
