import {
  Button,
  Card,
  CardBody,
  CardHeader,
  useDisclosure,
} from '@heroui/react'
import { lazy, Suspense } from 'react'

import { Step } from '@/src/types'
import { AddIcon } from '@shared/icons'

import { StepItem } from '../StepItem/StepItem'

const CreateStepModal = lazy(() => import('../CreateStepModal/CreateStepModal'))

interface StepsListProps {
  steps: Step[]
  recipe_id: string
}

export const StepsList = ({ steps, recipe_id }: StepsListProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  // console.log(`steps ===`)
  // console.log(steps)

  const sortedSteps = [...steps].sort((a, b) => a.step_number - b.step_number)
  const lastStepNumber = steps?.length
    ? Math.max(...steps.map(step => step.step_number)) + 1
    : 1

  // TODO: Изменение порядка шагов: 2 на 3 и обратно
  // Что-то типа "CREATE OR REPLACE FUNCTION swap_steps(recipe_uuid UUID, step1 INT, step2 INT)
  // RETURNS VOID AS $$
  // BEGIN
  //   -- Используем временный step_number, чтобы избежать конфликта
  //   UPDATE steps SET step_number = -1 WHERE recipe_id = recipe_uuid AND step_number = step1;
  //   UPDATE steps SET step_number = step1 WHERE recipe_id = recipe_uuid AND step_number = step2;
  //   UPDATE steps SET step_number = step2 WHERE recipe_id = recipe_uuid AND step_number = -1;
  // END;
  // $$ LANGUAGE plpgsql;
  // "
  //
  // SELECT swap_steps('A1', 2, 3);
  // TODO: Изменение порядка шагов их перетаскиванием

  return (
    <Card className="bg-edf6f9/70 shadow-lg rounded-2xl p-4">
      <CardHeader className="flex justify-between items-center border-b border-83c5be pb-2">
        <h3 className="text-006d77 font-bold text-xl uppercase">
          Приготовление:
        </h3>

        <Button
          onPress={onOpen}
          color="primary"
          className="bg-006d77 text-white hover:bg-83c5be transition"
          startContent={<AddIcon width={20} />}
        >
          Добавить
        </Button>
      </CardHeader>

      <CardBody>
        {sortedSteps.length ? (
          <ul className="flex flex-col gap-2 mt-4 text-xl">
            {sortedSteps.map((step: Step) => (
              <li
                key={step.id}
                // className="p-3 border border-83c5be rounded-md shadow-md bg-white"
              >
                <StepItem step={step} />
              </li>
            ))}
          </ul>
        ) : (
          <p>Шагов для отображения нет</p>
        )}
      </CardBody>

      {isOpen && (
        <Suspense fallback={<div>Загрузка модалки...</div>}>
          <CreateStepModal
            lastStepNumber={lastStepNumber}
            recipe_id={recipe_id}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
          />
        </Suspense>
      )}
    </Card>
  )
}
