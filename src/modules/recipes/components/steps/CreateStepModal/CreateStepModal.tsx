import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import {
  Input,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Form,
} from '@nextui-org/react'

import { useCreateStepMutation } from '@shared/store/api'
import { NewStep } from '@/src/types'

interface CreateStepModalProps {
  lastStepNumber: number
  recipe_id: string
  isOpen: boolean
  onOpenChange: () => void
}

export const CreateStepModal = ({
  lastStepNumber,
  recipe_id,
  isOpen,
  onOpenChange,
}: CreateStepModalProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewStep>()

  const [createStep] = useCreateStepMutation()

  // const [newStepNumber, setNewStepNumber] = useState(lastStepNumber)

  const onCreate = async (data: NewStep) => {
    try {
      const newStep: NewStep = { ...data, recipe_id }

      await createStep(newStep).unwrap()
      toast.success('Шаг успешно создан!')
      reset()
      onOpenChange()
    } catch (error) {
      console.error(error)

      if (error.data.code === '23505') {
        toast.error('Шаг с таким номером уже существует!')
      } else {
        toast.error(`Ошибка при обновлении шага: ${error}`)
      }
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {onClose => (
          <Form onSubmit={handleSubmit(onCreate)}>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-2xl font-semibold text-center text-006D77 mb-4">
                Создать шаг
              </h3>
            </ModalHeader>

            <ModalBody className="w-full">
              <Controller
                name="step_number"
                control={control}
                rules={{
                  required: 'Номер шага обязателен',
                  min: {
                    value: 1,
                    message: 'Номер шага должен быть больше 0',
                  },
                }}
                defaultValue={lastStepNumber}
                render={({ field }) => (
                  <Input
                    {...field}
                    isRequired
                    className="w-full"
                    errorMessage={errors.step_number?.message}
                    isClearable
                    isInvalid={!!errors.step_number?.message}
                    label="Номер шага"
                    placeholder="Введите новый номер шага"
                    type="number"
                    variant="bordered"
                    onClear={() => reset({ step_number: 1 })}
                  />
                )}
              />
              <Controller
                name="description"
                control={control}
                rules={{
                  required: 'Описание шага обязательно',
                  pattern: {
                    value: /^(?!\d+$).+/,
                    message: 'Описание шага не может содержать только цифры',
                  },
                }}
                defaultValue={''}
                render={({ field }) => (
                  <Input
                    {...field}
                    isRequired
                    className="w-full"
                    errorMessage={errors.description?.message}
                    isClearable
                    isInvalid={!!errors.description?.message}
                    label="Описание шага"
                    placeholder="Введите описание шага"
                    variant="bordered"
                    onClear={() => reset({ description: '' })}
                  />
                )}
              />
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
