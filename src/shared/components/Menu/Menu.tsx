import { Link } from 'react-router-dom'

import { useAppDispatch } from '@shared/store/store'
import { logout } from '@shared/store/users/users.slice'
import { IRoute, RoutePaths } from '@shared/utils/navigation'

export enum Direction {
  ROW = 'row',
  COLUMN = 'column',
}

interface MenuItem extends Omit<IRoute, 'element'> {}

interface MenuProps {
  direction?: Direction
  isAuth: boolean
  items: MenuItem[]
}

const filterMenuItems = (items: MenuItem[], isAuth: boolean): MenuItem[] => {
  return items.filter(item => {
    if (item.path === RoutePaths.RECIPE) return false

    if (isAuth) {
      return !item.onlyForUnauth
    }

    return item.onlyForUnauth || !item.isAuth
  })
}

export const Menu = ({
  direction = Direction.ROW,
  isAuth = false,
  items,
}: MenuProps) => {
  const dispatch = useAppDispatch()

  const filteredItems = filterMenuItems(items, isAuth)

  return (
    <ul
      className={`flex ${direction === Direction.COLUMN ? 'flex-col' : 'flex-row'} items-center gap-4 list-none`}
    >
      {filteredItems.map((item: MenuItem) => (
        <li key={item.path}>
          <Link
            to={item.path}
            className="p-2 text-edf6f9 hover:text-83c5be transition-colors duration-200"
          >
            {item.title}
          </Link>
        </li>
      ))}

      {isAuth && (
        <button
          onClick={() => dispatch(logout())}
          className="p-2 text-edf6f9 hover:text-83c5be transition-colors duration-200"
        >
          Выйти
        </button>
      )}
    </ul>
  )
}
