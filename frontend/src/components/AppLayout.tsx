import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/LOGO-SIPDA.png'

// fullScreen: para la práctica con cámara. Más ancho y, en pantallas grandes,
// la página mide exactamente el alto de la ventana (sin scroll)
function AppLayout({ children, userName, fullScreen = false }: { children: ReactNode; userName?: string; fullScreen?: boolean }) {
  const navigate = useNavigate()
  const maxWidth = fullScreen ? 'max-w-[1600px]' : 'max-w-6xl'
  const nameParts = userName?.split(' ') ?? []
  const firstName = nameParts[0]
  const restOfName = nameParts.slice(1).join(' ')
  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/login', { replace: true })
  }

  return (
    <div className={`flex min-h-screen flex-col bg-secondary/25 dark:bg-black ${fullScreen ? 'lg:h-dvh' : ''}`}>
      <header className="group border-b border-secondary/40 bg-white dark:bg-primary/10">
        <div className={`mx-auto flex ${maxWidth} items-center justify-between px-4 py-3`}>
          <Link to="/home" aria-label="Ir al inicio">
            <img
              src={logo}
              alt="SIPDA-RN"
              className="w-20 dark:rounded-xl dark:bg-white dark:p-1"
            />
          </Link>

          <div className="flex items-center gap-4">
            {userName && (
              <div className="group flex items-center text-sm font-semibold text-black dark:text-white">
                <span>{firstName}</span>
                {restOfName && (
                  <span className="hidden max-w-0 overflow-hidden text-ellipsis whitespace-nowrap opacity-0 transition-all duration-1000 ease-out group-hover:max-w-md group-hover:opacity-100 motion-reduce:transition-none sm:inline-block">
                    &nbsp;{restOfName}
                  </span>
                )}
              </div>
            )}
            <Link
              to="/profile"
              className="rounded-xl bg-contrast px-4 py-2 text-sm font-bold text-black shadow-md shadow-contrast/40 transition hover:bg-contrast/80 hover:text-white"
            >
              Perfil
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="cursor-pointer rounded-xl border-2 border-primary px-4 py-2 text-sm font-bold text-primary transition hover:bg-primary hover:text-white dark:hover:text-black"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main
        className={`mx-auto w-full ${maxWidth} flex-1 px-4 ${
          fullScreen ? 'flex flex-col py-4 lg:min-h-0' : 'py-8'
        }`}
      >
        {children}
      </main>

      {/* En fullScreen el footer es más compacto para que quepa sin scroll */}
      <footer
        className={`text-center text-black/70 dark:text-white/60 ${
          fullScreen ? 'py-2 text-xs' : 'py-6 text-sm'
        }`}
      >
        © 2026 SIPDA-RN. Todos los derechos reservados.
      </footer>
    </div>
  )
}

export default AppLayout