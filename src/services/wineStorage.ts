import type { Wine } from '../types/wine'

export const WINE_STORAGE_KEY = 'mywine:wines'

const isWine = (value: unknown): value is Wine => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<Wine>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.photo === 'string' &&
    typeof candidate.rating === 'number' &&
    candidate.rating >= 1 &&
    candidate.rating <= 10 &&
    typeof candidate.comment === 'string' &&
    typeof candidate.createdAt === 'string'
  )
}

const sortNewestFirst = (wines: Wine[]) =>
  [...wines].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  )

export const wineStorage = {
  read(): Wine[] {
    if (typeof window === 'undefined') {
      return []
    }

    try {
      const raw = window.localStorage.getItem(WINE_STORAGE_KEY)
      if (!raw) {
        return []
      }

      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) {
        return []
      }

      return sortNewestFirst(parsed.filter(isWine))
    } catch (error) {
      console.warn('Impossible de lire les vins sauvegardes.', error)
      return []
    }
  },

  write(wines: Wine[]) {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.setItem(
        WINE_STORAGE_KEY,
        JSON.stringify(sortNewestFirst(wines)),
      )
    } catch (error) {
      console.error('Impossible de sauvegarder les vins.', error)
      throw new Error(
        "La sauvegarde locale a echoue. La photo est peut-etre trop lourde.",
        { cause: error },
      )
    }
  },
}
