import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { API_URL } from '../config'

interface AdminUser {
  id: number
  name: string
  last_name: string
  email: string
  role: 'user' | 'admin'
  blocked_at: string | null
  created_at: string
  attempts: number
}

function AdminPage() {
  // checking: preguntando al backend · allowed: es admin · denied: no es admin o no hay sesión
  const [access, setAccess] = useState<'checking' | 'allowed' | 'denied'>('checking')
  const [users, setUsers] = useState<AdminUser[]>([])
  const [search, setSearch] = useState('')
  // Resultado de la última acción: '✓ ...' o '✕ ...'
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch(`${API_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        // 401 o 403: no hay sesión o no es admin
        if (!response.ok) {
          setAccess('denied')
          return
        }
        const data = await response.json()
        setUsers(data.users)
        setAccess('allowed')
      } catch {
        setAccess('denied')
      }
    }
    loadUsers()
  }, [])

  // Hace una petición a /api/admin. Si el backend responde con error, lanza su mensaje
  async function adminRequest(path: string, method: 'PATCH' | 'DELETE', body?: object) {
    const response = await fetch(`${API_URL}/api/admin${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.error ?? 'No se pudo completar la acción.')
    }
    // 204 = todo bien, pero sin datos que leer
    return response.status === 204 ? null : response.json()
  }

  async function toggleBlock(user: AdminUser) {
    const block = !user.blocked_at
    if (!confirm(`¿${block ? 'Bloquear' : 'Desbloquear'} a ${user.email}?`)) return
    try {
      const data = await adminRequest(`/users/${user.id}/block`, 'PATCH', { blocked: block })
      // Actualiza solo ese usuario en la lista, sin volver a pedirla
      setUsers((previous) =>
        previous.map((item) => (item.id === user.id ? { ...item, blocked_at: data.blocked_at } : item)),
      )
      setMessage(`✓ ${user.email} ${block ? 'bloqueado' : 'desbloqueado'}.`)
    } catch (error) {
      setMessage(`✕ ${(error as Error).message}`)
    }
  }

  async function resetProgress(user: AdminUser) {
    if (!confirm(`¿Borrar todo el progreso de ${user.email}? La cuenta se conserva. No se puede deshacer.`)) return
    try {
      await adminRequest(`/users/${user.id}/progress`, 'DELETE')
      setUsers((previous) => previous.map((item) => (item.id === user.id ? { ...item, attempts: 0 } : item)))
      setMessage(`✓ Se borró el progreso de ${user.email}.`)
    } catch (error) {
      setMessage(`✕ ${(error as Error).message}`)
    }
  }

  async function deleteUser(user: AdminUser) {
    if (!confirm(`¿Eliminar la cuenta de ${user.email} y todo su progreso? No se puede deshacer.`)) return
    try {
      await adminRequest(`/users/${user.id}`, 'DELETE')
      setUsers((previous) => previous.filter((item) => item.id !== user.id))
      setMessage(`✓ Se eliminó la cuenta de ${user.email}.`)
    } catch (error) {
      setMessage(`✕ ${(error as Error).message}`)
    }
  }

  // El backend dijo que no: de regreso al inicio
  if (access === 'denied') return <Navigate to="/home" replace />

  // Búsqueda por nombre, apellidos o correo (sin importar mayúsculas)
  const query = search.trim().toLowerCase()
  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.last_name} ${user.email}`.toLowerCase().includes(query),
  )

  return (
    <AppLayout>
      {access === 'checking' ? (
        <p className="py-10 text-center text-black/60 dark:text-white/60">Verificando permisos…</p>
      ) : (
        <>
                  <Link
            to="/home"
            className="mb-6 inline-flex items-center gap-2 rounded-xl px-4 py-2 font-bold text-primary transition hover:bg-secondary/20"
          >
            ← Al inicio
          </Link>
          <h1 className="text-3xl font-extrabold text-black dark:text-white">Administración</h1>

          <section className="mt-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-black dark:text-white">Usuarios</h2>
                <p className="text-sm text-black/60 dark:text-white/60">
                  {filteredUsers.length} de {users.length} usuarios
                </p>
              </div>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre o correo"
                className="w-full rounded-xl border border-secondary/40 px-4 py-2 sm:w-72"
              />
            </div>

            {message && (
              <p role="status" className="mt-4 font-semibold text-black dark:text-white">
                {message}
              </p>
            )}

            {/* overflow-x-auto: en pantallas chicas la tabla se desliza de lado */}
            <div className="mt-4 overflow-x-auto rounded-3xl border border-secondary/40 bg-white shadow-lg shadow-primary/10 dark:bg-primary/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary/20 text-black dark:text-white">
                  <tr>
                    <th className="px-4 py-3 font-bold">Nombre</th>
                    <th className="px-4 py-3 font-bold">Correo</th>
                    <th className="px-4 py-3 font-bold">Registro</th>
                    <th className="px-4 py-3 font-bold">Rol</th>
                    <th className="px-4 py-3 font-bold">Estado</th>
                    <th className="px-4 py-3 text-right font-bold">Intentos</th>
                    <th className="px-4 py-3 text-right font-bold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-t border-secondary/20 text-black dark:text-white">
                      <td className="px-4 py-3 font-semibold">
                        {`${user.name} ${user.last_name}`.trim()}
                      </td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">
                        {new Date(user.created_at).toLocaleDateString('es-MX')}
                      </td>
                      <td className="px-4 py-3">
                        {user.role === 'admin' ? (
                          <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">Admin</span>
                        ) : (
                          'Usuario'
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {user.blocked_at ? (
                          <span className="rounded-full bg-black px-3 py-1 text-xs font-bold text-white dark:bg-white dark:text-black">
                            Bloqueado
                          </span>
                        ) : (
                          <span className="rounded-full bg-contrast/30 px-3 py-1 text-xs font-bold">Activo</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">{user.attempts}</td>
                      <td className="px-4 py-3">
                        {/* A los admins (incluido tú) no se les puede hacer nada */}
                        {user.role === 'admin' ? (
                          <span className="block text-right text-black/40 dark:text-white/40">—</span>
                        ) : (
                          <div className="flex justify-end gap-2 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => toggleBlock(user)}
                              className="cursor-pointer rounded-lg border border-primary px-3 py-1 text-xs font-bold text-primary transition hover:bg-primary hover:text-white"
                            >
                              {user.blocked_at ? 'Desbloquear' : 'Bloquear'}
                            </button>
                            <button
                              type="button"
                              onClick={() => resetProgress(user)}
                              disabled={user.attempts === 0}
                              className="cursor-pointer rounded-lg border border-primary px-3 py-1 text-xs font-bold text-primary transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-primary"
                            >
                              Borrar progreso
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteUser(user)}
                              className="cursor-pointer rounded-lg bg-black px-3 py-1 text-xs font-bold text-white transition hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-white/70"
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <p className="px-4 py-6 text-center text-black/60 dark:text-white/60">
                  No hay usuarios que coincidan con la búsqueda.
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </AppLayout>
  )
}

export default AdminPage