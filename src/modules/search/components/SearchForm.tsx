import { Input } from '@nextui-org/react'
import { MdSearch } from 'react-icons/md'

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
        startContent={
          <MdSearch className="text-lg text-default-400 pointer-events-none flex-shrink-0" />
        }
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        onClear={() => setSearchTerm('')}
      />
    </div>
  )
}
