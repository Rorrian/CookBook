import { lazy, Suspense, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
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
  addToast,
} from '@heroui/react'

import { Recipe, UpdatedRecipe } from '@/src/types'
import {
  useDeleteRecipeImageMutation,
  useEditRecipeMutation,
  useGetCategoriesQuery,
  useUploadRecipeImageMutation,
} from '@shared/store/api'
import { ImageUpload } from '@shared/components'
import { getComplexityLevels } from '@shared/utils/complexityLevels'
import { AddIcon } from '@shared/icons'

const CreateCategoryModal = lazy(() =>
  import('@modules/categories/lazy').then(module => ({
    default: module.CreateCategoryModal,
  })),
)

interface EditRecipeModalProps {
  recipe: Recipe
  isOpen: boolean
  onOpenChange: () => void
}

const EditRecipeModal = ({
  recipe,
  isOpen,
  onOpenChange,
}: EditRecipeModalProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<Recipe>()

  const {
    id,
    title,
    description,
    category_id,
    image_url,
    complexity,
    preparation_time,
    servings_count,
    macronutrients,
  } = recipe

  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery()
  const [editRecipe] = useEditRecipeMutation()
  const [uploadRecipeImage] = useUploadRecipeImageMutation()
  const [deleteRecipeImage] = useDeleteRecipeImageMutation()

  const {
    isOpen: isOpenCreateCategoryModal,
    onOpen: onOpenCreateCategoryModal,
    onOpenChange: onOpenChangeCreateCategoryModal,
  } = useDisclosure()

  const imageUploadRef = useRef<{
    cancel: () => Promise<void>
    deletePrevPic: () => Promise<void>
  } | null>(null)
  const [isImageUploading, setIsImageUploading] = useState(false)

  const onUpdate = async (data: UpdatedRecipe) => {
    try {
      const updatedRecipe: UpdatedRecipe = { ...data, id }
      await editRecipe(updatedRecipe).unwrap()

      addToast({
        title: 'Рецепт успешно обновлен!',
        color: 'success',
      })

      imageUploadRef.current?.deletePrevPic()
      reset()
      onOpenChange()
    } catch (error) {
      console.error(error)
      addToast({
        title: 'Ошибка при обновлении рецепта:',
        description: error?.toString(),
        color: 'danger',
        timeout: 5000,
      })
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
        backdrop="blur"
        size="3xl"
      >
        <ModalContent>
          {() => (
            <Form className="h-full" onSubmit={handleSubmit(onUpdate)}>
              <ModalHeader className="w-full flex flex-col gap-1 pb-2">
                <h3 className="text-2xl font-semibold text-center">
                  Изменение рецепта
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
                      defaultValue={title}
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
                      defaultValue={description}
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
                          defaultValue={category_id}
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
                              {(categories || []).map(category => (
                                <SelectItem
                                  key={category.id}
                                  textValue={category.title}
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
                        <AddIcon width={20} />
                      </Button>
                    </div>

                    <Controller
                      name="complexity"
                      control={control}
                      rules={{ required: 'Выберите сложность' }}
                      defaultValue={complexity ?? 1}
                      render={({
                        field: { value, onChange },
                        fieldState: { error },
                      }) => (
                        <Select
                          isRequired
                          className="w-full"
                          errorMessage={error?.message}
                          isInvalid={!!error}
                          label="Сложность рецепта"
                          placeholder="Выберите сложность"
                          selectedKeys={
                            value ? new Set([value.toString()]) : new Set()
                          }
                          onSelectionChange={keys => {
                            const selectedValue = [...keys][0]
                            onChange(
                              selectedValue ? Number(selectedValue) : undefined,
                            )
                          }}
                          renderValue={items => {
                            if (!items.length) return 'Выберите сложность'

                            const selectedItem = items[0]
                            const selectedValue = selectedItem.key

                            const level = getComplexityLevels().find(
                              item => item.value === selectedValue,
                            )

                            return level ? (
                              <span>{level.label}</span>
                            ) : (
                              <span>
                                {selectedValue?.toString() ??
                                  'Неизвестное значение'}
                              </span>
                            )
                          }}
                        >
                          {getComplexityLevels().map(({ value, label }) => (
                            <SelectItem
                              key={value}
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
                      defaultValue={preparation_time}
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
                      defaultValue={servings_count}
                      render={({ field }) => (
                        <Input
                          {...field}
                          className="w-full"
                          errorMessage={errors.servings_count?.message}
                          isClearable
                          isInvalid={!!errors.servings_count?.message}
                          label="Количество порций"
                          placeholder="Введите количество порций"
                          type="text"
                          value={field.value ? field.value.toString() : ''}
                          onChange={e => field.onChange(Number(e.target.value))}
                          variant="bordered"
                          onClear={() => reset({ servings_count: 1 })}
                        />
                      )}
                    />
                  </div>

                  <ImageUpload
                    className="w-[50%]"
                    ref={imageUploadRef}
                    initialValue={image_url}
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
                        defaultValue={macronutrients?.calories || 0}
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
                            type="text"
                            value={field.value ? field.value.toString() : ''}
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
                        defaultValue={macronutrients?.proteins || 0}
                        render={({ field, fieldState: { error } }) => (
                          <Input
                            {...field}
                            className="w-full"
                            isClearable
                            label="Белки"
                            type="text"
                            value={field.value ? field.value.toString() : ''}
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
                        defaultValue={macronutrients?.fats || 0}
                        render={({ field, fieldState: { error } }) => (
                          <Input
                            {...field}
                            className="w-full"
                            isClearable
                            label="Жиры"
                            type="text"
                            value={field.value ? field.value.toString() : ''}
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
                        defaultValue={macronutrients?.carbohydrates || 0}
                        render={({ field, fieldState: { error } }) => (
                          <Input
                            {...field}
                            className="w-full"
                            isClearable
                            label="Углеводы"
                            type="text"
                            value={field.value ? field.value.toString() : ''}
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
                    'Сохранить'
                  )}
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>

      {isOpenCreateCategoryModal && (
        <Suspense fallback={<div>Загрузка модалки...</div>}>
          <CreateCategoryModal
            isOpen={isOpenCreateCategoryModal}
            onOpenChange={onOpenChangeCreateCategoryModal}
          />
        </Suspense>
      )}
    </>
  )
}

export default EditRecipeModal
