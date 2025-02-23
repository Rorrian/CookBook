import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form'
import { Button, Input, Card, CardBody, CardFooter } from '@heroui/react'
import { MailIcon, EyeIcon, EyeCloseIcon } from '@shared/icons'

import { AuthCredentials } from '@/src/types'
import { usePasswordVisibility } from '@shared/hooks'

interface AuthFormProps {
  buttonTitle: string
  handleClick: (credentials: AuthCredentials) => void
}

export const AuthForm = ({ buttonTitle, handleClick }: AuthFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const { showPasswords, togglePasswordVisibility } = usePasswordVisibility()

  const handleSubmitClick: SubmitHandler<FieldValues> = data => {
    const credentials: AuthCredentials = {
      email: data.email,
      password: data.password,
    }

    handleClick(credentials)
  }

  return (
    <Card className="w-96 shadow-lg bg-white/70 rounded-3xl">
      <CardBody className="flex flex-col gap-4">
        <Controller
          name="email"
          control={control}
          defaultValue={''}
          render={({ field }) => (
            <Input
              {...field}
              autoFocus
              isRequired
              className="w-full"
              isClearable
              fullWidth
              size="lg"
              errorMessage={({ validationDetails, validationErrors }) => {
                if (validationDetails.typeMismatch) {
                  return 'Введите корректный email'
                }

                return validationErrors
              }}
              label="Email"
              placeholder="Введите ваш email"
              type="email"
              variant="bordered"
              startContent={<MailIcon width={28} height={28} />}
              onClear={() => reset({ email: '' })}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={{ required: 'Пароль обязателен' }}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...field}
              isRequired
              className="w-full"
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
              errorMessage={errors.password?.message?.toString()}
              isInvalid={!!errors.password?.message}
              fullWidth
              size="lg"
              label="Пароль"
              placeholder="Введите ваш пароль"
              type={showPasswords ? 'text' : 'password'}
              variant="bordered"
            />
          )}
        />
      </CardBody>

      <CardFooter className="flex justify-center">
        <Button
          autoFocus
          className="w-full py-2 text-lg font-medium bg-gradient-to-r from-[#006D77] via-[#83C5BE] to-[#EDF6F9] hover:from-[#006D77] hover:via-[#83C5BE] hover:to-[#E29578]"
          color="primary"
          onClick={handleSubmit(handleSubmitClick)}
        >
          {buttonTitle}
        </Button>
      </CardFooter>
    </Card>
  )
}
