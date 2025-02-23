import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { Image } from '@heroui/react'

import { useAuth } from '@shared/hooks'
import { RoutePaths, routes } from '@shared/utils/navigation'
import { PROJECT_NAME } from '@shared/utils/constants'

import { Menu } from '../../Menu/Menu'

interface HeaderProps {
  className?: string
}

export const Header = ({ className }: HeaderProps) => {
  const { isAuth } = useAuth()

  return (
    <header
      className={clsx('flex justify-between items-center gap-2 p-2', className)}
    >
      <Link to={RoutePaths.HOME} className="inline-block">
        <div className="flex items-end gap-2 bg-[#edf6f9] rounded-xl py-2 px-4">
          <Image
            alt="Логотип проекта"
            className="w-8"
            removeWrapper
            src="/logo_opt.webp"
          />
          <span className="text-[#333] text-xl font-heading">
            {PROJECT_NAME}
          </span>
        </div>
      </Link>

      <Menu items={routes} isAuth={isAuth} />
    </header>
  )
}
