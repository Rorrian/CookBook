import { useCallback, useState } from 'react'

export const usePasswordVisibility = () => {
  const [showPasswords, setShowPasswords] = useState(false)

  const togglePasswordVisibility = useCallback(() => {
    setShowPasswords(prev => !prev)
  }, [])

  return { showPasswords, togglePasswordVisibility }
}
