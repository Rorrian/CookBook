import { Image, Spinner } from '@nextui-org/react'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { toast } from 'react-toastify'

interface ImageUploadProps {
  initialValue?: string
  isImageUploading: boolean
  setIsImageUploading: (value: boolean) => void
  // FIXME: types
  uploadHandler: (file: File) => Promise<string>
  deleteHandler: (imageUrl: string) => Promise<void>
  onImageUploaded: (imageUrl: string) => void
}

const MAX_FILE_SIZE = 3
const isValidFileSize = (file: File) => file.size <= MAX_FILE_SIZE * 1024 * 1024

export const ImageUpload = forwardRef(
  (
    {
      initialValue,
      isImageUploading,
      setIsImageUploading,
      uploadHandler,
      deleteHandler,
      onImageUploaded,
    }: ImageUploadProps,
    ref: React.Ref<{ cancel: () => Promise<void> }>,
  ) => {
    const [updatedImage, setUpdatedImage] = useState(initialValue || '')
    const [uploadedImagePath, setUploadedImagePath] = useState('')

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files[0]

        if (!isValidFileSize(file)) {
          toast.error('Размер файла не должен превышать 1 МБ')
          return
        }

        try {
          setIsImageUploading(true)
          const imageUrl = await uploadHandler(file).unwrap()
          setUpdatedImage(imageUrl)

          const relativePath = imageUrl.split(
            '/storage/v1/object/public/images/',
          )[1]
          setUploadedImagePath(relativePath)

          onImageUploaded(imageUrl)
        } catch (error) {
          console.error(error)
          toast.error('Ошибка при загрузке изображения')
          await deleteHandler(uploadedImagePath)
        } finally {
          setIsImageUploading(false)
        }
      }
    }

    useImperativeHandle(ref, () => ({
      cancel: handleCancel,
    }))

    const handleCancel = async () => {
      console.log(`handleCancel`)

      if (uploadedImagePath) {
        console.log(`uploadedImagePath ===`)
        console.log(uploadedImagePath)
        try {
          await deleteHandler(uploadedImagePath).unwrap()
          toast.info('Загруженное изображение удалено')
        } catch (error) {
          console.error(error)
          toast.error('Ошибка при удалении загруженного изображения')
        }
      }

      setUpdatedImage('')
      setUploadedImagePath('')
    }

    return (
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-006d77">Изображение:</label>
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
