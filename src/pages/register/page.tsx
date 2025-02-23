import { Link, useNavigate } from 'react-router-dom'
import { addToast, Spacer } from '@heroui/react'
import { motion as m } from 'framer-motion'

import { AuthForm } from '@shared/components'
import { authApi } from '@shared/store/api'
import { useAppDispatch } from '@shared/store/store'
import { login } from '@shared/store/users/users.slice'
import { RoutePaths } from '@shared/utils/navigation'
import { AuthCredentials } from '@/src/types'
import { DEFAULT_PAGE_ANIMATION } from '@shared/utils/constants'

export function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleRegister = async ({ email, password }: AuthCredentials) => {
    try {
      const { user, session } = await authApi.signUp({ email, password })

      if (user && session) {
        dispatch(
          login({
            uid: user.id,
            email: user.email,
            token: session.access_token,
          }),
        )
        addToast({
          title: 'Успешная регистрация!',
          color: 'success',
        })
        navigate(RoutePaths.GETTING_STARTED)
      }
    } catch (error) {
      console.error(error)

      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      addToast({
        title: 'Не удалось зарегистрироваться:',
        description: errorMessage,
        color: 'danger',
        timeout: 5000,
      })
    }
  }

  return (
    <m.div
      className="absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] flex flex-col items-center gap-4"
      {...DEFAULT_PAGE_ANIMATION}
    >
      <h2 className="text-3xl font-bold text-center font-heading uppercase text-gray-700">
        Зарегистрироваться
      </h2>

      <div className="flex flex-col gap-4">
        <AuthForm
          buttonTitle="Зарегистрироваться"
          handleClick={handleRegister}
        />

        <Spacer y={1} />

        <div className="text-center text-lg">
          <div>
            Уже есть аккаунт?{' '}
            <Link
              to={RoutePaths.LOGIN}
              className="text-primary-500 hover:text-primary-600"
            >
              Войти
            </Link>
          </div>
        </div>
      </div>
    </m.div>
  )
}
