import { useState } from 'react'
import { letters } from '../data/letters'
import LetterModal from './LetterModal'

function LetterGrid() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-extrabold text-black dark:text-white">Abecedario</h2>
      <p className="mt-1 text-black/70 dark:text-white/70">
        Elige una letra para ver cómo se hace la seña.
      </p>

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