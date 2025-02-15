import { Accordion, AccordionItem } from '@nextui-org/react'
import { FaUserCircle } from 'react-icons/fa'

import { useAuth } from '@shared/hooks'
import { ChangePasswordForm } from '@shared/components'

export function SettingsPage() {
  const { uid, email } = useAuth()

  return (
    <div className="p-6 bg-white">
      <h2 className="text-2xl font-semibold text-center mb-4">Настройки</h2>

      <Accordion variant="bordered">
        <AccordionItem
          key="1"
          aria-label="Данные профиля"
          title="Данные профиля"
          startContent={<FaUserCircle />}
        >
          <h3 className="text-xl font-semibold mb-4">
            Данные текущего пользователя:
          </h3>

          <div className="flex flex-col gap-4">
            <p className="text-xl text-gray-800">ID: {uid}</p>
            <p className="text-xl text-gray-800">Email: {email}</p>
          </div>
          <br />

          <h3 className="text-xl font-semibold mb-4">Изменение пароля</h3>
          {/* TODO: добавить поле "Старый пароль" на форму на странице Настройки */}
          <ChangePasswordForm />
        </AccordionItem>
      </Accordion>
    </div>
  )
}
