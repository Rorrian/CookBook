import { RecipesList } from '@modules/recipes'
import { useFavorites } from '@shared/hooks'

export function FavoritesPage() {
  const { favorites } = useFavorites()
  // console.log(favorites)

  if (!favorites.length) return <div>No favorites</div>

  return (
    <div className="flex flex-col gap-8 p-8">
      <h2 className="text-2xl font-bold text-center text-006d77">Favorites</h2>

      <RecipesList recipes={favorites} />
    </div>
  )
}
