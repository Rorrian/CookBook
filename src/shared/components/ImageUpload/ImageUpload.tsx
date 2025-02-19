import { Image, Spinner } from '@nextui-org/react'
import clsx from 'clsx'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { toast } from 'react-toastify'

interface ImageUploadProps {
  className?: string
  initialValue?: string
  isImageUploading: boolean
  setIsImageUploading: (value: boolean) => void
  // FIXME: types
  uploadHandler: (file: File) => any
  deleteHandler: (imageUrl: string) => any
  onImageUploaded: (imageUrl: string) => void
}

const MAX_FILE_SIZE = 3
const isValidFileSize = (file: File) => file.size <= MAX_FILE_SIZE * 1024 * 1024

export const ImageUpload = forwardRef(
  (
    {
      className,
      initialValue,
      isImageUploading,
      setIsImageUploading,
      uploadHandler,
      deleteHandler,
      onImageUploaded,
    }: ImageUploadProps,
    ref: React.Ref<{
      cancel: () => Promise<void>
      deletePrevPic: () => Promise<void>
    }>,
  ) => {
    const [updatedImage, setUpdatedImage] = useState(initialValue || '')
    const [uploadedImagePath, setUploadedImagePath] = useState('')

    const extractRelativePath = (url: string) =>
      url.split('/storage/v1/object/public/images/')[1]

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      if (!isValidFileSize(file)) {
        toast.error(`Размер файла не должен превышать ${MAX_FILE_SIZE} МБ`)
        return
      }

      setIsImageUploading(true)
      try {
        const imageUrl = await uploadHandler(file)
        setUpdatedImage(imageUrl.data)
        setUploadedImagePath(extractRelativePath(imageUrl.data))

        onImageUploaded(imageUrl.data)
      } catch (error) {
        console.error(error)
        toast.error('Ошибка при загрузке изображения')
        await deleteHandler(uploadedImagePath)
      } finally {
        setIsImageUploading(false)
      }
    }

    const handleDelete = async (path: string | null) => {
      if (!path) return

      try {
        await deleteHandler(path)
      } catch (error) {
        console.error(error)
        toast.error('Ошибка при удалении изображения')
      }
    }

    const handleCancel = async () => {
      await handleDelete(uploadedImagePath)

      setUpdatedImage('')
      setUploadedImagePath('')
    }

    const handleDeletePrevPic = async () => {
      if (initialValue) {
        await handleDelete(extractRelativePath(initialValue))
      }
    }

    useImperativeHandle(ref, () => ({
      cancel: handleCancel,
      deletePrevPic: handleDeletePrevPic,
    }))

    return (
      <div className={clsx('flex flex-col gap-3', className)}>
        <label className="text-sm font-medium text-006d77">Изображение:</label>
        {/* TODO: Переделать на Input из nextui с type="file" */}
        <input
          className="w-full py-2 px-4 bg-EDF6F9 border-2 border-83c5be rounded-lg cursor-pointer transition-all duration-200 hover:bg-83c5be"
          type="file"
          onChange={handleFileChange}
        />

        <div className="flex flex-col gap-3 items-center">
          {isImageUploading && <Spinner size="sm" color="primary" />}
          {updatedImage && (
            <Image
              removeWrapper
              isBlurred
              alt="Preview"
              className="w-full h-full object-cover rounded-xl border-4 border-83c5be"
              src={updatedImage}
              height={250}
              width={200}
            />
          )}
        </div>
      </div>
    )
  },
)
