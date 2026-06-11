import { useCallback } from 'react'
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

export function useWines() {
  const {
    value: wines,
    setValue: setWines,
    error,
  } = useLocalStorage<Wine[]>(wineStorage)

  const addWine = useCallback(
    (draft: WineDraft) => {
      const now = new Date().toISOString()
      const wine: Wine = {
        id: createId(),
        photo: draft.photo,
        rating: draft.rating,
        comment: draft.comment.trim(),
        createdAt: now,
      }

      setWines((currentWines) => sortNewestFirst([wine, ...currentWines]))
    },
    [setWines],
  )

  const updateWine = useCallback(
    (id: string, draft: WineDraft) => {
      setWines((currentWines) =>
        sortNewestFirst(
          currentWines.map((wine) =>
            wine.id === id
              ? {
                  ...wine,
                  photo: draft.photo,
                  rating: draft.rating,
                  comment: draft.comment.trim(),
                  updatedAt: new Date().toISOString(),
                }
              : wine,
          ),
        ),
      )
    },
    [setWines],
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
  }
}
