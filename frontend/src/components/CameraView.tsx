import { useCamera } from '../hooks/useCamera'

function CameraView() {
  const { videoRef, status, errorMessage } = useCamera()

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
