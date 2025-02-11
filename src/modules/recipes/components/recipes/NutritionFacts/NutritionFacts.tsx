import { Macronutrients } from '@/src/types'

export const NutritionFacts = ({
  macronutrients,
}: {
  macronutrients: Macronutrients
}) => {
  const { calories, proteins, fats, carbohydrates } = macronutrients

  return (
    <div className="text-lg text-006d77">
      <p className="font-bold">Энергетическая ценность на порцию:</p>

      <div className="grid grid-cols-4 justify-items-center gap-4">
        <p>Калорийность</p>
        <p>Белки</p>
        <p>Жиры</p>
        <p>Углеводы</p>

        <p>{calories}</p>
        <p>{proteins}</p>
        <p>{fats}</p>
        <p>{carbohydrates}</p>

        <p>ккал</p>
        <p>грамм</p>
        <p>грамм</p>
        <p>грамм</p>
      </div>
    </div>
  )
}
