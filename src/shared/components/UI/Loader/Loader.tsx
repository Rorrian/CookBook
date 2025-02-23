import { Spinner } from '@heroui/react'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | undefined
  color?:
    | 'primary'
    | 'current'
    | 'white'
    | 'default'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | undefined
}

export const Loader = ({ size = 'lg', color = 'primary' }: LoaderProps) => (
  <div className="flex flex-1 justify-center items-center h-screen p-8">
    <Spinner size={size} color={color} />
  </div>
)
