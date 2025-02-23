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

export const LoginPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogin = async ({ email, password }: AuthCredentials) => {
    try {
      const { user, session } = await authApi.signIn({ email, password })

      if (user && session) {
        dispatch(
          login({
            uid: user.id,
            email: user.email,
            token: session.access_token,
          }),
        )
        addToast({
          title: 'Успешный вход!',
          color: 'success',
        })
        navigate(RoutePaths.HOME)
      }
    } catch (error) {
      console.error(error)

      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      addToast({
        title: 'Не удалось войти в систему:',
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
        Войти в аккаунт
      </h2>

      <AuthForm buttonTitle="Войти" handleClick={handleLogin} />

      <Spacer y={1} />

      <div className="text-center text-lg">
        <div>
          Забыли пароль?{' '}
          <Link
            to={RoutePaths.ACCOUNT_RECOVERY}
            className="text-primary-500 hover:text-primary-600"
          >
            Восстановить доступ к аккаунту
          </Link>
        </div>

        <Spacer y={4} />

        <div>
          Нет аккаунта?{' '}
          <Link
            to={RoutePaths.REGISTER}
            className="text-primary-500 hover:text-primary-600"
          >
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </m.div>
  )
}
