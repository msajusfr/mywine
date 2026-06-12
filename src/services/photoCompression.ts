const MAX_IMAGE_SIZE = 900
const JPEG_QUALITY = 0.62
const LARGE_DATA_URL_LENGTH = 320_000

export const isLargePhoto = (photo: string) =>
  photo.startsWith('data:image/') && photo.length > LARGE_DATA_URL_LENGTH

export const readFileAsDataUrl = (file: File) =>
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

export const compressPhotoDataUrl = async (dataUrl: string) => {
  const image = await loadImage(dataUrl)
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

export const compressPhotoFile = async (file: File) => {
  const dataUrl = await readFileAsDataUrl(file)
  return compressPhotoDataUrl(dataUrl)
}
