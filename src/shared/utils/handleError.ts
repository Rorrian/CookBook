export function handleError(error: unknown): string {
  console.error(error)

  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return (error as { message: string }).message
  }

  return 'Произошла неизвестная ошибка'
}
