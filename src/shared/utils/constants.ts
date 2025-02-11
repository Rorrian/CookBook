export const BASE_URL =
  process.env.NODE_ENV === 'production' ? 'none' : 'http://localhost:3001'

export const PROJECT_NAME = 'CookBook'

export const APP_INFO = {
  name: `${PROJECT_NAME} App`,
  version: '1.0.0',
}

export const FOOTER_LINKS = [
  { title: 'GitHub', href: 'https://github.com/Rorrian/CookBook' },
  { title: 'Telegram', href: 'https://t.me/RorrianR' },
  { title: 'LinkedIn', href: 'https://www.linkedin.com/in/rorrian/' },
]
