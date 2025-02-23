import { Input } from '@heroui/react'

import { SearchIcon } from '@shared/icons'

interface SearchFormProps {
  placeholder?: string
  searchTerm: string
  setSearchTerm: (value: string) => void
}

export const SearchForm = ({
  placeholder = 'Поиск...',
  searchTerm,
  setSearchTerm,
}: SearchFormProps) => {
  return (
    <div className="flex justify-center border border-gray-500 rounded-xl">
      <Input
        isClearable
        className="w-full"
        placeholder={placeholder}
        startContent={<SearchIcon width={20} />}
        type="search"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        onClear={() => setSearchTerm('')}
      />
    </div>
  )
}
