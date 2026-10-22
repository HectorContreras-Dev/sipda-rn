import { useEffect, useState, type RefObject } from 'react'
import type { HandLandmarker, NormalizedLandmark } from '@mediapipe/tasks-vision'

// Analiza cada cuadro del video y devuelve los 21 puntos de la mano, o null si no hay mano.
// Cada punto trae x, y (de 0 a 1, relativos al tamaño del video) y z (profundidad)
export function useHandDetection(
  videoRef: RefObject<HTMLVideoElement | null>,
  handLandmarker: HandLandmarker | null,
) {
  const [landmarks, setLandmarks] = useState<NormalizedLandmark[] | null>(null)

  useEffect(() => {
    // Espera a que el modelo esté cargado
    if (!handLandmarker) return
    // Constante para que TypeScript sepa que dentro de detect() ya no es null
    const landmarker = handLandmarker

    let frameId = 0
    let lastVideoTime = -1
    // Momento a partir del cual se permite el siguiente análisis
    let nextDetectionAt = 0

    function detect() {
      const video = videoRef.current
      const now = performance.now()

      // readyState >= 2: el video ya tiene imagen. Solo se analiza si llegó un cuadro nuevo
      // y si ya pasó el descanso del análisis anterior
      if (video && video.readyState >= 2 && video.currentTime !== lastVideoTime && now >= nextDetectionAt) {
        lastVideoTime = video.currentTime
        const result = landmarker.detectForVideo(video, now)
        const hand = result.landmarks[0] ?? null

        // detectForVideo bloquea la página mientras trabaja. Se deja un descanso igual a lo
        // que tardó, así la IA usa como máximo la mitad del tiempo y el video no se traba
        const duration = performance.now() - now
        nextDetectionAt = performance.now() + duration

        // Si sigue sin haber mano, no se actualiza el estado (evita renders innecesarios)
        setLandmarks((previous) => (previous === null && hand === null ? previous : hand))
      }

      // Pide al navegador volver a llamar a detect() en el siguiente cuadro de pantalla
      frameId = requestAnimationFrame(detect)
    }

    frameId = requestAnimationFrame(detect)

    // Detiene el ciclo al salir de la página
    return () => cancelAnimationFrame(frameId)
  }, [videoRef, handLandmarker])

  return landmarks
}
