import { memo } from 'react'

import { Recipe } from '@/src/types'

import { RecipeItem } from '../RecipeItem/RecipeItem'

interface RecipesListProps {
  recipes: Recipe[]
}

export const RecipesList = memo(({ recipes }: RecipesListProps) => {
  return (
    <ul className="flex flex-wrap gap-8 justify-center">
      {recipes.map((recipe: Recipe) => (
        <li
          key={recipe.id}
          className="w-[300px] min-h-[300px] flex justify-center"
        >
          <RecipeItem recipe={recipe} />
        </li>
      ))}
    </ul>
  )
})
