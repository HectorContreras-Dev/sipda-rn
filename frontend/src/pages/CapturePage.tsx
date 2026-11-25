import { useRef, useState } from 'react'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import AppLayout from '../components/AppLayout'
import CameraView from '../components/CameraView'
import { normalizeLandmarks } from '../utils/normalize'

interface Sample {
  label: string
  points: number[]
}

// Cuántas muestras se graban cada vez que presionas "Grabar"
const SAMPLES_PER_RECORDING = 150

function CapturePage() {
  const [label, setLabel] = useState('A')
  const [recording, setRecording] = useState(false)
  const [count, setCount] = useState(0)
  // useRef: guarda las muestras sin volver a dibujar la página en cada una
  const samples = useRef<Sample[]>([])
  // Cuántas lleva la grabación actual
  const recordedNow = useRef(0)

  function handleLandmarks(landmarks: NormalizedLandmark[] | null) {
    // Solo guarda si está grabando y hay una mano en cámara
    if (!recording || !landmarks) return

    samples.current.push({ label, points: normalizeLandmarks(landmarks) })
    recordedNow.current++
    setCount(samples.current.length)

    // Se detiene sola al llegar al límite
    if (recordedNow.current >= SAMPLES_PER_RECORDING) setRecording(false)
  }

  function toggleRecording() {
    recordedNow.current = 0
    setRecording(!recording)
  }

  function download() {
    const blob = new Blob([JSON.stringify(samples.current)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `dataset-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  function clearAll() {
    samples.current = []
    setCount(0)
  }

  // Cuántas muestras hay de cada letra: { A: 300, NADA: 280 }
  const perLabel: Record<string, number> = {}
  for (const sample of samples.current) {
    perLabel[sample.label] = (perLabel[sample.label] ?? 0) + 1
  }

  return (
    <AppLayout>
      <h1 className="mb-4 text-2xl font-extrabold text-black dark:text-white">Captura de dataset</h1>

      <div className="mx-auto max-w-3xl">
        <CameraView onLandmarks={handleLandmarks} />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <label className="flex items-center gap-2 font-semibold text-black dark:text-white">
          Etiqueta
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value.trim().toUpperCase())}
            disabled={recording}
            className="w-28 rounded-lg border border-secondary/40 px-3 py-2 text-center font-bold"
          />
        </label>

        <button
          type="button"
          onClick={toggleRecording}
          disabled={!label}
          className="cursor-pointer rounded-xl bg-primary px-5 py-2 font-bold text-white disabled:opacity-50"
        >
          {recording ? `Grabando… (${recordedNow.current}/${SAMPLES_PER_RECORDING})` : 'Grabar'}
        </button>

        <button
          type="button"
          onClick={download}
          disabled={count === 0 || recording}
          className="cursor-pointer rounded-xl border border-primary px-5 py-2 font-bold text-primary disabled:opacity-50"
        >
          Descargar JSON
        </button>

        <button
          type="button"
          onClick={clearAll}
          disabled={count === 0 || recording}
          className="cursor-pointer rounded-xl px-5 py-2 font-bold text-black/60 disabled:opacity-50 dark:text-white/60"
        >
          Borrar todo
        </button>
      </div>

      <p className="mt-4 text-center text-black/70 dark:text-white/70">
        Total: {count} muestras
        {Object.entries(perLabel).map(([letter, amount]) => ` · ${letter}: ${amount}`)}
      </p>
    </AppLayout>
  )
}

export default CapturePage