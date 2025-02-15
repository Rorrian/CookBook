import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Spacer } from '@nextui-org/react'

import { AuthForm } from '@shared/components'
import { authApi } from '@shared/store/api'
import { useAppDispatch } from '@shared/store/store'
import { login } from '@shared/store/users/users.slice'
import { RoutePaths } from '@shared/utils/navigation'
import { AuthCredentials } from '@/src/types'

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
        toast.success('Успешный вход!')
        navigate(RoutePaths.HOME)
      }
    } catch (error) {
      console.error(error)

      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      toast.error(`Не удалось войти в систему: ${errorMessage}`)
    }
  }

  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex flex-col bg-white rounded-3xl gap-4">
        <h2 className="text-2xl font-semibold text-center text-006d77">
          Войти в аккаунт
        </h2>

        <div className="flex flex-col gap-4">
          <AuthForm buttonTitle="Войти" handleClick={handleLogin} />

          <Spacer y={1} />

          <div className="text-center">
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
                Зарегистрируйтесь
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
