import { useState } from 'react'

interface LetterAttempts {
  letter: string
  attempts: number
  correct: number
}

// Datos de ejemplo para ver el diseño
// En la Fase 6 se reemplazan por los datos reales del backend
const sampleAttempts: LetterAttempts[] = [
  { letter: 'A', attempts: 5, correct: 4 },
  { letter: 'B', attempts: 3, correct: 1 },
  { letter: 'C', attempts: 2, correct: 0 },
]

function AttemptsCard() {
  const [isOpen, setIsOpen] = useState(false)

  const total = sampleAttempts.reduce((sum, item) => sum + item.attempts, 0)

  return (
    <div className="rounded-3xl border border-secondary/40 bg-white p-6 shadow-lg shadow-primary/10 dark:bg-primary/10 dark:shadow-black/60">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="attempts-list"
        className="flex w-full cursor-pointer items-start justify-between text-left"
      >
        <div>
          <p className="text-4xl font-extrabold text-primary">{total}</p>
          <p className="mt-2 font-semibold text-black dark:text-white">Intentos totales</p>
          <p className="mt-1 text-xs text-black/50 dark:text-white/50">Datos de ejemplo</p>
        </div>

        <span
          className={`mt-2 text-2xl text-primary transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          ▾
        </span>
      </button>

      <div
        id="attempts-list"
        className={`grid transition-[grid-template-rows] duration-300 ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          {sampleAttempts.length === 0 ? (
            <p className="mt-4 border-t border-secondary/30 pt-4 text-sm text-black/60 dark:text-white/60">
              Aún no tienes intentos. ¡Practica tu primera letra!
            </p>
          ) : (
            <ul className="mt-4 space-y-2 border-t border-secondary/30 pt-4">
              {sampleAttempts.map((item) => (
                <li key={item.letter} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/20 font-extrabold text-primary">
                    {item.letter}
                  </span>
                  <span className="flex-1 text-sm text-black/80 dark:text-white/80">
                    {item.attempts} {item.attempts === 1 ? 'intento' : 'intentos'}
                  </span>
                  <span className="rounded-full bg-contrast/20 px-2 py-0.5 text-xs font-semibold text-black dark:text-white">
                    {item.correct} ✓
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default AttemptsCard