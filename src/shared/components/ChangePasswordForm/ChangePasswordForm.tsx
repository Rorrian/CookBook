import { Controller, FieldValues, useForm } from 'react-hook-form'
import {
  Button,
  Input,
  Card,
  CardBody,
  CardFooter,
  addToast,
} from '@heroui/react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import clsx from 'clsx'

import { authApi } from '@shared/store/api'
import { RoutePaths } from '@shared/utils/navigation'
import { updateSession, useAuth, usePasswordVisibility } from '@shared/hooks'
import { EyeIcon, EyeCloseIcon } from '@shared/icons'

const MIN_PASSWORD_LENGTH = 6

interface ChangePasswordFormInputs {
  currentPassword?: string
  password: string
  passwordConfirmation: string
}

interface ChangePasswordFormProps {
  className?: string
  isOldPasswordCheckRequired?: boolean
  onSuccessRedirect?: boolean
}

export const ChangePasswordForm = ({
  className,
  isOldPasswordCheckRequired,
  onSuccessRedirect,
}: ChangePasswordFormProps) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { email } = useAuth()
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
      if (isOldPasswordCheckRequired) {
        const { user, session } = await authApi.signIn(
          {
            email: email!,
            password: data.currentPassword,
          },
          true,
        )

        if (user && session) {
          await authApi.updatePassword(data.password)
        }
      } else {
        await authApi.updatePassword(data.password)
      }

      addToast({
        title: 'Пароль успешно обновлен!',
        color: 'success',
      })
      if (onSuccessRedirect) {
        setTimeout(() => navigate(RoutePaths.LOGIN), 3000)
      } else {
        reset()
        updateSession(dispatch)
      }
    } catch (error) {
      console.error(error)
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      addToast({
        title: 'Не удалось восстановить доступ:',
        description: errorMessage,
        color: 'danger',
        timeout: 5000,
      })
    }
  }

  return (
    <Card className={clsx('shadow-lg bg-white rounded-3xl', className)}>
      <CardBody className="flex flex-col gap-4">
        {isOldPasswordCheckRequired && (
          <Controller
            name="currentPassword"
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
                size={isOldPasswordCheckRequired ? 'md' : 'lg'}
                errorMessage={errors.currentPassword?.message}
                isInvalid={!!errors.currentPassword?.message}
                label="Текущий пароль"
                placeholder="Введите текущий пароль"
                type="text"
                variant="bordered"
              />
            )}
          />
        )}

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
                    <EyeCloseIcon width={22} height={22} />
                  ) : (
                    <EyeIcon width={22} height={22} />
                  )}
                </button>
              }
              size={isOldPasswordCheckRequired ? 'md' : 'lg'}
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
