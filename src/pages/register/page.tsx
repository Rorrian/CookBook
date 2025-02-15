import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Spacer } from '@nextui-org/react'

import { AuthForm } from '@shared/components'
import { authApi } from '@shared/store/api'
import { useAppDispatch } from '@shared/store/store'
import { login } from '@shared/store/users/users.slice'
import { RoutePaths } from '@shared/utils/navigation'
import { AuthCredentials } from '@/src/types'

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
        toast.success('Успешная регистрация!')
        navigate(RoutePaths.GETTING_STARTED)
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Не удалось зарегистрироваться')
    }
  }

  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex flex-col bg-white rounded-3xl gap-4">
        <h2 className="text-2xl font-semibold text-center text-006d77">
          Зарегистрироваться
        </h2>

        <div className="flex flex-col gap-4">
          <AuthForm
            buttonTitle="Зарегистрироваться"
            handleClick={handleRegister}
          />

          <Spacer y={1} />

          <div className="text-center">
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
      </div>
    </div>
  )
}
