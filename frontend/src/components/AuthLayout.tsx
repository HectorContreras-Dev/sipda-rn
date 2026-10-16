import type { ReactNode } from 'react'
import logo from '../assets/LOGO-SIPDA.png'

function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen dark:bg-primary/50">
            <aside className="hidden flex-1 flex-col items-center justify-center bg-primary p-12 text-white dark:bg-primary/25 lg:flex">
                <div className="flex max-w-lg flex-col items-center text-center">
                    <div className="mb-10 rounded-2xl bg-white p-3 shadow-lg">
                        <img src={logo} alt="SIPDA-RN" className="w-40" />
                    </div>

                    <div className="mb-6 h-1.5 w-16 rounded-full bg-contrast" />
                    <h2 className="text-5xl font-extrabold leading-tight">
                        Aprende el abecedario de la Lengua de Señas Mexicana
                    </h2>
                    <p className="mt-4 text-lg opacity-90">
                        Practica frente a tu cámara y aprende con nosotros.
                    </p>

                    <ul className="mt-10 space-y-4 text-left font-medium">
                        <li className="flex items-center gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-contrast text-sm font-bold text-black">✓</span>
                            Explicación de cada seña, letra por letra
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-contrast text-sm font-bold text-black">✓</span>
                            Reconocimiento de tu mano con inteligencia artificial
                        </li>
                    </ul>
                </div>
            </aside>

            <div className="flex flex-1 flex-col bg-secondary/25 dark:bg-black">
                <main className="flex flex-1 flex-col items-center justify-center px-4 py-10">
                    <img
                        src={logo}
                        alt="SIPDA-RN"
                        className="mb-8 w-36 lg:hidden dark:rounded-2xl dark:bg-white dark:p-2"
                    />
                    {children}
                </main>
                <footer className="py-6 text-center text-sm text-black/70 dark:text-white/60">
                    © 2026 SIPDA-RN. Todos los derechos reservados.
                </footer>
            </div>
        </div>
    )
}

export default AuthLayout