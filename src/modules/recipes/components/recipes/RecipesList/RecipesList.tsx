import { memo } from 'react'

import { Recipe } from '@/src/types'

import { RecipeItem } from '../RecipeItem/RecipeItem'

interface RecipesListProps {
  recipes: Recipe[]
}

export const RecipesList = memo(({ recipes }: RecipesListProps) => {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 justify-items-center">
      {recipes.map((recipe: Recipe) => (
        <li
          key={recipe.id}
          className="w-full max-w-xs h-full flex items-center overflow-hidden rounded-2xl m-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-md"
        >
          <RecipeItem recipe={recipe} />
        </li>
      ))}
    </ul>
  )
})
