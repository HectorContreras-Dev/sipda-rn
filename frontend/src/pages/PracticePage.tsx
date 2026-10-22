import { Link, useParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import CameraView from '../components/CameraView'
import { difficultyLabels, letters } from '../data/letters'

const tips = [
  'Busca un lugar con buena luz.',
  'Coloca tu mano al centro de la cámara.',
  'Usa un fondo liso si es posible.',
]

function PracticePage() {
  // Lee la letra de la URL: en /practice/A, letter vale 'A'
  const { letter } = useParams()
  const currentLetter = letters.find((item) => item.letter === letter?.toUpperCase())

  return (
    <AppLayout fullScreen>
      <Link
        to="/home"
        className="mb-3 inline-flex items-center gap-2 self-start rounded-xl px-4 py-2 font-bold text-primary transition hover:bg-secondary/20"
      >
        ← Volver a inicio
      </Link>

      {!currentLetter ? (
        <p
          role="alert"
          className="rounded-lg border-l-4 border-black bg-black/5 px-4 py-3 text-sm font-medium text-black dark:border-white dark:bg-white/10 dark:text-white"
        >
          ✕ La letra “{letter}” no existe. Elige una letra desde el inicio.
        </p>
      ) : (
        // Cámara con todo el espacio libre + columna fija de 360px a la derecha.
        // En pantallas grandes la cuadrícula ocupa el alto restante (flex-1)
        <div className="grid gap-6 lg:min-h-0 lg:flex-1 lg:grid-cols-[1fr_360px]">
          {/* @container-size permite medir este espacio con cqw/cqh (ancho/alto del contenedor).
              La cámara usa el ancho que quepa sin pasarse del alto, siempre en 16:9 */}
          <div className="flex items-center justify-center lg:min-h-0 lg:@container-size">
            <div className="w-full lg:w-[min(100cqw,calc(100cqh*16/9))]">
              <CameraView />
            </div>
          </div>

          <aside className="flex flex-col gap-6 lg:overflow-y-auto rounded-3xl border border-secondary/40 bg-white p-6 shadow-lg shadow-primary/10 dark:bg-primary/10 dark:shadow-black/60">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-black/60 dark:text-white/60">
                Practicando la letra
              </p>
              <h1 className="text-7xl font-extrabold text-primary">{currentLetter.letter}</h1>
              <div className="my-4 h-1.5 w-16 rounded-full bg-contrast" />
              <p className="text-black/80 dark:text-white/80">{currentLetter.description}</p>
              <span className="mt-4 inline-block rounded-full bg-contrast/20 px-3 py-1 text-sm font-semibold text-black dark:text-white">
                {difficultyLabels[currentLetter.difficulty]}
              </span>
            </div>

            <div className="border-t border-secondary/30 pt-5">
              <h2 className="font-bold text-black dark:text-white">Consejos</h2>
              <ul className="mt-3 space-y-2">
                {tips.map((tip) => (
                  <li key={tip} className="flex gap-3 text-sm text-black/80 dark:text-white/80">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-contrast text-xs font-bold text-black">
                      ✓
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      )}
    </AppLayout>
  )
}

export default PracticePage
