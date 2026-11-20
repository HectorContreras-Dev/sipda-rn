import type { NormalizedLandmark } from '@mediapipe/tasks-vision'

// Convierte los 21 puntos de la mano en 63 números que no dependen
// de dónde esté la mano en la pantalla ni de qué tan cerca esté de la cámara
export function normalizeLandmarks(points: NormalizedLandmark[]): number[] {
  const wrist = points[0]

  // Tamaño de la mano: distancia de la muñeca (0) al nudillo del dedo medio (9)
  const size =
    Math.hypot(points[9].x - wrist.x, points[9].y - wrist.y, points[9].z - wrist.z) || 1

  // Cada punto se mide desde la muñeca y se divide entre el tamaño de la mano
  return points.flatMap((p) => [
    (p.x - wrist.x) / size,
    (p.y - wrist.y) / size,
    (p.z - wrist.z) / size,
  ])
}