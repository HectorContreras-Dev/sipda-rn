import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom' // import { useNavigate } from 'react-router-dom' // Importa useNavigate para redirigir después del inicio de sesión

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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8">
        <h1 className="mb-6 text-3xl font-extrabold text-text">Iniciar sesión</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-text placeholder:text-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-text placeholder:text-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg bg-primary px-4 py-2
             font-semibold text-contrast
             hover:bg-secondary
             transition-colors duration-200"
          >
            Iniciar sesión
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm text-danger">{message}</p>}
      </div>
    </div>
  )
}

export default LoginPage