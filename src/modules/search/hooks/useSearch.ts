import { useEffect, useState } from 'react'
import debounce from 'lodash.debounce'

export const useSearch = (initValue: string) => {
  const [searchTerm, setSearchTerm] = useState(initValue)

  const debouncedCallback = debounce(
    (value: string) => setSearchTerm(value),
    300,
  )

  useEffect(() => {
    if (searchTerm) {
      debouncedCallback(searchTerm)
    }

    return () => {
      debouncedCallback.cancel()
    }
  }, [searchTerm])

  return { searchTerm, setSearchTerm }
}
