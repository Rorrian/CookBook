import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form'
import { Button, Input, Card, CardBody, CardFooter } from '@nextui-org/react'
import { MdOutlineMail } from 'react-icons/md'

import { AuthCredentials } from '@/src/types'
import { useState } from 'react'
import { IoMdEye, IoMdEyeOff } from 'react-icons/io'

interface AuthFormProps {
  title: string
  handleClick: (credentials: AuthCredentials) => void
}

export const AuthForm = ({ title, handleClick }: AuthFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const [showPasswords, setShowPasswords] = useState(false)
  const togglePasswordsVisibility = () => setShowPasswords(prev => !prev)

  const handleSubmitClick: SubmitHandler<FieldValues> = data => {
    const credentials: AuthCredentials = {
      email: data.email,
      password: data.password,
    }

    handleClick(credentials)
  }

  return (
    <Card className="w-96 shadow-lg bg-white rounded-3xl">
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
              startContent={
                <MdOutlineMail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
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
              fullWidth
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
          {title}
        </Button>
      </CardFooter>
    </Card>
  )
}
