import { useEffect, useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import type { Prediction } from './useSignModel'

// Carga el modelo de señas con movimiento (public/model) y predice la letra de una secuencia
export function useMotionModel() {
  const [model, setModel] = useState<tf.LayersModel | null>(null)
  const [labels, setLabels] = useState<string[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    // Evita guardar el modelo si el usuario ya salió de la página mientras cargaba
    let cancelled = false

    async function load() {
      try {
        const [loadedModel, loadedLabels] = await Promise.all([
          tf.loadLayersModel('/model/sipda-motion-model.json'),
          fetch('/model/motion-labels.json').then((response) => response.json()),
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

  // sequence: 30 cuadros × 66 números (lo que regresa buildSequence)
  function predict(sequence: number[][]): Prediction | null {
    if (!model) return null

    return tf.tidy(() => {
      // Una sola muestra: 1 × 30 cuadros × 66 números
      const input = tf.tensor3d([sequence])
      const output = model.predict(input) as tf.Tensor
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