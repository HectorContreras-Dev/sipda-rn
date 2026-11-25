import { useState } from 'react'
import { letters } from '../data/letters'
import LetterModal from './LetterModal'
import { useProgress } from '../hooks/useProgress'

function LetterGrid() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const progress = useProgress()
  // Set: permite preguntar rápido si una letra está completada (completedIds.has(id))
  const completedIds = new Set(progress?.completed_letter_ids ?? [])
  const completed = completedIds.size
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
        {letters.map((item, index) => {
          const isCompleted = completedIds.has(item.id)
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              // La palomita no se lee en voz alta: el lector de pantalla dice "Letra A, completada"
              aria-label={`Letra ${item.letter}${isCompleted ? ', completada' : ''}`}
              className={`relative flex aspect-square cursor-pointer items-center justify-center rounded-2xl bg-white text-4xl font-extrabold text-primary shadow-lg shadow-primary/10 transition hover:-translate-y-1 hover:border-contrast hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-contrast/40 dark:bg-primary/10 dark:shadow-black/60 ${
                isCompleted ? 'border-2 border-contrast' : 'border border-secondary/40'
              }`}
            >
              {item.letter}
              {/* Palomita verde en la esquina superior derecha */}
              {isCompleted && (
                <span
                  aria-hidden="true"
                  className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-contrast text-sm font-bold text-white shadow-md dark:text-black"
                >
                  ✓
                </span>
              )}
            </button>
          )
        })}
      </div>

      {selectedIndex !== null && (
        <LetterModal
          letter={letters[selectedIndex]}
          completed={completedIds.has(letters[selectedIndex].id)}
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