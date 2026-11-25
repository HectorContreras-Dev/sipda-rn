import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import { normalizeLandmarks } from './normalize'

// Duración de una seña con movimiento (la ventana que se analiza)
export const SEQUENCE_MS = 1500
// Cuadros que recibe el modelo: siempre los mismos, sin importar los FPS de la cámara
export const SEQUENCE_FRAMES = 30
// Números por cuadro: 63 de la forma de la mano + 3 del movimiento (dx, dy, escala)
export const FEATURES_PER_FRAME = 66
// Mínimo de cuadros reales con mano para confiar en la secuencia
const MIN_REAL_FRAMES = 12

// Un cuadro con mano y el momento en que se detectó
export interface Frame {
  time: number
  landmarks: NormalizedLandmark[]
}

// Agrega un cuadro y borra los que ya quedaron fuera de la ventana.
// Modifica la lista directamente (pensada para guardarse en un useRef)
export function addFrame(frames: Frame[], frame: Frame) {
  frames.push(frame)
  while (frames.length > 0 && frame.time - frames[0].time > SEQUENCE_MS) {
    frames.shift()
  }
}

// Datos crudos de un cuadro: los 63 de la forma + dónde está la muñeca y qué tan grande se ve la mano
function frameValues(points: NormalizedLandmark[]): number[] {
  const wrist = points[0]
  const size =
    Math.hypot(points[9].x - wrist.x, points[9].y - wrist.y, points[9].z - wrist.z) || 1
  return [...normalizeLandmarks(points), wrist.x, wrist.y, size]
}

// Convierte los cuadros guardados en una secuencia de 30 cuadros × 66 números.
// Devuelve null si hay muy pocos cuadros o si cubren muy poco tiempo
export function buildSequence(frames: Frame[]): number[][] | null {
  if (frames.length < MIN_REAL_FRAMES) return null

  const start = frames[0].time
  const end = frames[frames.length - 1].time
  // Si la mano apareció apenas hace un momento, todavía no hay un movimiento completo
  if (end - start < SEQUENCE_MS * 0.7) return null

  const raw = frames.map((frame) => frameValues(frame.landmarks))

  // 1. Remuestreo: 30 momentos repartidos parejo entre el inicio y el final.
  //    Si un momento cae entre dos cuadros reales, se calcula el punto intermedio
  const step = (end - start) / (SEQUENCE_FRAMES - 1)
  const resampled: number[][] = []
  let j = 0
  for (let i = 0; i < SEQUENCE_FRAMES; i++) {
    const t = start + i * step
    // Avanza hasta el par de cuadros reales que rodean a t
    while (j < frames.length - 2 && frames[j + 1].time < t) j++
    const a = frames[j].time
    const b = frames[j + 1].time
    // ratio: qué tan cerca está t del segundo cuadro (0 = del primero, 1 = del segundo)
    const ratio = b === a ? 0 : Math.min(Math.max((t - a) / (b - a), 0), 1)
    resampled.push(raw[j].map((value, k) => value + (raw[j + 1][k] - value) * ratio))
  }

  // 2. Movimiento: todo se mide contra el primer cuadro.
  //    dx, dy = cuánto se movió la muñeca (en "tamaños de mano")
  //    escala = cuánto creció la mano (positivo = se acercó a la cámara)
  const [x0, y0, size0] = resampled[0].slice(63)
  return resampled.map((values) => {
    const [x, y, size] = values.slice(63)
    return [...values.slice(0, 63), (x - x0) / size0, (y - y0) / size0, size / size0 - 1]
  })
}