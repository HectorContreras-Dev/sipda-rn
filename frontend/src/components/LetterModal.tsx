import { useEffect } from 'react'
import { difficultyLabels, type Letter } from '../data/letters'

interface LetterModalProps {
  letter: Letter
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
}

function LetterModal({ letter, onClose, onPrev, onNext }: LetterModalProps) {
  // Bloquea el scroll de la página de atrás mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Atajos de teclado: Esc cierra, flechas cambian de letra
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && onPrev) onPrev()
      if (e.key === 'ArrowRight' && onNext) onNext()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onPrev, onNext])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="letter-title"
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-secondary/40 bg-white p-6 shadow-2xl dark:bg-black sm:p-8 animate-slide-up motion-reduce:animate-none"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-xl text-black/60 transition hover:bg-secondary/20 hover:text-black dark:text-white/60 dark:hover:text-white"
        >
          ✕
        </button>

        <div className="grid gap-8 sm:grid-cols-2">
          {/* Imagen de la seña (pendiente) */}
          {letter.image_url ? (
            <img
              src={letter.image_url}
              alt={`Seña de la letra ${letter.letter}`}
              className="aspect-square w-full rounded-2xl object-cover"
            />
          ) : (
            <div className="flex aspect-square w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-secondary/50 bg-secondary/10 text-center">
              
              <p className="mt-3 text-sm font-medium text-black/60 dark:text-white/60">
                imagen próximamente
              </p>
            </div>
          )}

          {/* Información de la letra */}
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-black/60 dark:text-white/60">
              Letra
            </p>
            <h2 id="letter-title" className="text-7xl font-extrabold text-primary">
              {letter.letter}
            </h2>
            <div className="my-4 h-1.5 w-16 rounded-full bg-contrast" />

            <p className="text-black/80 dark:text-white/80">{letter.description}</p>

            <span className="mt-4 w-fit rounded-full bg-contrast/20 px-3 py-1 text-sm font-semibold text-black dark:text-white">
              {difficultyLabels[letter.difficulty]}
            </span>

            <button
              type="button"
              disabled
              className="mt-6 w-full rounded-xl bg-contrast px-4 py-3 font-bold text-black opacity-60 shadow-md shadow-contrast/40 disabled:cursor-not-allowed"
            >
              Practicar con cámara · Próximamente
            </button>
          </div>
        </div>

        {/* Navegación entre letras */}
        <div className="mt-8 flex justify-between border-t border-secondary/30 pt-5">
          <button
            type="button"
            onClick={onPrev}
            disabled={!onPrev}
            className="cursor-pointer rounded-xl px-4 py-2 font-bold text-primary transition hover:bg-secondary/20 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ← Anterior
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!onNext}
            className="cursor-pointer rounded-xl px-4 py-2 font-bold text-primary transition hover:bg-secondary/20 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  )
}

export default LetterModal