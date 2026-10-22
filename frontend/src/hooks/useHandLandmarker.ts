import { useEffect, useState } from 'react'
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'

// La versión debe ser la misma que @mediapipe/tasks-vision en package.json (fijada en 1.1.1)
const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.1.1/wasm'
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'

export type ModelStatus = 'loading' | 'ready' | 'error'

// Crea el detector de manos. Primero intenta con la tarjeta gráfica (GPU, más rápido)
// y, si el equipo no la soporta, usa el procesador (CPU)
async function createHandLandmarker() {
  const vision = await FilesetResolver.forVisionTasks(WASM_URL)

  const options = (delegate: 'GPU' | 'CPU') => ({
    baseOptions: { modelAssetPath: MODEL_URL, delegate },
    runningMode: 'VIDEO' as const,
    numHands: 1,
  })

  try {
    const landmarker = await HandLandmarker.createFromOptions(vision, options('GPU'))
    console.info('MediaPipe: usando GPU')
    return landmarker
  } catch {
    console.info('MediaPipe: GPU no disponible, usando CPU (más lento)')
    return await HandLandmarker.createFromOptions(vision, options('CPU'))
  }
}

// Descarga y prepara el modelo de MediaPipe Hands una sola vez por página
export function useHandLandmarker() {
  const [handLandmarker, setHandLandmarker] = useState<HandLandmarker | null>(null)
  const [status, setStatus] = useState<ModelStatus>('loading')

  useEffect(() => {
    let landmarker: HandLandmarker | null = null
    let cancelled = false

    async function loadModel() {
      try {
        landmarker = await createHandLandmarker()

        if (cancelled) {
          landmarker.close()
          return
        }

        setHandLandmarker(landmarker)
        setStatus('ready')
      } catch (error) {
        if (cancelled) return
        console.error('Error al cargar MediaPipe:', error)
        setStatus('error')
      }
    }

    loadModel()

    // Libera la memoria del modelo al salir de la página
    return () => {
      cancelled = true
      landmarker?.close()
    }
  }, [])

  return { handLandmarker, status }
}
