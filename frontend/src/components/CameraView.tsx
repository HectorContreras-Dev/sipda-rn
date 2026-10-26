import { useCamera } from '../hooks/useCamera'
import { useHandLandmarker } from '../hooks/useHandLandmarker'
import { useHandDetection } from '../hooks/useHandDetection'
import { useEffect, useRef, useState } from 'react'
import { HandLandmarker } from '@mediapipe/tasks-vision'

function CameraView() {
  const { videoRef, status, errorMessage } = useCamera()
  const { handLandmarker, status: modelStatus } = useHandLandmarker()
  // 21 puntos de la mano en cada cuadro (null si no hay mano)
  const landmarks = useHandDetection(videoRef, handLandmarker)

    const canvasRef = useRef<HTMLCanvasElement>(null)

      const [showLandmarks, setShowLandmarks] = useState(true)

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
