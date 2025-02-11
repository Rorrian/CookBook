import { MdEdit, MdDelete } from 'react-icons/md'
import { Button, Card, CardHeader, useDisclosure } from '@nextui-org/react'

import { Step } from '@/src/types'
import { useDeleteStepMutation } from '@shared/store/api'

import { EditStepModal } from '../EditStepModal/EditStepModal'

interface StepItemProps {
  step: Step
}

export const StepItem = ({ step }: StepItemProps) => {
  const { id, step_number, description } = step

  const [deleteStep] = useDeleteStepMutation()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  // console.log(`step ===`)
  // console.log(step)

  const onDelete = async (id: string) => {
    try {
      await deleteStep(id).unwrap()
    } catch (error) {
      console.error('Ошибка при удалении шага:', error)
    }
  }

  if (!step) return <div>No step data</div>

  return (
    <Card className="bg-white shadow-md rounded-xl border border-83c5be">
      <CardHeader className="flex justify-between items-center bg-edf6f9 p-3 rounded-t-xl">
        <p className="text-006d77 font-medium">
          {step_number}. {description}
        </p>

        <div className="flex gap-2">
          <Button
            isIconOnly
            onPress={onOpen}
            className="bg-white text-83c5be hover:text-006d77 transition"
          >
            <MdEdit size={20} />
          </Button>

          <Button
            isIconOnly
            onPress={() => onDelete(id)}
            className="bg-white text-e29578 hover:text-red-600 transition"
          >
            <MdDelete size={20} />
          </Button>
        </div>
      </CardHeader>

      {isOpen && (
        <EditStepModal
          step={step}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )}
    </Card>
  )
}
