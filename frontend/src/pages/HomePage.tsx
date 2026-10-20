import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import LetterGrid from '../components/LetterGrid'

interface User {
  id: number
  name: string
  email: string
}

const steps = [
  { title: 'Elige una letra', text: 'Revisa la explicación de cómo se forma la seña.' },
  { title: 'Activa tu cámara', text: 'Coloca tu mano frente a la cámara con buena luz.' },
  { title: 'Practica la seña', text: 'La inteligencia artificial te dice si la hiciste bien.' },
]

function HomePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('token')

      try {
        const response = await fetch('http://localhost:3000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.status === 401) {
          localStorage.removeItem('token')
          navigate('/login', { replace: true })
          return
        }

        const data = await response.json()
        setUser(data.user)
      } catch {
        // Si el servidor está apagado, la página se muestra sin el nombre
      }
    }

    loadUser()
  }, [navigate])

  const firstName = user?.name.split(' ')[0]

  return (
    <AppLayout userName={user?.name}>
      {/* Bienvenida */}
      <section className="rounded-3xl bg-primary p-8 text-white shadow-2xl shadow-primary/20 dark:bg-primary/25 sm:p-10">
        <div className="mb-6 h-1.5 w-16 rounded-full bg-contrast" />
        <h1 className="text-3xl font-extrabold sm:text-4xl">
          ¡Hola{firstName ? `, ${firstName}` : ''}! 👋
        </h1>
        <p className="mt-3 max-w-xl text-lg opacity-90">
          Sigue aprendiendo el abecedario de la Lengua de Señas Mexicana.
        </p>
      </section>

      {/* Cómo funciona */}
      <section className="mt-10">
        <h2 className="text-2xl font-extrabold text-black dark:text-white">¿Cómo funciona?</h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-3xl border border-secondary/40 bg-white p-6 shadow-lg shadow-primary/10 dark:bg-primary/10 dark:shadow-black/60"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-contrast font-bold text-black">
                {index + 1}
              </span>
              <h3 className="mt-4 font-bold text-black dark:text-white">{step.title}</h3>
              <p className="mt-1 text-sm text-black/70 dark:text-white/70">{step.text}</p>
            </div>
          ))}
        </div>
      </section>
      <LetterGrid />

      {/* Aviso de privacidad */}
      <p className="mt-10 rounded-lg border-l-4 border-contrast bg-contrast/15 px-4 py-3 text-sm font-medium text-black dark:text-white">
        🔒 Tu cámara se procesa en tu navegador. No se envia ningun video fuera de este dispositivo.
      </p>
    </AppLayout>
  )
}

export default HomePage