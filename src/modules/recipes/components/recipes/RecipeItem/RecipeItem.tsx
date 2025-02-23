import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, Image } from '@heroui/react'

import { Recipe } from '@/src/types'
import { useFavorites } from '@shared/hooks'
import { HeartFillIcon, HeartBlankIcon } from '@shared/icons'

interface RecipeItemProps {
  recipe: Recipe
}

export const RecipeItem = ({ recipe }: RecipeItemProps) => {
  const { id, title, description, image_url, user_id } = recipe

  const { toggleFavorite, isInFavorites } = useFavorites(user_id)
  const isFavorite = isInFavorites(id)

  const handleFavoriteClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void => {
    e.preventDefault()
    toggleFavorite(id)
  }

  if (!recipe) return <div>No recipe data</div>

  return (
    <Card className="w-full h-full flex flex-col gap-2 p-2 rounded-2xl bg-white/70 border border-gray-200">
      <Link to={`/recipe/${id}`} className="flex flex-col h-full">
        <CardHeader className="flex justify-between items-center gap-2 p-2">
          <h3 className="text-2xl font-semibold text-006d77 truncate">
            {title}
          </h3>

          <Button
            aria-label="Toggle favorite"
            isIconOnly
            variant="light"
            color="danger"
            size="sm"
            onClick={handleFavoriteClick}
          >
            {isFavorite ? (
              <HeartFillIcon width={24} />
            ) : (
              <HeartBlankIcon width={24} />
            )}
          </Button>
        </CardHeader>

        <CardBody className="flex flex-col gap-2 p-2 justify-between">
          {description && (
            <div className="text-lg">
              <p className="font-bold">Описание:</p>
              <p className="truncate">{description}</p>
            </div>
          )}

          {image_url && (
            <Image
              isBlurred
              removeWrapper
              alt="Recipe Image"
              className="w-full max-w-72 h-48 object-cover rounded-xl border-3 border-83C5BE shadow-md"
              src={image_url}
              loading="lazy"
            />
          )}
        </CardBody>
      </Link>
    </Card>
  )
}
