import { Link } from 'react-router-dom'

import { APP_INFO, FOOTER_LINKS } from '@shared/utils/constants'
import { RoutePaths } from '@shared/utils/navigation'

export const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-004b54">
      <p className="text-sm text-edf6f9">
        🍽️ {APP_INFO.name} | v{APP_INFO.version}
      </p>

      <nav className="flex gap-4">
        <Link
          to={RoutePaths.GETTING_STARTED}
          className="p-2 text-edf6f9 hover:text-83c5be transition-colors duration-200"
        >
          О проекте
        </Link>

        {FOOTER_LINKS.map(link => (
          <a
            key={link.title}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-edf6f9 hover:text-83c5be transition-colors duration-200"
          >
            {link.title}
          </a>
        ))}
      </nav>

      <p className="text-xs text-edf6f9">
        Сделано с ❤️ на React + Redux + NextUI
      </p>
    </footer>
  )
}
