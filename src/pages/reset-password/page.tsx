import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Card, CardBody, CardFooter, Input } from '@nextui-org/react'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import { IoMdEyeOff, IoMdEye } from 'react-icons/io'
import { useState } from 'react'

import { authApi } from '@shared/store/api'
import { RoutePaths } from '@shared/utils/navigation'

interface ResetPasswordFormInputs {
  password: string
  passwordConfirmation: string
}

const MIN_PASSWORD_LENGTH = 6

export const ResetPasswordPage = () => {
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormInputs>()
  const password = watch('password')

  const [showPasswords, setShowPasswords] = useState(false)
  const togglePasswordsVisibility = () => setShowPasswords(prev => !prev)

  const handleUpdatePassword = async (data: FieldValues) => {
    try {
      await authApi.updatePassword(data.password)

      toast.success('Пароль успешно обновлен!')
      setTimeout(() => navigate(RoutePaths.LOGIN), 3000)
    } catch (error) {
      console.error(error)
      toast.error('Не удалось восстановить доступ')
    }
  }

  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex flex-col bg-white rounded-3xl gap-4">
        <h2 className="text-2xl font-semibold text-center text-006d77">
          Сброс пароля
        </h2>

        <Card className="w-96 shadow-lg bg-white rounded-3xl">
          <CardBody className="flex flex-col gap-4">
            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Пароль обязателен',
                minLength: {
                  value: MIN_PASSWORD_LENGTH,
                  message: `Пароль должен содержать минимум ${MIN_PASSWORD_LENGTH} символов`,
                },
              }}
              defaultValue=""
              render={({ field }) => (
                <Input
                  {...field}
                  autoFocus
                  isRequired
                  className="w-full"
                  fullWidth
                  endContent={
                    <button
                      aria-label="toggle password visibility"
                      className="focus:outline-none"
                      onClick={togglePasswordsVisibility}
                    >
                      {showPasswords ? (
                        <IoMdEyeOff className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <IoMdEye className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  errorMessage={errors.password?.message}
                  isInvalid={!!errors.password?.message}
                  label="Пароль"
                  placeholder="Введите новый пароль"
                  type={showPasswords ? 'text' : 'password'}
                  variant="bordered"
                />
              )}
            />
            <Controller
              name="passwordConfirmation"
              control={control}
              rules={{
                required: 'Пароль обязателен',
                validate: (value: string) =>
                  value === password || 'Пароли не совпадают!',
              }}
              defaultValue=""
              render={({ field }) => (
                <Input
                  {...field}
                  isRequired
                  className="w-full"
                  fullWidth
                  errorMessage={errors.passwordConfirmation?.message}
                  isInvalid={!!errors.passwordConfirmation?.message}
                  label="Подтверждение пароля"
                  placeholder="Введите новый пароль повторно"
                  type={showPasswords ? 'text' : 'password'}
                  variant="bordered"
                />
              )}
            />
          </CardBody>

          <CardFooter className="flex justify-center">
            <Button
              className="w-full py-2 text-lg font-medium bg-gradient-to-r from-[#006D77] via-[#83C5BE] to-[#EDF6F9] hover:from-[#006D77] hover:via-[#83C5BE] hover:to-[#E29578]"
              color="primary"
              onClick={handleSubmit(handleUpdatePassword)}
            >
              Обновить пароль
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
