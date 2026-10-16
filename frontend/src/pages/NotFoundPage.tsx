import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/25 px-4 text-center dark:bg-black">
      <p className="text-8xl font-extrabold text-primary">404</p>
      <h1 className="mt-4 text-3xl font-extrabold text-black dark:text-white">
        Página no encontrada
      </h1>
      <p className="mt-2 text-black/70 dark:text-white/70">
        La dirección que buscas no existe.
      </p>
      <Link
        to="/home"
        className="mt-8 rounded-xl bg-contrast px-6 py-3 font-bold text-black shadow-md shadow-contrast/40 transition hover:bg-contrast/80 hover:text-white dark:hover:text-white"
      >
        Ir al inicio
      </Link>
    </div>
  )
}

export default NotFoundPage