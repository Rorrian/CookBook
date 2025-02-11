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
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Не удалось войти в систему')
    }
  }

  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex flex-col bg-white rounded-3xl gap-4">
        <div className="text-2xl font-semibold text-center text-006D77">
          Войти в аккаунт
        </div>

        <div className="flex flex-col gap-4">
          <AuthForm title="Войти" handleClick={handleLogin} />

          <Spacer y={1} />

          <div className="text-center">
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
