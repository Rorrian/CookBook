import { Input } from '@nextui-org/react'
import { MdSearch } from 'react-icons/md'

interface SearchFormProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
}

export const SearchForm = ({ searchTerm, setSearchTerm }: SearchFormProps) => {
  return (
    <div className="flex justify-center">
      <Input
        isClearable
        className="w-full md:w-96"
        placeholder="Поиск рецептов..."
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
