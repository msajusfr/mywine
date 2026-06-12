import { useEffect, useRef, useState } from 'react'
import { Button } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { WineCard } from '../components/WineCard'
import { WineForm } from '../components/WineForm'
import { useWines } from '../hooks/useWines'
import type { Wine, WineDraft } from '../types/wine'

export function HomePage() {
  const { wines, storageError, addWine, updateWine, deleteWine, compactPhotos } =
    useWines()
  const [editingWine, setEditingWine] = useState<Wine | null>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    void compactPhotos()
  }, [compactPhotos])

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSubmit = (draft: WineDraft) => {
    if (editingWine) {
      updateWine(editingWine.id, draft)
      setEditingWine(null)
      return
    }

    addWine(draft)
  }

  const handleEdit = (wine: Wine) => {
    setEditingWine(wine)
    window.requestAnimationFrame(scrollToForm)
  }

  return (
    <>
      <header className="flex flex-col gap-5 pb-6 pt-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-rose-200/72">
            MyWine
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-black leading-[1.02] text-[#fff7f0] sm:text-6xl">
            Les bouteilles a reprendre, sans les oublier.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-rose-50/70">
            Photo, note, commentaire. Votre carnet reste sur cet appareil et
            revient intact apres rechargement.
          </p>
        </div>
        <Button className="sm:min-w-44" onClick={scrollToForm}>
          Ajouter un vin
        </Button>
      </header>

      {storageError ? (
        <div
          className="mb-5 rounded-3xl border border-rose-200/30 bg-rose-950/70 px-4 py-3 text-sm text-rose-100"
          role="alert"
        >
          {storageError}
        </div>
      ) : null}

      <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(22rem,0.92fr)_minmax(0,1.08fr)] lg:items-start">
        <div ref={formRef}>
          <WineForm
            editingWine={editingWine}
            key={editingWine?.id ?? 'new-wine'}
            onCancelEdit={() => setEditingWine(null)}
            onSubmit={handleSubmit}
          />
        </div>

        <section aria-labelledby="wine-list-title" className="min-w-0">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-rose-200/70">
                Cave a reprendre
              </p>
              <h2
                className="mt-2 text-2xl font-semibold text-rose-50"
                id="wine-list-title"
              >
                {wines.length > 0
                  ? `${wines.length} vin${wines.length > 1 ? 's' : ''}`
                  : 'Aucune fiche'}
              </h2>
            </div>
          </div>

          {wines.length > 0 ? (
            <div className="grid gap-4">
              {wines.map((wine) => (
                <WineCard
                  key={wine.id}
                  onDelete={deleteWine}
                  onEdit={handleEdit}
                  wine={wine}
                />
              ))}
            </div>
          ) : (
            <EmptyState onAddFirst={scrollToForm} />
          )}
        </section>
      </div>
    </>
  )
}
