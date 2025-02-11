import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { Controller, useForm } from 'react-hook-form'
import {
  Input,
  Form,
  Button,
  Spinner,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react'

import { Category } from '@/src/types'
import {
  useDeleteCategoryImageMutation,
  useEditCategoryMutation,
  useUploadCategoryImageMutation,
} from '@shared/store/api'
import { ImageUpload } from '@shared/components'

interface EditCategoryFormProps {
  category: Category
  isOpen: boolean
  onOpenChange: () => void
}

export const EditCategoryModal = ({
  category,
  isOpen,
  onOpenChange,
}: EditCategoryFormProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<Category>()

  const [editCategory] = useEditCategoryMutation()
  const [uploadCategoryImage] = useUploadCategoryImageMutation()
  const [deleteCategoryImage] = useDeleteCategoryImageMutation()

  const { id, title, image_url } = category

  const imageUploadRef = useRef<{ cancel: () => Promise<void> } | null>(null)
  const [isImageUploading, setIsImageUploading] = useState(false)

  const onUpdate = async (data: Category) => {
    try {
      const updatedCategory: Category = { ...data, id }
      await editCategory(updatedCategory).unwrap()
      toast.success('Категория успешно обновлена!')
      reset()
      onOpenChange()
    } catch (error) {
      console.error(error)
      toast.error(`Ошибка при обновлении категории: ${error}`)
    }
  }

  const handleCancel = async () => {
    imageUploadRef.current?.cancel()
    reset()
    onOpenChange()
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {onClose => (
          <Form onSubmit={handleSubmit(onUpdate)}>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-2xl font-semibold text-center text-006D77 mb-4">
                Редактирование
              </h3>
            </ModalHeader>

            <ModalBody className="w-full">
              <Controller
                name="title"
                control={control}
                rules={{
                  required: 'Название категории обязательно',
                  pattern: {
                    value: /^(?!\d+$).+/,
                    message: 'Название не может содержать только цифры',
                  },
                }}
                defaultValue={title}
                render={({ field }) => (
                  <Input
                    {...field}
                    isRequired
                    className="w-full"
                    errorMessage={errors.title?.message}
                    isClearable
                    isInvalid={!!errors.title?.message}
                    label="Название категории"
                    placeholder="Введите название"
                    variant="bordered"
                    onClear={() => reset({ title: '' })}
                  />
                )}
              />

              <ImageUpload
                ref={imageUploadRef}
                initialValue={image_url}
                isImageUploading={isImageUploading}
                setIsImageUploading={setIsImageUploading}
                uploadHandler={uploadCategoryImage}
                deleteHandler={deleteCategoryImage}
                onImageUploaded={imageUrl => setValue('image_url', imageUrl)}
              />
            </ModalBody>

            <ModalFooter className="w-full">
              <Button color="danger" variant="light" onPress={handleCancel}>
                Отменить
              </Button>

              <Button
                className="w-full bg-gradient-to-r from-[#006D77] via-[#83C5BE] to-[#EDF6F9] hover:from-[#006D77] hover:via-[#83C5BE] hover:to-[#E29578] text-white py-2 rounded-lg"
                isDisabled={isImageUploading}
                type="submit"
              >
                {isImageUploading ? (
                  <Spinner size="sm" color="primary" />
                ) : (
                  'Сохранить'
                )}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </ModalContent>
    </Modal>
  )
}
