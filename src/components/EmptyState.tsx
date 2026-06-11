import { Button } from './Button'

type EmptyStateProps = {
  onAddFirst: () => void
}

export function EmptyState({ onAddFirst }: EmptyStateProps) {
  return (
    <section className="rounded-[2rem] border border-rose-100/18 bg-white/[0.07] p-6 text-center shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-rose-200/70">
        Carnet vide
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-rose-50">
        Gardez votre prochain coup de coeur sous la main.
      </h2>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-rose-50/68">
        Prenez une photo, notez la bouteille et retrouvez-la avant de repasser
        chez le caviste.
      </p>
      <Button className="mt-6 w-full sm:w-auto" onClick={onAddFirst}>
        Ajouter une premiere bouteille
      </Button>
    </section>
  )
}
