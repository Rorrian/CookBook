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
  Select,
  SelectItem,
  Form,
} from '@nextui-org/react'

import { Ingredient } from '@/src/types'
import { useEditIngredientMutation, useGetUnitsQuery } from '@shared/store/api'

interface EditIngredientProps {
  ingredient: Ingredient
  isOpen: boolean
  onOpenChange: () => void
}

export const EditIngredientModal = ({
  ingredient,
  isOpen,
  onOpenChange,
}: EditIngredientProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Ingredient>()

  const { id, name, quantity, unit_id, recipe_id } = ingredient

  const { data: units, isLoading: isUnitsLoading } = useGetUnitsQuery()
  const [editIngredient] = useEditIngredientMutation()

  const onUpdate = async (data: Ingredient) => {
    try {
      const updatedIngredient: Ingredient = { ...data, id, recipe_id }
      await editIngredient(updatedIngredient).unwrap()
      toast.success('Ингредиент успешно обновлен!')
      reset()
      onOpenChange()
    } catch (error) {
      console.error(error)
      toast.error(`Ошибка при обновлении ингредиента: ${error}`)
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {onClose => (
          <Form onSubmit={handleSubmit(onUpdate)}>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-2xl font-semibold text-center mb-4">
                Изменить ингредиент
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
                defaultValue={name}
                render={({ field }) => (
                  <Input
                    {...field}
                    autoFocus
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
                defaultValue={quantity}
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
                  defaultValue={unit_id}
                  render={({
                    field: { value, onChange },
                    fieldState: { error },
                  }) => (
                    <Select
                      isRequired
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
              <Button color="warning" variant="light" onPress={onClose}>
                Отменить
              </Button>

              <Button
                color="primary"
                className="w-full py-3 text-lg font-medium bg-gradient-to-r from-[#006D77] via-[#83C5BE] to-[#EDF6F9] hover:from-[#006D77] hover:via-[#83C5BE] hover:to-[#E29578]"
                type="submit"
              >
                Сохранить
              </Button>
            </ModalFooter>
          </Form>
        )}
      </ModalContent>
    </Modal>
  )
}
