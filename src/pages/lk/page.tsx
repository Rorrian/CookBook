import { useAuth } from '@shared/hooks'

export function LKPage() {
  const { uid, email } = useAuth()

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-center text-006D77 mb-4">
        Личный кабинет
      </h2>

      <div className="flex flex-col gap-4">
        <p className="text-xl text-gray-800">
          <strong>ID:</strong> {uid}
        </p>
        <p className="text-xl text-gray-800">
          <strong>Email:</strong> {email}
        </p>
      </div>
    </div>
  )
}
