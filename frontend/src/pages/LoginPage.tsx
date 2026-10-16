import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'


function LoginPage() {

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()
    if (response.ok) {
      localStorage.setItem('token', data.token)
      navigate('/home')
    } else {
      setMessage(data.error)
    }
  }


  return (
    <AuthLayout>
      <div className="w-full max-w-md rounded-3xl border border-secondary/40  bg-white p-8 shadow-2xl shadow-primary/20 dark:bg-primary/10 dark:shadow-black/60 sm:p-10" >
        <h1 className="text-3xl font-extrabold text-black dark:text-white text-center">Iniciar sesión</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-black dark:text-white">
              Correo
            </label>
            <input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-secondary/50 bg-white px-4 py-3 text-black placeholder:text-black/40 focus:border-contrast focus:outline-none focus:ring-4 focus:ring-contrast/20 dark:bg-black/40 dark:text-white dark:placeholder:text-white/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-semibold text-black dark:text-white">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-secondary/50 bg-white px-4 py-3 text-black placeholder:text-black/40 focus:border-contrast focus:outline-none focus:ring-4 focus:ring-contrast/20 dark:bg-black/40 dark:text-white dark:placeholder:text-white/50"
            />
          </div>

          <button
            type="submit"
            className="mt-1 w-full cursor-pointer rounded-xl bg-contrast px-4 py-3 font-bold text-black shadow-md shadow-contrast/40 transition hover:bg-contrast/80 hover:text-white active:scale-[0.98] dark:hover:text-white"
          >
            Iniciar sesión
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
          <span className="text-sm text-black/60 dark:text-white/60">¿Aún no tienes cuenta?</span>
          <span className="h-px flex-1 bg-secondary/40" />
        </div>

        <Link
          to="/register"
          className="block w-full rounded-xl border-2 border-primary px-4 py-3 text-center font-bold text-primary transition hover:bg-primary hover:text-white dark:hover:text-black"
        >
          Registrarme
        </Link>
      </div>
    </AuthLayout>
  )
}


export default LoginPage