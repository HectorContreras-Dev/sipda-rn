import { useEffect, useRef, useState } from 'react'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import AppLayout from '../components/AppLayout'
import CameraView from '../components/CameraView'
import { buildSequence, SEQUENCE_MS, type Frame } from '../utils/sequence'

interface MotionSample {
  label: string
  frames: number[][] // 30 cuadros × 66 números
}

const COUNTDOWN_S = 3

// idle: esperando · countdown: 3-2-1 · recording: grabando el movimiento
type Phase = 'idle' | 'countdown' | 'recording'

function CaptureMotionPage() {
  const [label, setLabel] = useState('J')
  const [phase, setPhase] = useState<Phase>('idle')
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('')
  // Muestras grabadas (estado: la página se actualiza al agregar una)
  const [samples, setSamples] = useState<MotionSample[]>([])
  // useRef: los cuadros se guardan sin volver a dibujar la página en cada uno
  const frames = useRef<Frame[]>([])

  // Solo guarda cuadros mientras graba y hay mano en cámara
  function handleLandmarks(landmarks: NormalizedLandmark[] | null) {
    if (phase !== 'recording' || !landmarks) return
    frames.current.push({ time: performance.now(), landmarks })
  }

  function start() {
    setMessage('')
    setCount(COUNTDOWN_S)
    setPhase('countdown')
  }

  // Cuenta 3-2-1: cada segundo baja uno; después del 1 empieza a grabar con la lista vacía
  useEffect(() => {
    if (phase !== 'countdown') return
    const timeoutId = setTimeout(() => {
      if (count > 1) {
        setCount(count - 1)
      } else {
        frames.current = []
        setPhase('recording')
      }
    }, 1000)
    return () => clearTimeout(timeoutId)
  }, [phase, count])

  // Grabación: dura SEQUENCE_MS (1.5 s) y luego convierte los cuadros en una muestra
  useEffect(() => {
    if (phase !== 'recording') return
    const timeoutId = setTimeout(() => {
      const sequence = buildSequence(frames.current)
      if (sequence) {
        setSamples((previous) => [...previous, { label, frames: sequence }])
        setMessage(`✓ Muestra de ${label} guardada`)
      } else {
        setMessage('✕ Casi no se vio la mano. Repite la seña.')
      }
      setPhase('idle')
    }, SEQUENCE_MS)
    return () => clearTimeout(timeoutId)
  }, [phase, label])

  // Borra la última muestra (por si salió mal)
  function undo() {
    const removed = samples.at(-1)
    if (!removed) return
    setSamples(samples.slice(0, -1))
    setMessage(`Se borró la última muestra de ${removed.label}`)
  }

  function download() {
    // Redondea a 4 decimales para que el archivo pese menos de la mitad
    const json = JSON.stringify(samples, (_key, value) =>
      typeof value === 'number' ? Math.round(value * 10000) / 10000 : value,
    )
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `motion-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  function clearAll() {
    setSamples([])
    setMessage('')
  }

  // Cuántas muestras hay de cada letra: { J: 45, NADA: 80 }
  const perLabel: Record<string, number> = {}
  for (const sample of samples) {
    perLabel[sample.label] = (perLabel[sample.label] ?? 0) + 1
  }

  const total = samples.length
  const busy = phase !== 'idle'

  return (
    <AppLayout>
      <h1 className="mb-4 text-2xl font-extrabold text-black dark:text-white">
        Captura de señas con movimiento
      </h1>

      <div className="relative mx-auto max-w-3xl">
        <CameraView onLandmarks={handleLandmarks} />

        {/* Cuenta 3-2-1 encima de la cámara */}
        {phase === 'countdown' && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-3xl bg-black/40">
            <p className="text-9xl font-extrabold text-white">{count}</p>
          </div>
        )}

        {/* Aviso mientras graba */}
        {phase === 'recording' && (
          <p className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-red-600 px-4 py-1 font-bold text-white">
            ● Grabando…
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <label className="flex items-center gap-2 font-semibold text-black dark:text-white">
          Etiqueta
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value.trim().toUpperCase())}
            disabled={busy}
            className="w-28 rounded-lg border border-secondary/40 px-3 py-2 text-center font-bold"
          />
        </label>

        <button
          type="button"
          onClick={start}
          disabled={!label || busy}
          className="cursor-pointer rounded-xl bg-primary px-5 py-2 font-bold text-white disabled:opacity-50"
        >
          Grabar seña
        </button>

        <button
          type="button"
          onClick={undo}
          disabled={total === 0 || busy}
          className="cursor-pointer rounded-xl border border-primary px-5 py-2 font-bold text-primary disabled:opacity-50"
        >
          Deshacer última
        </button>

        <button
          type="button"
          onClick={download}
          disabled={total === 0 || busy}
          className="cursor-pointer rounded-xl border border-primary px-5 py-2 font-bold text-primary disabled:opacity-50"
        >
          Descargar JSON
        </button>

        <button
          type="button"
          onClick={clearAll}
          disabled={total === 0 || busy}
          className="cursor-pointer rounded-xl px-5 py-2 font-bold text-black/60 disabled:opacity-50 dark:text-white/60"
        >
          Borrar todo
        </button>
      </div>

      {message && (
        <p className="mt-4 text-center font-semibold text-black dark:text-white">{message}</p>
      )}

      <p className="mt-2 text-center text-black/70 dark:text-white/70">
        Total: {total} muestras
        {Object.entries(perLabel).map(([letter, amount]) => ` · ${letter}: ${amount}`)}
      </p>
    </AppLayout>
  )
}

export default CaptureMotionPage