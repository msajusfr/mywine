import { useId, useState } from 'react'

type PhotoInputProps = {
  value: string
  error?: string
  onChange: (photo: string) => void
}

const MAX_IMAGE_SIZE = 1200
const JPEG_QUALITY = 0.72

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(String(reader.result)))
    reader.addEventListener('error', () =>
      reject(new Error('Lecture de la photo impossible.')),
    )
    reader.readAsDataURL(file)
  })

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image), { once: true })
    image.addEventListener(
      'error',
      () => reject(new Error("La photo n'a pas pu etre preparee.")),
      { once: true },
    )
    image.src = src
  })

const resizePhoto = async (file: File) => {
  const originalDataUrl = await readFileAsDataUrl(file)
  const image = await loadImage(originalDataUrl)
  const longestSide = Math.max(image.naturalWidth, image.naturalHeight)
  const scale = Math.min(1, MAX_IMAGE_SIZE / longestSide)
  const width = Math.max(1, Math.round(image.naturalWidth * scale))
  const height = Math.max(1, Math.round(image.naturalHeight * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error("La photo n'a pas pu etre preparee.")
  }

  context.drawImage(image, 0, 0, width, height)
  return canvas.toDataURL('image/jpeg', JPEG_QUALITY)
}

export function PhotoInput({ value, error, onChange }: PhotoInputProps) {
  const inputId = useId()
  const [fileError, setFileError] = useState<string | null>(null)
  const [isPreparing, setIsPreparing] = useState(false)

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    setFileError(null)

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setFileError('Choisissez une image de bouteille.')
      return
    }

    setIsPreparing(true)

    try {
      const dataUrl = await resizePhoto(file)
      onChange(dataUrl)
    } catch (readError) {
      setFileError(
        readError instanceof Error
          ? readError.message
          : 'Lecture de la photo impossible.',
      )
    } finally {
      setIsPreparing(false)
    }
  }

  return (
    <div>
      <label
        className="mb-3 block text-sm font-semibold text-rose-50"
        htmlFor={inputId}
      >
        Photo de la bouteille
      </label>
      <label
        className="group grid min-h-64 cursor-pointer place-items-center overflow-hidden rounded-[1.75rem] border border-dashed border-rose-100/35 bg-[#220913]/70 text-center shadow-inner transition duration-200 hover:border-rose-100/70 focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-rose-100"
        htmlFor={inputId}
      >
        {isPreparing ? (
          <span className="max-w-56 px-6 text-sm font-medium leading-6 text-rose-50/72">
            Preparation de la photo...
          </span>
        ) : value ? (
          <img
            alt="Apercu de la bouteille"
            className="h-full max-h-[22rem] w-full object-cover"
            src={value}
          />
        ) : (
          <span className="max-w-56 px-6 text-sm font-medium leading-6 text-rose-50/72">
            Touchez pour prendre ou importer une photo
          </span>
        )}
        <input
          accept="image/*"
          capture="environment"
          className="sr-only"
          id={inputId}
          onChange={handleFileChange}
          type="file"
        />
      </label>
      {fileError || error ? (
        <p className="mt-2 text-sm text-rose-200">{fileError ?? error}</p>
      ) : null}
    </div>
  )
}
