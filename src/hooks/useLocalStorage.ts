import { useCallback, useState } from 'react'

type StorageAdapter<T> = {
  read: () => T
  write: (value: T) => void
}

export function useLocalStorage<T>(adapter: StorageAdapter<T>) {
  const [value, setValue] = useState<T>(() => adapter.read())
  const [error, setError] = useState<string | null>(null)

  const saveValue = useCallback(
    (nextValue: T | ((currentValue: T) => T)) => {
      setValue((currentValue) => {
        const resolvedValue =
          typeof nextValue === 'function'
            ? (nextValue as (currentValue: T) => T)(currentValue)
            : nextValue

        try {
          adapter.write(resolvedValue)
          setError(null)
          return resolvedValue
        } catch (storageError) {
          setError(
            storageError instanceof Error
              ? storageError.message
              : 'La sauvegarde locale a echoue.',
          )
          return currentValue
        }
      })
    },
    [adapter],
  )

  return { value, setValue: saveValue, error }
}
