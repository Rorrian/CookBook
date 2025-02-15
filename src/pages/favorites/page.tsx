import { RecipesList } from '@modules/recipes'
import { useAuth, useFavorites } from '@shared/hooks'

export function FavoritesPage() {
  const { uid } = useAuth()
  const { favorites } = useFavorites(uid!)

  // console.log(favorites)

  return (
    <div className="flex flex-col gap-8 p-8">
      <h2 className="text-2xl font-bold text-center text-006d77">Избранное</h2>

      {!!favorites.length ? (
        <RecipesList recipes={favorites} />
      ) : (
        <p>Вы еще не добавили ни одного рецепта в избранное</p>
      )}
    </div>
  )
}
