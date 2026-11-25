import { useEffect, useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import { normalizeLandmarks } from '../utils/normalize'

export interface Prediction {
  label: string // Letra que el modelo cree que es: 'A', 'NADA'...
  confidence: number // Qué tan seguro está, de 0 a 1
}

// Carga el modelo entrenado (public/model) y permite predecir la letra de una mano
export function useSignModel() {
  const [model, setModel] = useState<tf.LayersModel | null>(null)
  const [labels, setLabels] = useState<string[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    // Evita guardar el modelo si el usuario ya salió de la página mientras cargaba
    let cancelled = false

    async function load() {
      try {
        // Se cargan las dos cosas al mismo tiempo
        const [loadedModel, loadedLabels] = await Promise.all([
          tf.loadLayersModel('/model/sipda-model.json'),
          fetch('/model/labels.json').then((response) => response.json()),
        ])
        if (cancelled) return
        setModel(loadedModel)
        setLabels(loadedLabels)
        setStatus('ready')
      } catch (error) {
        console.error(error)
        if (!cancelled) setStatus('error')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  function predict(landmarks: NormalizedLandmark[]): Prediction | null {
    if (!model) return null

    // tidy borra de memoria los tensores que se crean aquí adentro
    return tf.tidy(() => {
      // Una sola muestra: tabla de 1 fila × 63 columnas
      const input = tf.tensor2d([normalizeLandmarks(landmarks)])
      const output = model.predict(input) as tf.Tensor
      // Probabilidad de cada etiqueta, en el mismo orden que labels: [0.97, 0.03]
      const probabilities = output.dataSync()

      // Busca la más alta
      let best = 0
      for (let i = 1; i < probabilities.length; i++) {
        if (probabilities[i] > probabilities[best]) best = i
      }

      return { label: labels[best], confidence: probabilities[best] }
    })
  }

  return { status, predict }
}