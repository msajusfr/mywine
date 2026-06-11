type RatingInputProps = {
  value: number
  error?: string
  onChange: (rating: number) => void
}

export function RatingInput({ value, error, onChange }: RatingInputProps) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-rose-50">
        Note de reprise
      </legend>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
        {Array.from({ length: 10 }, (_, index) => {
          const rating = index + 1
          const selected = rating === value

          return (
            <button
              aria-pressed={selected}
              className={`aspect-square rounded-2xl border text-base font-bold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-100 ${
                selected
                  ? 'border-rose-100 bg-rose-100 text-[#3f0d1f] shadow-[0_10px_28px_rgba(248,185,205,0.22)]'
                  : 'border-rose-100/18 bg-white/[0.06] text-rose-50 hover:border-rose-100/45 hover:bg-white/[0.12]'
              }`}
              key={rating}
              onClick={() => onChange(rating)}
              type="button"
            >
              {rating}
            </button>
          )
        })}
      </div>
      {error ? <p className="mt-2 text-sm text-rose-200">{error}</p> : null}
    </fieldset>
  )
}
