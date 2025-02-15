import { Controller, FieldValues, useForm } from 'react-hook-form'
import { Button, Input, Card, CardBody, CardFooter } from '@nextui-org/react'
import { IoMdEye, IoMdEyeOff } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'

import { authApi } from '@shared/store/api'
import { RoutePaths } from '@shared/utils/navigation'
import { updateSession, usePasswordVisibility } from '@shared/hooks'

const MIN_PASSWORD_LENGTH = 6

interface ChangePasswordFormInputs {
  password: string
  passwordConfirmation: string
}

interface ChangePasswordFormProps {
  onSuccessRedirect?: boolean
}

export const ChangePasswordForm = ({
  onSuccessRedirect,
}: ChangePasswordFormProps) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ChangePasswordFormInputs>()
  const password = watch('password')

  const { showPasswords, togglePasswordVisibility } = usePasswordVisibility()

  const handleUpdatePassword = async (data: FieldValues) => {
    try {
      await authApi.updatePassword(data.password)

      toast.success('Пароль успешно обновлен!')
      if (onSuccessRedirect) {
        setTimeout(() => navigate(RoutePaths.LOGIN), 3000)
      } else {
        reset()
        updateSession(dispatch)
      }
    } catch (error) {
      console.error(error)
      toast.error('Не удалось восстановить доступ')
    }
  }

  return (
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
                  onClick={togglePasswordVisibility}
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
  )
}
