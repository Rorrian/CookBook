import { Link } from 'react-router-dom'
import { MdFavorite } from 'react-icons/md'
import { MdFavoriteBorder } from 'react-icons/md'
import { Button, Card, CardBody, CardHeader, Image } from '@nextui-org/react'

import { Recipe } from '@/src/types'
import { useFavorites } from '@shared/hooks'

interface RecipeItemProps {
  recipe: Recipe
}

export const RecipeItem = ({ recipe }: RecipeItemProps) => {
  const { id, title, description, category_title, image_url } = recipe

  const { toggleFavorite, isInFavorites } = useFavorites()

  // console.log(`recipe ===`)
  // console.log(recipe)

  const handleFavoriteClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void => {
    e.preventDefault()
    toggleFavorite(recipe)
  }

  if (!recipe) return <div>No recipe data</div>

  return (
    <Card className="w-full flex flex-col gap-4 p-4 rounded-2xl shadow-lg bg-white border border-gray-200 hover:shadow-xl transition-all duration-300">
      <Link to={`/recipe/${id}`} className="flex flex-col gap-2 h-full">
        <CardHeader className="flex justify-between items-center gap-2">
          <h3 className="text-xl font-semibold text-006D77">{title}</h3>

          <Button
            aria-label="Toggle favorite"
            isIconOnly
            variant="light"
            color="danger"
            onClick={handleFavoriteClick}
          >
            {isInFavorites(id) ? (
              <MdFavorite size={24} />
            ) : (
              <MdFavoriteBorder size={24} />
            )}
          </Button>
        </CardHeader>

        <CardBody className="flex flex-col gap-5">
          {description && (
            <div className="text-sm">
              <p className="font-medium">Описание:</p>
              {description}
            </div>
          )}

          <div className="text-sm">
            <p className="font-medium">Категория:</p>
            {category_title}
          </div>
        </CardBody>

        {image_url && (
          <Image
            isBlurred
            alt="Recipe Image"
            className="w-full h-48 object-cover rounded-xl border-4 border-83C5BE shadow-md"
            src={image_url}
            loading="lazy"
          />
        )}
      </Link>
    </Card>
  )
}
