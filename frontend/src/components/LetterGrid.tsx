import { useState } from 'react'
import { letters } from '../data/letters'
import LetterModal from './LetterModal'

function LetterGrid() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  // Temporal: en la Fase 6 vendrá del endpoint de progreso
  const completed = 15
  const total = letters.length
  const percent = total > 0 ? (completed / total) * 100 : 0

  return (
    <section className="mt-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-black dark:text-white">Abecedario</h2>
          <p className="mt-1 text-black/70 dark:text-white/70">
            Elige una letra para ver cómo se hace la seña.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <div className="mb-1.5 flex justify-between text-sm font-semibold text-black dark:text-white">
            <span>Progreso</span>
            <span>
              {completed}/{total}
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Progreso del abecedario"
            aria-valuenow={completed}
            aria-valuemin={0}
            aria-valuemax={total}
            className="h-3 w-full overflow-hidden rounded-full bg-secondary/25"
          >
            <div
              className="h-full rounded-full bg-contrast transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
        {letters.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className="flex aspect-square cursor-pointer items-center justify-center rounded-2xl border border-secondary/40 bg-white text-4xl font-extrabold text-primary shadow-lg shadow-primary/10 transition hover:-translate-y-1 hover:border-contrast hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-contrast/40 dark:bg-primary/10 dark:shadow-black/60"
          >
            {item.letter}
          </button>
        ))}
      </div>

      {selectedIndex !== null && (
        <LetterModal
          letter={letters[selectedIndex]}
          onClose={() => setSelectedIndex(null)}
          onPrev={selectedIndex > 0 ? () => setSelectedIndex(selectedIndex - 1) : undefined}
          onNext={
            selectedIndex < letters.length - 1
              ? () => setSelectedIndex(selectedIndex + 1)
              : undefined
          }
        />
      )}
    </section>
  )
}

export default LetterGrid