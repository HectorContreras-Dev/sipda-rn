import { useEffect, useRef, useState } from 'react'

export type CameraStatus = 'loading' | 'ready' | 'error'

// Traduce los errores del navegador a mensajes para el usuario
function getErrorMessage(error: unknown) {
  if (error instanceof DOMException) {
    if (error.name === 'NotAllowedError') {
      return 'Bloqueaste el permiso de la cámara. Actívalo desde el candado de la barra de direcciones y recarga la página.'
    }
    if (error.name === 'NotFoundError') {
      return 'No encontramos ninguna cámara conectada.'
    }
    if (error.name === 'NotReadableError') {
      return 'Otra aplicación está usando la cámara. Ciérrala e intenta de nuevo.'
    }
  }
  return 'No se pudo abrir la cámara. Intenta de nuevo.'
}

// Abre la cámara frontal y la conecta al <video> que reciba videoRef.
// La cámara se apaga sola al salir de la página.
export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState<CameraStatus>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let stream: MediaStream | null = null
    // Si el componente se desmonta antes de que el usuario acepte el permiso
    let cancelled = false

    async function startCamera() {
      try {
        // mediaDevices no existe en navegadores viejos ni en páginas sin HTTPS
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Navegador sin soporte de cámara')
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        })

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setStatus('ready')
      } catch (error) {
        if (cancelled) return
        setErrorMessage(getErrorMessage(error))
        setStatus('error')
      }
    }

    startCamera()

    // Limpieza: apaga la cámara (y su luz) al salir de la página
    return () => {
      cancelled = true
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  return { videoRef, status, errorMessage }
}
