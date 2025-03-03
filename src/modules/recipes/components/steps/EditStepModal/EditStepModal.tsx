import { Controller, useForm } from 'react-hook-form'
import {
  Input,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Form,
  addToast,
} from '@heroui/react'

import { Step, SupabaseResponseError } from '@/src/types'
import { useEditStepMutation } from '@shared/store/api'

interface EditStepModalProps {
  step: Step
  isOpen: boolean
  onOpenChange: () => void
}

const EditStepModal = ({ step, isOpen, onOpenChange }: EditStepModalProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Step>()

  const { id, step_number, description, recipe_id } = step

  const [editStep] = useEditStepMutation()

  const onUpdate = async (data: Step) => {
    try {
      const updatedStep: Step = { ...data, id, recipe_id }
      await editStep(updatedStep).unwrap()
      reset()
      onOpenChange()
    } catch (error) {
      console.error(error)

      const supabaseError = error as SupabaseResponseError
      if (supabaseError?.data?.code === '23505') {
        addToast({
          title: 'Шаг с таким номером уже существует!',
          color: 'danger',
          timeout: 5000,
        })
      } else {
        addToast({
          title: 'Ошибка при обновлении шага:',
          description: error?.toString(),
          color: 'danger',
          timeout: 5000,
        })
      }
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {onClose => (
          <Form onSubmit={handleSubmit(onUpdate)}>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-2xl font-semibold text-center mb-4">
                Изменить шаг
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
                defaultValue={step_number}
                render={({ field }) => (
                  <Input
                    {...field}
                    autoFocus
                    isRequired
                    className="w-full"
                    errorMessage={errors.step_number?.message}
                    isClearable
                    isInvalid={!!errors.step_number?.message}
                    label="Номер шага"
                    placeholder="Введите новый номер шага"
                    variant="bordered"
                    // Особенности компонента Input из nextui
                    // type="number"
                    type="text"
                    value={field.value ? field.value.toString() : ''}
                    onChange={e => field.onChange(Number(e.target.value))}
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
                defaultValue={description}
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

export default EditStepModal
