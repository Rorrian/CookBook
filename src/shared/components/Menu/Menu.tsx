import { Link, useLocation } from 'react-router-dom'
import clsx from 'clsx'

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

    if (item.isHideInHeaderMenu) return false

    if (isAuth) {
      return !item.onlyForUnauth
    }

    return item.onlyForUnauth || !item.isAuth
  })
}

const colors = [
  '#FFC107',
  '#673AB7',
  '#4CAF50',
  '#2196F3',
  '#E91E63',
  '#FF9800',
]
const getColor = (index: number) => colors[index % colors.length]

export const Menu = ({
  direction = Direction.ROW,
  isAuth = false,
  items,
}: MenuProps) => {
  const dispatch = useAppDispatch()
  const location = useLocation()

  const filteredItems = filterMenuItems(items, isAuth)

  return (
    <ul
      className={clsx(
        'flex items-center gap-4 list-none',
        direction === Direction.COLUMN ? 'flex-col' : 'flex-row',
      )}
    >
      {filteredItems.map((item: MenuItem, index: number) => {
        const activeItem = location.pathname === item.path
        const bgColor = getColor(index)

        return (
          <li
            key={item.path}
            className={clsx(
              'transition-transform duration-300 transform will-change-transform text-white',
              activeItem
                ? '-translate-x-1 -translate-y-1 shadow-lg text-black'
                : 'hover:-translate-x-1 hover:-translate-y-1 hover:shadow-lg',
            )}
          >
            <Link
              to={item.path}
              className={`
							p-2 rounded-t-md rounded-br-md shadow-md
							border border-gray-300 
							font-bold whitespace-nowrap z-10
						`}
              style={{
                clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)',
                backgroundColor: bgColor,
              }}
            >
              {item.title}
            </Link>
          </li>
        )
      })}

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
