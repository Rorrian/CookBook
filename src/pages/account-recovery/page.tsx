import { toast } from 'react-toastify'
import { useState } from 'react'
import { Button, Card, CardBody, CardFooter, Input } from '@nextui-org/react'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import { MdOutlineMail } from 'react-icons/md'

import { authApi } from '@shared/store/api'

interface AccountRecoveryFormInputs {
  email: string
}

export const AccountRecoveryPage = () => {
  const { control, handleSubmit, reset } = useForm<AccountRecoveryFormInputs>()

  const [isRecoveryLetterSended, setIsRecoveryLetterSended] = useState(false)

  const handleReset = async (data: FieldValues) => {
    try {
      await authApi.resetPassword(data.email)

      toast.success('Письмо для сброса пароля отправлено!')
      setIsRecoveryLetterSended(true)
    } catch (error) {
      console.error(error)
      toast.error('Не удалось восстановить доступ')
    }
  }

  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex flex-col bg-white rounded-3xl gap-4">
        <h2 className="text-2xl font-semibold text-center text-006d77">
          Восстановление доступа
        </h2>

        <Card className="p-4 w-96 shadow-lg bg-white rounded-3xl">
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
                      errorMessage={({
                        validationDetails,
                        validationErrors,
                      }) => {
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
      </div>
    </div>
  )
}
