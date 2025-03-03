import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  Image,
  useDisclosure,
} from '@heroui/react'
import { lazy, Suspense } from 'react'

import { Category } from '@/src/types'
import { useDeleteCategoryMutation } from '@shared/store/api'
import { EditIcon, DeleteIcon } from '@shared/icons'

const EditCategoryModal = lazy(
  () => import('../EditCategoryModal/EditCategoryModal'),
)

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
      addToast({
        title: 'Категория успешно удалена!',
        color: 'success',
      })
    } catch (error) {
      addToast({
        title: 'Ошибка при удалении категории:',
        description: error?.toString(),
        color: 'danger',
        timeout: 5000,
      })
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
            <EditIcon width={20} />
          </Button>
          <Button
            isIconOnly
            onPress={() => onDelete(id)}
            className="bg-edf6f9 text-e29578 hover:text-red-600 transition-all"
          >
            <DeleteIcon width={20} />
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
        <Suspense fallback={<div>Загрузка модалки...</div>}>
          <EditCategoryModal
            category={category}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
          />
        </Suspense>
      )}
    </Card>
  )
}
