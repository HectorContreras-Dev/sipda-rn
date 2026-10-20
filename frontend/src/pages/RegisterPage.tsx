import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'


function RegisterPage() {

  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (name.trim().length < 2 || lastName.trim().length < 2) {
      setMessage('Escribe tu nombre y apellidos (mínimo 2 letras cada uno).')
      setIsSuccess(false)
      return
    }
    setMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `${name.trim()} ${lastName.trim()}`, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Cuenta creada correctamente')
        setIsSuccess(true)
      } else {
        setMessage(data.error)
        setIsSuccess(false)
      }
    } catch {
      setMessage('No se pudo conectar con el servidor. Intenta más tarde.')
      setIsSuccess(false)
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
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-semibold text-black dark:text-white">
              Nombre(s):
            </label>
            <input
              id="name"
              type="text"
              required
              minLength={2}
              maxLength={40}
              autoComplete="given-name"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-secondary/50 bg-white px-4 py-3 text-black placeholder:text-black/40 focus:border-contrast focus:outline-none focus:ring-4 focus:ring-contrast/20 dark:bg-black/40 dark:text-white dark:placeholder:text-white/50"
            />
            <p className="text-xs text-black/60 dark:text-white/60">Mínimo 2 caracteres.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="lastName" className="text-sm font-semibold text-black dark:text-white">
              Apellidos:
            </label>
            <input
              id="lastName"
              type="text"
              required
              minLength={2}
              maxLength={50}
              autoComplete="family-name"
              placeholder="Tus apellidos"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-xl border border-secondary/50 bg-white px-4 py-3 text-black placeholder:text-black/40 focus:border-contrast focus:outline-none focus:ring-4 focus:ring-contrast/20 dark:bg-black/40 dark:text-white dark:placeholder:text-white/50"
            />
            <p className="text-xs text-black/60 dark:text-white/60">Mínimo 2 caracteres.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-black dark:text-white">
              Correo Electronico:
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-secondary/50 bg-white px-4 py-3 text-black placeholder:text-black/40 focus:border-contrast focus:outline-none focus:ring-4 focus:ring-contrast/20 dark:bg-black/40 dark:text-white dark:placeholder:text-white/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-semibold text-black dark:text-white">
              Contraseña:
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-secondary/50 bg-white px-4 py-3 text-black placeholder:text-black/40 focus:border-contrast focus:outline-none focus:ring-4 focus:ring-contrast/20 dark:bg-black/40 dark:text-white dark:placeholder:text-white/50"
            />
            <p className="text-xs text-black/60 dark:text-white/60">Mínimo 6 caracteres.</p>
          </div>

          <button
            type="submit"
            className="mt-1 w-full cursor-pointer rounded-xl bg-contrast px-4 py-3 font-bold text-black shadow-md shadow-contrast/40 transition hover:bg-contrast/80 hover:text-white active:scale-[0.98] dark:hover:text-white"
          >
            {isLoading ? 'Creando cuenta…' : 'Registrarme'}
          </button>
        </form>

        {message && (
          <p
            role="alert"
            className={`mt-5 rounded-lg border-l-4 px-4 py-3 text-sm font-medium ${
              isSuccess
                ? 'border-contrast bg-contrast/15 text-black dark:text-white'
                : 'border-black bg-black/5 text-black dark:border-white dark:bg-white/10 dark:text-white'
            }`}
          >
            {isSuccess ? '✓' : '✕'} {message}
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