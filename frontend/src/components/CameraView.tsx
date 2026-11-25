import { useCamera } from '../hooks/useCamera'
import { useHandLandmarker } from '../hooks/useHandLandmarker'
import { useHandDetection } from '../hooks/useHandDetection'
import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { HandLandmarker, type NormalizedLandmark } from '@mediapipe/tasks-vision'
import { useSignModel } from '../hooks/useSignModel'
import { useMotionModel } from '../hooks/useMotionModel'
import { letters } from '../data/letters'
import { addFrame, buildSequence, type Frame } from '../utils/sequence'

// Cuánto tiempo hay que sostener la seña y con qué confianza mínima
const HOLD_MS = 1000
const MIN_CONFIDENCE = 0.9
// Señas con movimiento: cada cuánto se revisa y cuántos aciertos seguidos se piden
const MOTION_CHECK_MS = 200
const MOTION_HITS = 3

interface CameraViewProps {
  // Se llama cada vez que llegan puntos nuevos (null si no hay mano)
  onLandmarks?: (landmarks: NormalizedLandmark[] | null) => void
  // Letra que se está practicando. Si no se pasa (como en /capture), no se evalúa nada
  targetLetter?: string
  // false = la cámara se ve, pero no evalúa (por ejemplo, durante la cuenta 3-2-1)
  active?: boolean
  // Si se pasa, el padre decide qué hacer al acertar (no se muestra el ¡Correcto! de aquí)
  onSuccess?: (confidence: number) => void
}

