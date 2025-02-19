import { motion as m } from 'framer-motion'

import { ChangePasswordForm } from '@shared/components'
import { DEFAULT_PAGE_ANIMATION } from '@shared/utils/constants'

export const ResetPasswordPage = () => {
  return (
    <m.div
      className="absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] flex flex-col items-center gap-4"
      {...DEFAULT_PAGE_ANIMATION}
    >
      <h2 className="text-3xl font-bold text-center font-heading uppercase text-gray-700">
        Сброс пароля
      </h2>

      <ChangePasswordForm className="w-96" onSuccessRedirect={true} />
    </m.div>
  )
}
