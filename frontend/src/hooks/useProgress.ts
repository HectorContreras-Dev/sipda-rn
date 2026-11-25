import { useEffect, useState } from 'react'
import { API_URL } from '../config'

export interface LetterProgress {
  letter_id: number
  letter: string
  attempts: number
  correct: number
}

export interface Progress {
  letters: LetterProgress[] // Solo las letras que ya practicó en el modo prueba
  completed_letter_ids: number[]
  total_attempts: number
  accuracy: number | null // Porcentaje de intentos correctos (null si no hay intentos)
}

// Pide el progreso del usuario a GET /api/progress. Mientras carga (o si falla) regresa null
// reloadKey: si cambia, se vuelve a pedir (por ejemplo, después de borrar el progreso)
export function useProgress(reloadKey = 0) {
  const [progress, setProgress] = useState<Progress | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const response = await fetch(`${API_URL}/api/progress`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        if (!response.ok) return
        const data = await response.json()
        if (!cancelled) setProgress(data)
      } catch {
        // Sin conexión: las pantallas se muestran sin progreso
      }
    }

    load()
    return () => {
      cancelled = true
    }
    }, [reloadKey])

  return progress
}