import { Link } from 'react-router-dom'

import { useAuth } from '@shared/hooks'
import { RoutePaths, routes } from '@shared/utils/navigation'
import { PROJECT_NAME } from '@shared/utils/constants'

import { Menu } from '../../Menu/Menu'

export const Header = () => {
  const { isAuth } = useAuth()

  return (
    <header className="flex justify-between items-center gap-4 p-4 bg-006d77">
      <Link to={RoutePaths.HOME}>
        <h2 className="text-xl font-heading text-edf6f9">🍰 {PROJECT_NAME}</h2>
      </Link>

      <Menu items={routes} isAuth={isAuth} />
    </header>
  )
}
