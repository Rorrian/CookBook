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
  Accordion,
  AccordionItem,
  useDisclosure,
  Textarea,
} from '@nextui-org/react'
import { MdAdd } from 'react-icons/md'

import { NewRecipe } from '@/src/types'
import {
  useCreateRecipeMutation,
  useDeleteRecipeImageMutation,
  useGetCategoriesQuery,
  useUploadRecipeImageMutation,
} from '@shared/store/api'
import { ImageUpload } from '@shared/components'
import { CreateCategoryModal } from '@modules/categories'
import { getComplexityLevels } from '@shared/utils/complexityLevels'

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

  const {
    isOpen: isOpenCreateCategoryModal,
    onOpen: onOpenCreateCategoryModal,
    onOpenChange: onOpenChangeCreateCategoryModal,
  } = useDisclosure()

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

  const handleNumberChange =
    (onChange: (value: number) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(Number(e.target.value) || 0)

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={handleCancel}
        size="3xl"
        backdrop="blur"
      >
        <ModalContent>
          {onClose => (
            <Form className="h-full" onSubmit={handleSubmit(onCreate)}>
              <ModalHeader className="w-full flex flex-col gap-1 pb-2">
                <h3 className="text-2xl font-semibold text-center">
                  Новый рецепт
                </h3>
              </ModalHeader>

              <ModalBody className="w-full">
                <div className="flex justify-between gap-4">
                  <div className="w-[50%] flex flex-col gap-2">
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
                          autoFocus
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
                        <Textarea
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

                    <div className="flex gap-x-2">
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
                              isRequired
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
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.title}
                                </SelectItem>
                              ))}
                            </Select>
                          )}
                        />
                      )}
                      <Button
                        isIconOnly
                        onPress={onOpenCreateCategoryModal}
                        color="primary"
                        className="h-auto bg-006d77 text-white hover:bg-83c5be transition"
                      >
                        <MdAdd />
                      </Button>
                    </div>

                    <Controller
                      name="complexity"
                      control={control}
                      rules={{ required: 'Выберите сложность' }}
                      render={({
                        field: { value, onChange },
                        fieldState: { error },
                      }) => (
                        <Select
                          className="w-full"
                          errorMessage={error?.message}
                          isInvalid={!!error}
                          label="Сложность рецепта"
                          placeholder="Выберите сложность"
                          selectedKeys={value ? new Set([value]) : new Set()}
                          onSelectionChange={keys =>
                            onChange([...keys][0] as string)
                          }
                        >
                          {getComplexityLevels().map(({ value, label }) => (
                            <SelectItem
                              key={value}
                              value={value}
                              textValue={value.toString()}
                            >
                              {label}
                            </SelectItem>
                          ))}
                        </Select>
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
                      defaultValue={0}
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
                  </div>

                  <ImageUpload
                    className="w-[50%]"
                    ref={imageUploadRef}
                    isImageUploading={isImageUploading}
                    setIsImageUploading={setIsImageUploading}
                    uploadHandler={uploadRecipeImage}
                    deleteHandler={deleteRecipeImage}
                    onImageUploaded={imageUrl =>
                      setValue('image_url', imageUrl)
                    }
                  />
                </div>

                <Accordion variant="bordered">
                  <AccordionItem
                    key="1"
                    aria-label="Энергетическая ценность на порцию:"
                    title="Энергетическая ценность на порцию:"
                  >
                    <div className="flex gap-2">
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
                            type="number"
                            variant="bordered"
                            errorMessage={error?.message}
                            isInvalid={!!error}
                            onChange={handleNumberChange(field.onChange)}
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
                            message:
                              'Количество белков не может быть отрицательным',
                          },
                        }}
                        defaultValue={0}
                        render={({ field, fieldState: { error } }) => (
                          <Input
                            {...field}
                            className="w-full"
                            isClearable
                            label="Белки"
                            type="number"
                            variant="bordered"
                            errorMessage={error?.message}
                            isInvalid={!!error}
                            onChange={handleNumberChange(field.onChange)}
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
                            message:
                              'Количество жиров не может быть отрицательным',
                          },
                        }}
                        defaultValue={0}
                        render={({ field, fieldState: { error } }) => (
                          <Input
                            {...field}
                            className="w-full"
                            isClearable
                            label="Жиры"
                            type="number"
                            variant="bordered"
                            errorMessage={error?.message}
                            isInvalid={!!error}
                            onChange={handleNumberChange(field.onChange)}
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
                            label="Углеводы"
                            type="number"
                            variant="bordered"
                            errorMessage={error?.message}
                            isInvalid={!!error}
                            onChange={handleNumberChange(field.onChange)}
                            onClear={() => field.onChange(0)}
                          />
                        )}
                      />
                    </div>
                  </AccordionItem>
                </Accordion>
              </ModalBody>

              <ModalFooter className="w-full">
                <Button color="warning" variant="light" onPress={handleCancel}>
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

      {isOpenCreateCategoryModal && (
        <CreateCategoryModal
          isOpen={isOpenCreateCategoryModal}
          onOpenChange={onOpenChangeCreateCategoryModal}
        />
      )}
    </>
  )
}
