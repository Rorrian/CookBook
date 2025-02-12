import { Button, Select, SelectItem } from '@nextui-org/react'
import { MdCancel } from 'react-icons/md'

import { useGetCategoriesQuery } from '@shared/store/api'
import { Loader } from '@shared/components'
import { getComplexityLevels } from '@shared/utils/complexityLevels'

import { Filters } from '../hooks/useFilters'

interface FiltersFormProps {
  filters: Filters
  updateFilter: (key: keyof Filters, value: string) => void
  resetFilters: () => void
}

export const FiltersForm = ({
  filters,
  updateFilter,
  resetFilters,
}: FiltersFormProps) => {
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useGetCategoriesQuery()

  if (isCategoriesLoading) return <Loader />
  if (isCategoriesError) return <div>Ошибка загрузки данных</div>

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Фильтры</h3>

      <div className="flex gap-x-3">
        <Select
          label="Категория"
          placeholder="Выберите категорию"
          selectedKeys={
            filters.category ? new Set([filters.category]) : new Set()
          }
          onSelectionChange={keys => {
            const selectedKey = [...keys][0] || ''
            updateFilter('category', selectedKey)
          }}
        >
          {categories?.map(category => (
            <SelectItem key={category.id} value={category.id}>
              {category.title}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Сложность"
          placeholder="Выберите сложность"
          selectedKeys={
            filters.complexity ? new Set([filters.complexity]) : new Set()
          }
          onSelectionChange={keys => {
            const selectedKey = Array.from(keys)[0] || ''
            updateFilter('complexity', selectedKey)
          }}
        >
          {getComplexityLevels().map(({ value, label }) => (
            <SelectItem key={value} value={value} textValue={value.toString()}>
              {label}
            </SelectItem>
          ))}
        </Select>

        <Button
          className="h-auto bg-edf6f9 text-e29578 hover:text-red-600 transition-all"
          isIconOnly
          onPress={resetFilters}
        >
          <MdCancel />
        </Button>
      </div>
    </div>
  )
}
