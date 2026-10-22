import { useCamera } from '../hooks/useCamera'
import { useHandLandmarker } from '../hooks/useHandLandmarker'
import { useHandDetection } from '../hooks/useHandDetection'

function CameraView() {
  const { videoRef, status, errorMessage } = useCamera()
  const { handLandmarker, status: modelStatus } = useHandLandmarker()
  // 21 puntos de la mano en cada cuadro (null si no hay mano)
  const landmarks = useHandDetection(videoRef, handLandmarker)

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

      {/* Aquí va el canvas de Saul para dibujar los landmarks (usa `landmarks`) */}

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
