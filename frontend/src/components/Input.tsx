import type { InputHTMLAttributes } from 'react'

// Campo de formulario con etiqueta y texto de ayuda opcional.
// Acepta cualquier prop normal de <input> (type, value, onChange, required...)
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  hint?: string
}

function Input({ id, label, hint, ...inputProps }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-black dark:text-white">
        {label}
      </label>
      <input
        id={id}
        {...inputProps}
        className="w-full rounded-xl border border-secondary/50 bg-white px-4 py-3 text-black placeholder:text-black/40 focus:border-contrast focus:outline-none focus:ring-4 focus:ring-contrast/20 dark:bg-black/40 dark:text-white dark:placeholder:text-white/50"
      />
      {hint && <p className="text-xs text-black/60 dark:text-white/60">{hint}</p>}
    </div>
  )
}

export default Input
