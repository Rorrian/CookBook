import { ChangePasswordForm } from '@shared/components'

export const ResetPasswordPage = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex flex-col bg-white rounded-3xl gap-4">
        <h2 className="text-2xl font-semibold text-center text-006d77">
          Сброс пароля
        </h2>

        <ChangePasswordForm onSuccessRedirect={true} />
      </div>
    </div>
  )
}
