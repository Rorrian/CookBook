import { useState } from 'react'
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
  Select,
  SelectItem,
  Form,
} from '@nextui-org/react'

import {
  useCreateIngredientMutation,
  useGetUnitsQuery,
} from '@shared/store/api'
import { NewIngredient } from '@/src/types'
import { Controller, useForm } from 'react-hook-form'

interface CreateIngredientModalProps {
  recipe_id: string
  isOpen: boolean
  onOpenChange: () => void
}

export const CreateIngredientModal = ({
  recipe_id,
  isOpen,
  onOpenChange,
}: CreateIngredientModalProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewIngredient>()

  const { data: units, isLoading: isUnitsLoading } = useGetUnitsQuery()
  const [createIngredient] = useCreateIngredientMutation()

  const onCreate = async (data: NewIngredient) => {
    try {
      const newIngredient: NewIngredient = { ...data, recipe_id }
      await createIngredient(newIngredient).unwrap()
      reset()
      onOpenChange()
    } catch (error) {
      console.error(error)
      toast.error(`Ошибка при создании ингредиента: ${error}`)
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {onClose => (
          <Form onSubmit={handleSubmit(onCreate)}>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-2xl font-semibold text-center text-006D77 mb-4">
                Создать ингредиент
              </h3>
            </ModalHeader>

            <ModalBody className="w-full">
              <Controller
                name="name"
                control={control}
                rules={{
                  required: 'Название ингредиента обязательно',
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
                    errorMessage={errors.name?.message}
                    isClearable
                    isInvalid={!!errors.name?.message}
                    label="Название"
                    placeholder="Введите название"
                    variant="bordered"
                    onClear={() => reset({ name: '' })}
                  />
                )}
              />
              <Controller
                name="quantity"
                control={control}
                rules={{
                  required: 'Количество обязательно',
                  min: {
                    value: 1,
                    message: 'Количество должно быть больше 0',
                  },
                }}
                defaultValue={0}
                render={({ field }) => (
                  <Input
                    {...field}
                    isRequired
                    className="w-full"
                    errorMessage={errors.quantity?.message}
                    isClearable
                    isInvalid={!!errors.quantity?.message}
                    label="Количество"
                    placeholder="Введите количество"
                    type="number"
                    variant="bordered"
                    onClear={() => reset({ quantity: 0 })}
                  />
                )}
              />
              {isUnitsLoading ? (
                <Spinner size="sm" color="primary" />
              ) : (
                <Controller
                  name="unit_id"
                  control={control}
                  rules={{ required: 'Выберите единицу измерения' }}
                  render={({
                    field: { value, onChange },
                    fieldState: { error },
                  }) => (
                    <Select
                      className="w-full"
                      errorMessage={error?.message}
                      isInvalid={!!error}
                      label="Единица измерения"
                      placeholder="Выберите единицу"
                      selectedKeys={value ? [value] : []}
                      onSelectionChange={keys =>
                        onChange([...keys][0] as string)
                      }
                    >
                      {units?.map(unit => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />
              )}
            </ModalBody>

            <ModalFooter className="w-full">
              <Button color="danger" variant="light" onPress={onClose}>
                Отменить
              </Button>

              <Button
                color="primary"
                className="w-full py-3 text-lg font-medium bg-gradient-to-r from-[#006D77] via-[#83C5BE] to-[#EDF6F9] hover:from-[#006D77] hover:via-[#83C5BE] hover:to-[#E29578]"
                type="submit"
              >
                Создать
              </Button>
            </ModalFooter>
          </Form>
        )}
      </ModalContent>
    </Modal>
  )
}