function CameraView({ onLandmarks, targetLetter, active = true, onSuccess }: CameraViewProps) {
  const { videoRef, status, errorMessage } = useCamera()
  const { handLandmarker, status: modelStatus } = useHandLandmarker()
  // 21 puntos de la mano en cada cuadro (null si no hay mano)
  const landmarks = useHandDetection(videoRef, handLandmarker)

    // Predicción del modelo (solo si se está practicando una letra y hay mano)
  const { status: signStatus, predict } = useSignModel()
    // ¿La letra lleva movimiento? (las que tienen video: J, K, LL, Ñ, Q, X, Z)
  const isMotion = Boolean(letters.find((item) => item.letter === targetLetter)?.video_url)
  const { status: motionStatus, predict: predictMotion } = useMotionModel()
    const prediction =
    targetLetter && !isMotion && landmarks && signStatus === 'ready' ? predict(landmarks) : null
  // ¿La mano está haciendo la letra correcta con suficiente confianza?
  const isMatch =
    prediction !== null &&
    prediction.label === targetLetter &&
    prediction.confidence >= MIN_CONFIDENCE

  // Momento en que empezó a sostener la seña correcta (null si no la está haciendo)
  const holdStart = useRef<number | null>(null)
  // Qué tanto lleva sostenida, de 0 a 1 (para la barra)
  const [holdProgress, setHoldProgress] = useState(0)
  const [success, setSuccess] = useState(false)

  // Confianza de la predicción actual (0 si no hay)
  const confidence = prediction?.confidence ?? 0
  // Confianzas mientras sostiene la seña, para sacar el promedio del intento
  const holdConfidences = useRef<number[]>([])

  // Mismo truco que con onLandmarks: siempre la versión más reciente
  const onSuccessRef = useRef(onSuccess)
  useEffect(() => {
    onSuccessRef.current = onSuccess
  })

  // En cada cuadro nuevo revisa si sigue sosteniendo la seña
  useEffect(() => {
    if (success) return

    // Si no está activo, la suelta o se equivoca, el contador vuelve a empezar
    if (!active || !isMatch) {
      holdStart.current = null
      holdConfidences.current = []
      setHoldProgress(0)
      return
    }

    const now = performance.now()
    holdStart.current ??= now
    holdConfidences.current.push(confidence)
    const progress = Math.min((now - holdStart.current) / HOLD_MS, 1)
    setHoldProgress(progress)

    if (progress === 1) {
      // Promedio de confianza durante el segundo que la sostuvo
      const list = holdConfidences.current
      const average = list.reduce((sum, value) => sum + value, 0) / list.length

      holdStart.current = null
      holdConfidences.current = []
      setHoldProgress(0)

      // Si el padre quiere el resultado, se lo manda; si no, muestra el ¡Correcto! de aquí
      if (onSuccessRef.current) onSuccessRef.current(average)
      else setSuccess(true)
    }
  }, [landmarks, isMatch, success, active, confidence])

    // --- Señas con movimiento ---
  // Cuadros de los últimos 1.5 s, momento de la última revisión y confianzas de los aciertos seguidos
  const motionFrames = useRef<Frame[]>([])
  const lastMotionCheck = useRef(0)
  const motionHits = useRef<number[]>([])

  // useEffectEvent: lee siempre los valores más recientes sin volver a ejecutar el efecto
  const checkMotion = useEffectEvent(() => {
    if (!isMotion || success || motionStatus !== 'ready') return

    // Durante la cuenta 3-2-1 no se guarda nada, para que no cuente un movimiento anterior
    if (!active) {
      motionFrames.current = []
      motionHits.current = []
      return
    }
    if (!landmarks) return

    // 1. Guarda el cuadro (se borran solos los de hace más de 1.5 s)
    const now = performance.now()
    addFrame(motionFrames.current, { time: now, landmarks })

    // 2. Solo revisa cada 200 ms, para no trabar el video
    if (now - lastMotionCheck.current < MOTION_CHECK_MS) return
    lastMotionCheck.current = now

    const sequence = buildSequence(motionFrames.current)
    if (!sequence) return
    const result = predictMotion(sequence)

    // 3. Cuenta aciertos seguidos; si falla uno, vuelve a empezar
    if (result && result.label === targetLetter && result.confidence >= MIN_CONFIDENCE) {
      motionHits.current.push(result.confidence)
    } else {
      motionHits.current = []
    }

    // 4. Con 2 aciertos seguidos es correcto. Se vacía todo para que no cuente doble
    if (motionHits.current.length >= MOTION_HITS) {
      const list = motionHits.current
      const average = list.reduce((sum, value) => sum + value, 0) / list.length
      motionFrames.current = []
      motionHits.current = []

      if (onSuccessRef.current) onSuccessRef.current(average)
      else setSuccess(true)
    }
  })

  // Revisa el movimiento cada vez que llegan puntos nuevos o cambia active
  useEffect(() => {
    checkMotion()
  }, [landmarks, active])

  function retry() {
    holdStart.current = null
    holdConfidences.current = [] // NUEVO
    motionFrames.current = []
    motionHits.current = []
    setHoldProgress(0)
    setSuccess(false)
  }
    const canvasRef = useRef<HTMLCanvasElement>(null)

      const [showLandmarks, setShowLandmarks] = useState(true)
        // Guarda siempre la versión más reciente de onLandmarks
  const onLandmarksRef = useRef(onLandmarks)
  useEffect(() => {
    onLandmarksRef.current = onLandmarks
  })

  // Avisa al padre solo cuando llegan puntos nuevos
  useEffect(() => {
    onLandmarksRef.current?.(landmarks)
  }, [landmarks])

  // Dibuja los puntos de la mano cada vez que cambian
  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !video || !ctx) return

    // El canvas usa la resolución real del video (asignar el tamaño también lo limpia)
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    if (!landmarks || !showLandmarks) return

    const width = canvas.width
    const height = canvas.height
    // Ajusta grosores a la resolución (pensados para 1280 px de ancho)
    const scale = width / 1280

    // Líneas entre los puntos (huesos de la mano)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)'
    ctx.lineWidth = 4 * scale
    ctx.lineCap = 'round'
    for (const { start, end } of HandLandmarker.HAND_CONNECTIONS) {
      ctx.beginPath()
      ctx.moveTo(landmarks[start].x * width, landmarks[start].y * height)
      ctx.lineTo(landmarks[end].x * width, landmarks[end].y * height)
      ctx.stroke()
    }

    // Puntos: las puntas de los dedos un poco más grandes
    const fingertips = [4, 8, 12, 16, 20]
    landmarks.forEach((point, index) => {
      const radius = (fingertips.includes(index) ? 9 : 6) * scale
      ctx.beginPath()
      ctx.arc(point.x * width, point.y * height, radius, 0, Math.PI * 2)
      ctx.fillStyle = '#6B8F71'
      ctx.fill()
      ctx.lineWidth = 2 * scale
      ctx.strokeStyle = '#FFFFFF'
      ctx.stroke()
    })
}, [landmarks, videoRef, showLandmarks])

  const modelLabel =
    modelStatus === 'loading'
      ? 'Cargando IA…'
      : modelStatus === 'error'
        ? '✕ No se pudo cargar la IA. Revisa tu conexión y recarga.'
        : landmarks
          ? 'Mano detectada'
          : 'Muestra tu mano'

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-black shadow-lg shadow-primary/10 dark:shadow-black/60">
      {/* -scale-x-100 voltea el video como espejo, para que la mano se mueva hacia donde la mueves */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-full w-full -scale-x-100 object-cover"
      />

            {/* Puntos de la mano encima del video. También va en espejo (-scale-x-100) y no bloquea clics */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full -scale-x-100"
      />

            {/* Barra de progreso: se llena mientras sostienes la seña correcta */}
            {targetLetter && (isMotion ? motionStatus : signStatus) === 'ready' && active && !success && (
        <div className="absolute inset-x-0 bottom-0">
          <p className="mb-2 ml-3 inline-block rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {isMotion
              ? landmarks
                ? 'Haz el movimiento'
                : 'Muestra tu mano'
              : isMatch
                ? '¡Así! Mantenla…'
                : landmarks
                  ? 'Ajusta tu mano'
                  : 'Haz la seña'}
          </p>
                    {/* La barra solo aplica a letras fijas (las de movimiento no se sostienen) */}
          {!isMotion && (
            <div className="h-2 bg-black/40">
              <div className="h-full bg-contrast" style={{ width: `${holdProgress * 100}%` }} />
            </div>
          )}
        </div>
      )}

      {/* Mensaje de éxito encima del video */}
      {success && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/60">
          <p className="rounded-2xl bg-contrast px-6 py-3 text-3xl font-extrabold text-black">
            ¡Correcto! ✓
          </p>
          <button
            type="button"
            onClick={retry}
            className="cursor-pointer rounded-xl bg-white px-5 py-2 font-bold text-black transition hover:bg-white/80"
          >
            Practicar otra vez
          </button>
        </div>
      )}

      {/* Estado de la IA, en la esquina superior izquierda (solo cuando la cámara ya está abierta) */}
      {status === 'ready' && (
        <p
          role={modelStatus === 'error' ? 'alert' : 'status'}
          className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
        >
          <span
            className={`h-2 w-2 rounded-full ${
              landmarks ? 'bg-contrast' : modelStatus === 'loading' ? 'animate-pulse bg-white' : 'bg-white/40'
            }`}
          />
          {modelLabel}
        </p>
      )}

            {/* Botón para mostrar u ocultar los puntos, en la esquina superior derecha */}
      {status === 'ready' && modelStatus === 'ready' && (
        <button
          type="button"
          onClick={() => setShowLandmarks((previous) => !previous)}
          aria-pressed={showLandmarks}
          className="absolute right-3 top-3 flex cursor-pointer items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-black/80"
        >
          <span className={`h-2 w-2 rounded-full ${showLandmarks ? 'bg-contrast' : 'bg-white/40'}`} />
          {showLandmarks ? 'Ocultar puntos' : 'Mostrar puntos'}
        </button>
      )}

      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm font-medium text-white/70">Abriendo cámara…</p>
        </div>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <p
            role="alert"
            className="max-w-md rounded-lg border-l-4 border-white bg-white/10 px-4 py-3 text-sm font-medium text-white"
          >
            ✕ {errorMessage}
          </p>
        </div>
      )}
    </div>
  )
}

export default CameraView
