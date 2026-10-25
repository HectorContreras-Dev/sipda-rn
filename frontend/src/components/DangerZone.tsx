import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from './Input'
import { API_URL } from '../config'

// Zona de peligro del perfil: borrar progreso (pendiente) y eliminar cuenta
function DangerZone() {
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  function cancel() {
    setConfirming(false)
    setPassword('')
    setError('')
  }

  async function handleDelete(event: FormEvent) {
    event.preventDefault()
    setError('')
    setDeleting(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ password }),
      })

      // 204 = cuenta eliminada: se borra el token y se manda al login
      if (response.status === 204) {
        localStorage.removeItem('token')
        navigate('/login', { replace: true })
        return
      }

      const data = await response.json()
      setError(data.error ?? 'No se pudo eliminar la cuenta.')
    } catch {
      setError('No se pudo conectar con el servidor. Intenta más tarde.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section className="mt-10 rounded-3xl border border-secondary/40 bg-white p-6 shadow-lg shadow-primary/10 dark:bg-primary/10 dark:shadow-black/60">
      <h2 className="text-xl font-extrabold text-black dark:text-white">Progreso y cuenta</h2>

      {/* Borrar progreso: pendiente hasta que existan los endpoints de progreso (Fase 6) */}
      <div className="mt-5 flex flex-col gap-3 border-t border-secondary/30 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-black dark:text-white">Borrar progreso</p>
          <p className="text-sm text-black/60 dark:text-white/60">
            Reinicia tus intentos y letras completadas. Tu cuenta se conserva.
          </p>
        </div>
        <button
          type="button"
          disabled
          className="shrink-0 cursor-not-allowed rounded-xl border-2 border-black/20 px-4 py-2 text-sm font-bold text-black/40 dark:border-white/20 dark:text-white/40"
        >
          Próximamente
        </button>
      </div>

      {/* Eliminar cuenta */}
      <div className="mt-5 border-t border-secondary/30 pt-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-black dark:text-white">Eliminar cuenta</p>
            <p className="text-sm text-black/60 dark:text-white/60">
              Se borran tu cuenta y todo tu progreso. No se puede deshacer.
            </p>
          </div>
          {!confirming && (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="shrink-0 cursor-pointer rounded-xl border-2 border-red-700 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-700 hover:text-white dark:border-red-400 dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-black"
            >
              Eliminar cuenta
            </button>
          )}
        </div>

        {/* Confirmación: pide la contraseña antes de borrar */}
        {confirming && (
          <form onSubmit={handleDelete} className="mt-5 flex flex-col gap-4 rounded-2xl bg-red-700/5 p-5 dark:bg-red-400/10">
            <Input
              id="delete-password"
              label="Escribe tu contraseña para confirmar"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoFocus
            />

            {error && (
              <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">
                ✕ {error}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={deleting || !password}
                className="cursor-pointer rounded-xl bg-red-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-400 dark:text-black dark:hover:bg-red-300"
              >
                {deleting ? 'Eliminando…' : 'Sí, eliminar mi cuenta'}
              </button>
              <button
                type="button"
                onClick={cancel}
                className="cursor-pointer rounded-xl px-4 py-2 text-sm font-bold text-black transition hover:bg-secondary/20 dark:text-white"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

export default DangerZone