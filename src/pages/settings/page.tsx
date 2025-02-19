import { Accordion, AccordionItem } from '@nextui-org/react'
import { FaUserCircle } from 'react-icons/fa'
import { motion as m } from 'framer-motion'

import { useAuth } from '@shared/hooks'
import { ChangePasswordForm } from '@shared/components'
import { DEFAULT_PAGE_ANIMATION } from '@shared/utils/constants'

export function SettingsPage() {
  const { uid, email } = useAuth()

  return (
    <m.div className="flex flex-col gap-8 p-4" {...DEFAULT_PAGE_ANIMATION}>
      <h2 className="text-3xl font-bold text-center font-heading uppercase text-gray-700">
        Настройки
      </h2>

      <Accordion className="text-2xl bg-white/50" variant="bordered">
        <AccordionItem
          className="text-2xl"
          key="1"
          aria-label="Данные профиля"
          title="Данные профиля"
          HeadingComponent={'h3'}
          startContent={<FaUserCircle />}
        >
          <div className="text-lg mb-4">
            <h4 className="font-semibold mb-4">
              Данные текущего пользователя:
            </h4>

            <div className="flex flex-col gap-2">
              <p className="text-gray-800">ID: {uid}</p>
              <p className="text-gray-800">Email: {email}</p>
            </div>
          </div>

          <h4 className="text-lg font-semibold mb-4">Изменение пароля</h4>
          <ChangePasswordForm isOldPasswordCheckRequired />
        </AccordionItem>
      </Accordion>
    </m.div>
  )
}
