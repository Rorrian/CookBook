import { useState } from 'react'
import {
  addToast,
  Button,
  Card,
  CardBody,
  CardFooter,
  Input,
} from '@heroui/react'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import { motion as m } from 'framer-motion'

import { authApi } from '@shared/store/api'
import { DEFAULT_PAGE_ANIMATION } from '@shared/utils/constants'
import { MailIcon } from '@shared/icons'

interface AccountRecoveryFormInputs {
  email: string
}

export const AccountRecoveryPage = () => {
  const { control, handleSubmit, reset } = useForm<AccountRecoveryFormInputs>()

  const [isRecoveryLetterSended, setIsRecoveryLetterSended] = useState(false)

  const handleReset = async (data: FieldValues) => {
    try {
      await authApi.resetPassword(data.email)

      addToast({
        title: 'Письмо для сброса пароля отправлено!',
        color: 'success',
      })
      setIsRecoveryLetterSended(true)
    } catch (error) {
      console.error(error)
      addToast({
        title: 'Не удалось восстановить доступ:',
        description: error?.toString(),
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
        Восстановление доступа
      </h2>

      <Card className="w-96 shadow-lg bg-white/70 rounded-3xl">
        {!isRecoveryLetterSended ? (
          <>
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
            </CardBody>

            <CardFooter className="flex justify-center">
              <Button
                className="w-full py-2 text-lg font-medium bg-gradient-to-r from-[#006D77] via-[#83C5BE] to-[#EDF6F9] hover:from-[#006D77] hover:via-[#83C5BE] hover:to-[#E29578]"
                color="primary"
                onClick={handleSubmit(handleReset)}
              >
                Отправить письмо
              </Button>
            </CardFooter>
          </>
        ) : (
          <p>Письмо для Восстановления пароля отправлено на вашу почту!</p>
        )}
      </Card>
    </m.div>
  )
}
