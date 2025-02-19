import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@heroui/react'

import { Macronutrients } from '@/src/types'
import { Accordion, AccordionItem } from '@nextui-org/react'

export const NutritionFacts = ({
  macronutrients,
}: {
  macronutrients: Macronutrients
}) => {
  const { calories, proteins, fats, carbohydrates } = macronutrients

  return (
    <Accordion variant="bordered">
      <AccordionItem
        key="1"
        aria-label="Энергетическая ценность на порцию:"
        title="Энергетическая ценность на порцию:"
      >
        <div className="text-lg text-006d77">
          <p className="font-bold">Энергетическая ценность на порцию:</p>

          <Table removeWrapper aria-label="Энергетическая ценность">
            <TableHeader>
              <TableColumn>Калорийность</TableColumn>
              <TableColumn>Белки</TableColumn>
              <TableColumn>Жиры</TableColumn>
              <TableColumn>Углеводы</TableColumn>
            </TableHeader>

            <TableBody>
              <TableRow>
                <TableCell>{calories}</TableCell>
                <TableCell>{proteins}</TableCell>
                <TableCell>{fats}</TableCell>
                <TableCell>{carbohydrates}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>ккал</TableCell>
                <TableCell>грамм</TableCell>
                <TableCell>грамм</TableCell>
                <TableCell>грамм</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </AccordionItem>
    </Accordion>
  )
}
