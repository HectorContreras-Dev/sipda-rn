import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import AttemptsCard from '../components/AttemptsCard'
import { API_URL } from '../config'
import DangerZone from '../components/DangerZone'
import { useProgress } from '../hooks/useProgress'
import { letters } from '../data/letters'

interface User {
  id: number
  name: string
  last_name: string
  email: string
  created_at: string
  role: string
}

const stats = ['Letras completadas', 'Intentos totales', 'Precisión promedio']

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState('')
    // Progreso del modo prueba (null mientras carga)
    // Progreso del modo prueba (null mientras carga). Al cambiar progressKey se vuelve a pedir
  const [progressKey, setProgressKey] = useState(0)
  const progress = useProgress(progressKey)

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('token')

      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })

                // 401 = sesión inválida · 403 = cuenta bloqueada
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token')
          navigate('/login', { replace: true })
          return
        }

        const data = await response.json()
        setUser(data.user)
      } catch {
        setError('No se pudo cargar tu perfil. Intenta más tarde.')
      }
    }

    loadUser()
  }, [navigate])

    const memberSince = user
    ? new Date(user.created_at).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })
    : ''

  // Nombre completo: nombre(s) + apellidos
  const fullName = user ? `${user.name} ${user.last_name}`.trim() : ''

  return (
        <AppLayout userName={fullName || undefined} isAdmin={user?.role === 'admin'}>
      <Link
        to="/home"
        className="mb-6 inline-flex items-center gap-2 rounded-xl px-4 py-2 font-bold text-primary transition hover:bg-secondary/20"
      >
        ← Al inicio
      </Link>

      {error && (
        <p
          role="alert"
          className="rounded-lg border-l-4 border-black bg-black/5 px-4 py-3 text-sm font-medium text-black dark:border-white dark:bg-white/10 dark:text-white"
        >
          ✕ {error}
        </p>
      )}

      {!user && !error && (
        <p className="py-10 text-center text-black/60 dark:text-white/60">Cargando perfil…</p>
      )}

      {user && (
        <>
          {/* Encabezado del perfil */}
          <section className="rounded-3xl bg-primary p-8 text-white shadow-2xl shadow-primary/20 dark:bg-primary/25 sm:p-10">
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-contrast text-3xl font-extrabold text-black">
                {getInitials(fullName)}
              </div>

              <div className="text-center sm:text-left">
                <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-contrast sm:mx-0" />
                <h1 className="text-3xl font-extrabold">{fullName}</h1>
                <p className="mt-1 opacity-90">{user.email}</p>
                <p className="mt-1 text-sm opacity-75">Miembro desde {memberSince}</p>
              </div>
            </div>
          </section>

          {/* Progreso (pendiente de la Fase 6) */}
          <section className="mt-10">
            <h2 className="text-2xl font-extrabold text-black dark:text-white">Tu progreso</h2>

            <div className="mt-5 grid items-start gap-4 sm:grid-cols-3">
            {stats.map((label) =>
                label === 'Intentos totales' ? (
                  <AttemptsCard key={label} items={progress?.letters ?? []} />
                ) : (
                  <div
                    key={label}
                    className="rounded-3xl border border-secondary/40 bg-white p-6 shadow-lg shadow-primary/10 dark:bg-primary/10 dark:shadow-black/60"
                  >
                                        <p className="text-4xl font-extrabold text-primary">
                      {label === 'Letras completadas'
                        ? `${progress?.completed_letter_ids.length ?? 0}/${letters.length}`
                        : progress?.accuracy != null
                          ? `${progress.accuracy}%`
                          : '—'}
                    </p>
                    <p className="mt-2 font-semibold text-black dark:text-white">{label}</p>
                    <p className="mt-1 text-xs text-black/50 dark:text-white/50">
                      {label === 'Letras completadas' ? 'Correctas en el modo prueba' : 'Intentos correctos'}
                    </p>
                  </div>
                )
              )}
            </div>
          </section>
         <DangerZone onProgressReset={() => setProgressKey((previous) => previous + 1)} />
        </>
      )}
    </AppLayout>
  )
}

export default ProfilePage