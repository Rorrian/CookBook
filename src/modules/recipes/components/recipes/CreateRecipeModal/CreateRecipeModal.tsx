import { Controller, useForm } from 'react-hook-form'
import { useRef, useState } from 'react'
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
  SelectItem,
  Select,
  Form,
} from '@nextui-org/react'

import { NewRecipe } from '@/src/types'
import {
  useCreateRecipeMutation,
  useDeleteRecipeImageMutation,
  useGetCategoriesQuery,
  useUploadRecipeImageMutation,
} from '@shared/store/api'
import { ImageUpload } from '@shared/components'

interface CreateRecipeModalProps {
  isOpen: boolean
  onOpenChange: () => void
}

export const CreateRecipeModal = ({
  isOpen,
  onOpenChange,
}: CreateRecipeModalProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<NewRecipe>()

  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery()
  const [createRecipe] = useCreateRecipeMutation()
  const [uploadRecipeImage] = useUploadRecipeImageMutation()
  const [deleteRecipeImage] = useDeleteRecipeImageMutation()

  const imageUploadRef = useRef<{ cancel: () => Promise<void> } | null>(null)
  const [isImageUploading, setIsImageUploading] = useState(false)

  const onCreate = async (data: NewRecipe) => {
    try {
      await createRecipe(data).unwrap()
      toast.success('Рецепт успешно создан!')
      reset()
      onOpenChange()
    } catch (error) {
      console.error(error)
      toast.error(`Ошибка при создании рецепта: ${error}`)
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
                Новый рецепт
              </h3>
            </ModalHeader>

            <ModalBody className="w-full">
              <Controller
                name="title"
                control={control}
                rules={{
                  required: 'Название рецепта обязательно',
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
                    label="Название рецепта"
                    placeholder="Введите название"
                    variant="bordered"
                    onClear={() => reset({ title: '' })}
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                rules={{
                  pattern: {
                    value: /^(?!\d+$).+/,
                    message: 'Описание не может содержать только цифры',
                  },
                }}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    {...field}
                    className="w-full"
                    errorMessage={errors.description?.message}
                    isClearable
                    isInvalid={!!errors.description?.message}
                    label="Описание рецепта"
                    placeholder="Введите описание"
                    variant="bordered"
                    onClear={() => reset({ description: '' })}
                  />
                )}
              />

              {isCategoriesLoading ? (
                <Spinner size="sm" color="primary" />
              ) : (
                <Controller
                  name="category_id"
                  control={control}
                  rules={{ required: 'Выберите категорию' }}
                  render={({
                    field: { value, onChange },
                    fieldState: { error },
                  }) => (
                    <Select
                      className="w-full"
                      errorMessage={error?.message}
                      isInvalid={!!error}
                      label="Категория"
                      placeholder="Выберите категорию"
                      selectedKeys={value ? [value] : []}
                      onSelectionChange={keys =>
                        onChange([...keys][0] as string)
                      }
                    >
                      {categories?.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.title}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />
              )}

              <Controller
                name="complexity"
                control={control}
                rules={{
                  min: {
                    value: 1,
                    message: 'Сложность рецепта не может быть меньше 1',
                  },
                  max: {
                    value: 5,
                    message: 'Сложность рецепта не может быть больше 5',
                  },
                }}
                defaultValue={1}
                render={({ field }) => (
                  <Input
                    {...field}
                    className="w-full"
                    errorMessage={errors.complexity?.message}
                    isClearable
                    isInvalid={!!errors.complexity?.message}
                    label="Сложность рецепта"
                    placeholder="Введите сложность"
                    type="number"
                    variant="bordered"
                    onClear={() => reset({ complexity: '' })}
                  />
                )}
              />

              <Controller
                name="preparation_time"
                control={control}
                rules={{
                  pattern: {
                    value: /^(?!\d+$).+/,
                    message:
                      'Время приготовления не может содержать только цифры',
                  },
                }}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    {...field}
                    className="w-full"
                    errorMessage={errors.preparation_time?.message}
                    isClearable
                    isInvalid={!!errors.preparation_time?.message}
                    label="Время приготовления рецепта"
                    placeholder="Введите время приготовления рецепта"
                    variant="bordered"
                    onClear={() => reset({ preparation_time: '' })}
                  />
                )}
              />

              <Controller
                name="servings_count"
                control={control}
                rules={{
                  min: {
                    value: 1,
                    message: 'Сложность рецепта не может быть меньше 1',
                  },
                }}
                defaultValue={1}
                render={({ field }) => (
                  <Input
                    {...field}
                    className="w-full"
                    errorMessage={errors.servings_count?.message}
                    isClearable
                    isInvalid={!!errors.servings_count?.message}
                    label="Количество порций"
                    placeholder="Введите количество порций"
                    type="number"
                    variant="bordered"
                    onClear={() => reset({ servings_count: 1 })}
                  />
                )}
              />

              <div>
                <p>Энергетическая ценность на порцию:</p>
                <Controller
                  name="macronutrients.calories"
                  control={control}
                  defaultValue={0}
                  rules={{
                    min: {
                      value: 0,
                      message: 'Калорийность не может быть отрицательной',
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      {...field}
                      className="w-full"
                      isClearable
                      label="Калорийность"
                      placeholder="Введите калорийность"
                      type="number"
                      variant="bordered"
                      errorMessage={error?.message}
                      isInvalid={!!error}
                      onChange={e =>
                        field.onChange(Number(e.target.value) || 0)
                      }
                      onClear={() => field.onChange(0)}
                    />
                  )}
                />
                <Controller
                  name="macronutrients.proteins"
                  control={control}
                  rules={{
                    min: {
                      value: 0,
                      message: 'Количество белков не может быть отрицательным',
                    },
                  }}
                  defaultValue={0}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      {...field}
                      className="w-full"
                      isClearable
                      label="Количество белков"
                      placeholder="Введите количество белков"
                      type="number"
                      variant="bordered"
                      errorMessage={error?.message}
                      isInvalid={!!error}
                      onChange={e =>
                        field.onChange(Number(e.target.value) || 0)
                      }
                      onClear={() => field.onChange(0)}
                    />
                  )}
                />
                <Controller
                  name="macronutrients.fats"
                  control={control}
                  rules={{
                    min: {
                      value: 0,
                      message: 'Количество жиров не может быть отрицательным',
                    },
                  }}
                  defaultValue={0}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      {...field}
                      className="w-full"
                      isClearable
                      label="Количество жиров"
                      placeholder="Введите количество жиров"
                      type="number"
                      variant="bordered"
                      errorMessage={error?.message}
                      isInvalid={!!error}
                      onChange={e =>
                        field.onChange(Number(e.target.value) || 0)
                      }
                      onClear={() => field.onChange(0)}
                    />
                  )}
                />
                <Controller
                  name="macronutrients.carbohydrates"
                  control={control}
                  rules={{
                    min: {
                      value: 0,
                      message:
                        'Количество углеводов не может быть отрицательным',
                    },
                  }}
                  defaultValue={0}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      {...field}
                      className="w-full"
                      isClearable
                      label="Количество углеводов"
                      placeholder="Введите количество углеводов"
                      type="number"
                      variant="bordered"
                      errorMessage={error?.message}
                      isInvalid={!!error}
                      onChange={e =>
                        field.onChange(Number(e.target.value) || 0)
                      }
                      onClear={() => field.onChange(0)}
                    />
                  )}
                />
              </div>

              <ImageUpload
                ref={imageUploadRef}
                isImageUploading={isImageUploading}
                setIsImageUploading={setIsImageUploading}
                uploadHandler={uploadRecipeImage}
                deleteHandler={deleteRecipeImage}
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
