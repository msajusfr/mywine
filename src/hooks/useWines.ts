import { useCallback } from 'react'
import { compressPhotoDataUrl, isLargePhoto } from '../services/photoCompression'
import { wineStorage } from '../services/wineStorage'
import type { Wine, WineDraft } from '../types/wine'
import { useLocalStorage } from './useLocalStorage'

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const sortNewestFirst = (wines: Wine[]) =>
  [...wines].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  )

const compactWinePhotos = async (wines: Wine[]) =>
  Promise.all(
    wines.map(async (wine) => {
      if (!isLargePhoto(wine.photo)) {
        return wine
      }

      try {
        return {
          ...wine,
          photo: await compressPhotoDataUrl(wine.photo),
          updatedAt: wine.updatedAt ?? new Date().toISOString(),
        }
      } catch {
        return wine
      }
    }),
  )

export function useWines() {
  const {
    value: wines,
    setValue: setWines,
    error,
  } = useLocalStorage<Wine[]>(wineStorage)

  const addWine = useCallback(
    async (draft: WineDraft) => {
      const now = new Date().toISOString()
      const wine: Wine = {
        id: createId(),
        photo: draft.photo,
        rating: draft.rating,
        comment: draft.comment.trim(),
        createdAt: now,
      }

      const compactedWines = await compactWinePhotos(wines)
      setWines(sortNewestFirst([wine, ...compactedWines]))
    },
    [setWines, wines],
  )

  const updateWine = useCallback(
    async (id: string, draft: WineDraft) => {
      const nextWines = wines.map((wine) =>
        wine.id === id
          ? {
              ...wine,
              photo: draft.photo,
              rating: draft.rating,
              comment: draft.comment.trim(),
              updatedAt: new Date().toISOString(),
            }
          : wine,
      )

      setWines(sortNewestFirst(await compactWinePhotos(nextWines)))
    },
    [setWines, wines],
  )

  const compactPhotos = useCallback(
    async () => {
      if (!wines.some((wine) => isLargePhoto(wine.photo))) {
        return
      }

      const compactedWines = await compactWinePhotos(wines)
      const hasSmallerPhoto = compactedWines.some(
        (wine, index) => wine.photo.length < wines[index].photo.length,
      )

      if (hasSmallerPhoto) {
        setWines(sortNewestFirst(compactedWines))
      }
    },
    [setWines, wines],
  )

  const deleteWine = useCallback(
    (id: string) => {
      setWines((currentWines) => currentWines.filter((wine) => wine.id !== id))
    },
    [setWines],
  )

  return {
    wines,
    storageError: error,
    addWine,
    updateWine,
    deleteWine,
    compactPhotos,
  }
}
