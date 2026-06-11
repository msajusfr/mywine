import type { Wine } from '../types/wine'
import { Button } from './Button'

type WineCardProps = {
  wine: Wine
  onDelete: (id: string) => void
  onEdit: (wine: Wine) => void
}

const formatDate = (isoDate: string) =>
  new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(isoDate))

export function WineCard({ wine, onDelete, onEdit }: WineCardProps) {
  const handleDelete = () => {
    const confirmed = window.confirm('Supprimer cette fiche vin ?')

    if (confirmed) {
      onDelete(wine.id)
    }
  }

  return (
    <article className="grid grid-cols-[6.5rem_1fr] gap-4 rounded-[1.75rem] border border-rose-100/16 bg-[#f9efe8]/[0.94] p-3 text-[#291018] shadow-[0_18px_50px_rgba(0,0,0,0.24)] sm:grid-cols-[8rem_1fr] sm:p-4">
      <img
        alt="Bouteille de vin sauvegardee"
        className="h-36 w-full rounded-[1.25rem] object-cover shadow-inner sm:h-40"
        src={wine.photo}
      />

      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8f4056]">
              {formatDate(wine.createdAt)}
            </p>
            <p className="mt-2 text-3xl font-black leading-none text-[#3f0d1f]">
              {wine.rating}
              <span className="text-base font-semibold text-[#8f4056]">/10</span>
            </p>
          </div>
          {wine.updatedAt ? (
            <span className="rounded-full bg-[#3f0d1f]/8 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#6d2538]">
              modifie
            </span>
          ) : null}
        </div>

        <p className="mt-4 line-clamp-4 break-words text-sm leading-6 text-[#40222b]">
          {wine.comment || 'Sans commentaire.'}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            className="min-h-11 px-3 text-[#3f0d1f]"
            onClick={() => onEdit(wine)}
            variant="primary"
          >
            Modifier
          </Button>
          <Button
            className="min-h-11 px-3 border-[#7f1d1d]/25 bg-[#7f1d1d]/10 text-[#7f1d1d] hover:bg-[#7f1d1d]/16"
            onClick={handleDelete}
            variant="danger"
          >
            Supprimer
          </Button>
        </div>
      </div>
    </article>
  )
}
