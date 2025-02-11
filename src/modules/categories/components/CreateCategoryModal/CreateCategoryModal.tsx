import { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import {
  Input,
  Button,
  Spinner,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Form,
} from '@nextui-org/react'

import { NewCategory } from '@/src/types'
import {
  useCreateCategoryMutation,
  useDeleteCategoryImageMutation,
  useUploadCategoryImageMutation,
} from '@shared/store/api'
import { ImageUpload } from '@shared/components'

interface CreateCategoryModalProps {
  isOpen: boolean
  onOpenChange: () => void
}

export const CreateCategoryModal = ({
  isOpen,
  onOpenChange,
}: CreateCategoryModalProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<NewCategory>()

  const [createCategory] = useCreateCategoryMutation()
  const [uploadCategoryImage] = useUploadCategoryImageMutation()
  const [deleteCategoryImage] = useDeleteCategoryImageMutation()

  const imageUploadRef = useRef<{ cancel: () => Promise<void> } | null>(null)
  const [isImageUploading, setIsImageUploading] = useState(false)

  const onCreate = async (data: NewCategory) => {
    try {
      await createCategory(data).unwrap()
      toast.success('Категория успешно создана!')
      reset()
      onOpenChange()
    } catch (error) {
      console.error(error)
      toast.error(`Ошибка при создании категории: ${error}`)
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
          <Form onSubmit={handleSubmit(onCreate)}>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-2xl font-semibold text-center text-006D77 mb-4">
                Создать категорию
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
                defaultValue=""
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
                color="primary"
                className="w-full py-3 text-lg font-medium bg-gradient-to-r from-[#006D77] via-[#83C5BE] to-[#EDF6F9] hover:from-[#006D77] hover:via-[#83C5BE] hover:to-[#E29578]"
                isDisabled={isImageUploading}
                type="submit"
              >
                {isImageUploading ? (
                  <Spinner size="sm" color="primary" />
                ) : (
                  'Создать'
                )}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </ModalContent>
    </Modal>
  )
}
