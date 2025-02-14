import { memo } from 'react'

import { Recipe } from '@/src/types'

import { RecipeItem } from '../RecipeItem/RecipeItem'

interface RecipesListProps {
  recipes: Recipe[]
}

export const RecipesList = memo(({ recipes }: RecipesListProps) => {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
      {recipes.map((recipe: Recipe) => (
        <li
          key={recipe.id}
          className="w-full max-w-full min-w-[225px] h-full flex items-center overflow-hidden"
        >
          {/* <div className="w-full h-full flex flex-col justify-between">
            <RecipeItem recipe={recipe} />
          </div> */}
          <RecipeItem recipe={recipe} />
        </li>
      ))}
    </ul>
  )
})
