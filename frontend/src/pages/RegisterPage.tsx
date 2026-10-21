import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import Input from '../components/Input'
import { API_URL } from '../config'


function RegisterPage() {

  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (name.trim().length < 2 || lastName.trim().length < 2) {
      setMessage('Escribe tu nombre y apellidos (mínimo 2 letras cada uno).')
      return
    }
    setMessage('')
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `${name.trim()} ${lastName.trim()}`, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Al registrarse se inicia sesión directamente
        localStorage.setItem('token', data.token)
        navigate('/home')
      } else {
        setMessage(data.error)
      }
    } catch {
      setMessage('No se pudo conectar con el servidor. Intenta más tarde.')
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <AuthLayout>
      <div className="w-full max-w-md rounded-3xl border border-secondary/40 bg-white p-8 shadow-2xl shadow-primary/20 dark:bg-primary/10 dark:shadow-black/60 sm:p-10">
        <h1 className="text-3xl font-extrabold text-black dark:text-white text-center">Crea tu cuenta</h1>
        <p className="mb-8 mt-2 text-black/60 dark:text-white/60 text-center">Regístrate para empezar a practicar.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            id="name"
            label="Nombre(s):"
            hint="Mínimo 2 caracteres."
            type="text"
            required
            minLength={2}
            maxLength={40}
            autoComplete="given-name"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            id="lastName"
            label="Apellidos:"
            hint="Mínimo 2 caracteres."
            type="text"
            required
            minLength={2}
            maxLength={50}
            autoComplete="family-name"
            placeholder="Tus apellidos"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <Input
            id="email"
            label="Correo Electronico:"
            type="email"
            required
            autoComplete="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            id="password"
            label="Contraseña:"
            hint="Mínimo 6 caracteres."
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Deshabilitado mientras carga para evitar doble envío */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-1 w-full cursor-pointer rounded-xl bg-contrast px-4 py-3 font-bold text-black shadow-md shadow-contrast/40 transition hover:bg-contrast/80 hover:text-white active:scale-[0.98] dark:hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Creando cuenta…' : 'Registrarme'}
          </button>
        </form>

        {message && (
          <p
            role="alert"
            className="mt-5 rounded-lg border-l-4 border-black bg-black/5 px-4 py-3 text-sm font-medium text-black dark:border-white dark:bg-white/10 dark:text-white"
          >
            ✕ {message}
          </p>
        )}

        <div className="my-8 flex items-center gap-4">
          <span className="h-px flex-1 bg-secondary/40" />
          <span className="text-sm text-black/60 dark:text-white/60">¿Ya tienes cuenta?</span>
          <span className="h-px flex-1 bg-secondary/40" />
        </div>

        <Link
          to="/login"
          className="block w-full rounded-xl border-2 border-primary px-4 py-3 text-center font-bold text-primary transition hover:bg-primary hover:text-white dark:hover:text-black"
        >
          Iniciar sesión
        </Link>
      </div>
    </AuthLayout>
  )
}


export default RegisterPage
