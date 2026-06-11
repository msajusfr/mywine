import { useId, useState } from 'react'
import type { Wine, WineDraft } from '../types/wine'
import { Button } from './Button'
import { PhotoInput } from './PhotoInput'
import { RatingInput } from './RatingInput'

type WineFormProps = {
  editingWine?: Wine | null
  onCancelEdit?: () => void
  onSubmit: (draft: WineDraft) => void
}

type FormErrors = {
  photo?: string
  rating?: string
}

const emptyDraft: WineDraft = {
  photo: '',
  rating: 0,
  comment: '',
}

const draftFromWine = (wine?: Wine | null): WineDraft =>
  wine
    ? {
        photo: wine.photo,
        rating: wine.rating,
        comment: wine.comment,
      }
    : emptyDraft

export function WineForm({
  editingWine,
  onCancelEdit,
  onSubmit,
}: WineFormProps) {
  const commentId = useId()
  const [draft, setDraft] = useState<WineDraft>(() => draftFromWine(editingWine))
  const [errors, setErrors] = useState<FormErrors>({})

  const validate = () => {
    const nextErrors: FormErrors = {}

    if (!draft.photo) {
      nextErrors.photo = 'La photo est obligatoire.'
    }

    if (!draft.rating || draft.rating < 1 || draft.rating > 10) {
      nextErrors.rating = 'Choisissez une note entre 1 et 10.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    onSubmit(draft)

    if (!editingWine) {
      setDraft(emptyDraft)
    }
  }

  return (
    <form
      className="rounded-[2rem] border border-rose-100/18 bg-[#2a0b17]/78 p-4 shadow-[0_28px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-6"
      onSubmit={handleSubmit}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-rose-200/70">
            {editingWine ? 'Modification' : 'Nouvelle bouteille'}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-rose-50">
            {editingWine ? 'Ajuster la fiche' : 'Ajouter un vin'}
          </h2>
        </div>
        {editingWine ? (
          <Button onClick={onCancelEdit} variant="ghost">
            Annuler
          </Button>
        ) : null}
      </div>

      <div className="space-y-6">
        <PhotoInput
          error={errors.photo}
          onChange={(photo) => setDraft((current) => ({ ...current, photo }))}
          value={draft.photo}
        />

        <RatingInput
          error={errors.rating}
          onChange={(rating) =>
            setDraft((current) => ({ ...current, rating }))
          }
          value={draft.rating}
        />

        <div>
          <label
            className="mb-3 block text-sm font-semibold text-rose-50"
            htmlFor={commentId}
          >
            Commentaire
          </label>
          <textarea
            className="min-h-28 w-full resize-y rounded-3xl border border-rose-100/18 bg-white/[0.07] px-4 py-4 text-base text-rose-50 outline-none transition placeholder:text-rose-100/38 focus:border-rose-100/60 focus:bg-white/[0.1] focus:ring-4 focus:ring-rose-100/10"
            id={commentId}
            maxLength={500}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                comment: event.target.value,
              }))
            }
            placeholder="Coup de coeur, plat associe, nom du caviste..."
            value={draft.comment}
          />
          <p className="mt-2 text-xs text-rose-100/48">
            Optionnel, mais pratique pour reconnaitre la bouteille.
          </p>
        </div>

        <Button className="w-full" type="submit">
          {editingWine ? 'Enregistrer les changements' : 'Sauvegarder ce vin'}
        </Button>
      </div>
    </form>
  )
}
