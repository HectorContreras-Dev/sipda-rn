import { useEffect, useEffectEvent, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import CameraView from '../components/CameraView'
import { letters } from '../data/letters'

const COUNTDOWN_S = 3 // Cuenta antes de empezar
const TIME_LIMIT_S = 6 // Tiempo para lograr la seña

// En qué momento del intento estamos
type Phase = 'idle' | 'countdown' | 'active' | 'done'

interface AttemptResult {
  isCorrect: boolean
  confidence: number // De 0 a 1
}

function AttemptPage() {
  const { letter } = useParams()
  const currentLetter = letters.find((item) => item.letter === letter?.toUpperCase())

  const [phase, setPhase] = useState<Phase>('idle')
  // Sirve para las dos cuentas: 3-2-1 y el tiempo límite
  const [count, setCount] = useState(0)
  // Resultados de esta sesión (en la Fase 6 también se guardarán en el backend)
  const [history, setHistory] = useState<AttemptResult[]>([])
  const lastResult = history.at(-1)
  const correctCount = history.filter((item) => item.isCorrect).length

  function start() {
    setCount(COUNTDOWN_S)
    setPhase('countdown')
  }

  // Termina el intento (acierto o tiempo agotado)
  function finish(result: AttemptResult) {
    // Fase 6: aquí se mandará el intento al backend (POST /api/attempts)
    setHistory((previous) => [...previous, result])
    setPhase('done')
  }

  // useEffectEvent: permite llamar a finish desde el efecto
  // sin que el efecto se vuelva a ejecutar cada vez que finish cambia
  const onTimeUp = useEffectEvent(() => finish({ isCorrect: false, confidence: 0 }))

  // Reloj: baja count de 1 en 1 cada segundo, en la cuenta y en el intento
  useEffect(() => {
    if (phase !== 'countdown' && phase !== 'active') return

    if (count === 0) {
      if (phase === 'countdown') {
        // Terminó el 3-2-1: empieza el intento con su tiempo límite
        setPhase('active')
        setCount(TIME_LIMIT_S)
      } else {
        // Se acabó el tiempo sin lograrla
        onTimeUp()
      }
      return
    }

    const timeoutId = setTimeout(() => setCount((previous) => previous - 1), 1000)
    return () => clearTimeout(timeoutId)
  }, [phase, count])

  function handleSuccess(confidence: number) {
    // Por si llega justo cuando se acabó el tiempo
    if (phase !== 'active') return
    finish({ isCorrect: true, confidence })
  }

  if (!currentLetter) {
    return (
      <AppLayout>
        <p role="alert" className="font-medium text-black dark:text-white">
          ✕ La letra “{letter}” no existe.
        </p>
      </AppLayout>
    )
  }

    return (
    <AppLayout fullScreen>
      {/* Los dos botones de regreso, uno junto al otro */}
      <div className="mb-3 flex flex-wrap gap-2 self-start">
        <Link
          to="/home"
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-bold text-primary transition hover:bg-secondary/20"
        >
          Volver al inicio
        </Link>
        <Link
          to={`/practice/${currentLetter.letter}`}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-bold text-primary transition hover:bg-secondary/20"
        >
          Volver a practicar
        </Link>
      </div>

      <div className="grid gap-6 lg:min-h-0 lg:flex-1 lg:grid-cols-[1fr_360px]">
        <div className="flex items-center justify-center lg:min-h-0 lg:@container-size">
          {/* relative: para poner las capas (cuenta, tiempo, resultado) encima de la cámara */}
          <div className="relative w-full lg:w-[min(100cqw,calc(100cqh*16/9))]">
            <CameraView
              targetLetter={currentLetter.letter}
              active={phase === 'active'}
              onSuccess={handleSuccess}
            />

            {/* Antes de empezar */}
            {phase === 'idle' && (
              <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-black/50">
                <button
                  type="button"
                  onClick={start}
                  className="cursor-pointer rounded-2xl bg-contrast px-8 py-4 text-2xl font-extrabold text-black transition hover:scale-105"
                >
                  Intentar
                </button>
              </div>
            )}

            {/* Cuenta 3-2-1 (pointer-events-none: no bloquea los botones de la cámara) */}
            {phase === 'countdown' && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-3xl bg-black/40">
                <p className="text-9xl font-extrabold text-white">{count}</p>
              </div>
            )}

            {/* Tiempo restante */}
            {phase === 'active' && (
              <p className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1 text-lg font-bold text-white">
                ⏱ {count}s
              </p>
            )}

            {/* Resultado */}
            {phase === 'done' && lastResult && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl bg-black/60">
                <p
                  className={`rounded-2xl px-6 py-3 text-3xl font-extrabold ${
                    lastResult.isCorrect ? 'bg-contrast text-black' : 'bg-white text-black'
                  }`}
                >
                  {lastResult.isCorrect
                    ? `¡Correcto! ✓ ${Math.round(lastResult.confidence * 100)}%`
                    : 'Se acabó el tiempo'}
                </p>
                <button
                  type="button"
                  onClick={start}
                  className="cursor-pointer rounded-xl bg-white px-5 py-2 font-bold text-black transition hover:bg-white/80"
                >
                  Intentar otra vez
                </button>
              </div>
            )}
          </div>
        </div>

        <aside className="flex flex-col gap-6 rounded-3xl border border-secondary/40 bg-white p-6 shadow-lg shadow-primary/10 dark:bg-primary/10 dark:shadow-black/60">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-black/60 dark:text-white/60">
              Ponte a prueba
            </p>
            <h1 className="text-7xl font-extrabold leading-tight   text-primary">{currentLetter.letter}</h1>
            <div className="my-4 h-1.5 w-16 rounded-full bg-contrast" />
            <p className="text-black/80 dark:text-white/80">
              Cuando termine la cuenta, haz la seña y sostenla 1 segundo. Tienes {TIME_LIMIT_S} segundos.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-secondary/30 pt-5">
            <div>
              <p className="text-4xl font-extrabold text-primary">{history.length}</p>
              <p className="text-sm font-semibold text-black dark:text-white">Intentos</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-primary">{correctCount}</p>
              <p className="text-sm font-semibold text-black dark:text-white">Aciertos</p>
            </div>
          </div>
        </aside>
      </div>
    </AppLayout>
  )
}

export default AttemptPage