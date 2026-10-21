# SIPDA-RN · Frontend

Interfaz web de SIPDA-RN, una app para aprender el abecedario de la Lengua de Señas Mexicana (LSM)
practicando frente a la cámara.

Hecho con React 19, Vite, TypeScript, React Router 7 y Tailwind CSS v4.

## Cómo correrlo

```bash
npm install
npm run dev
```

El backend debe estar corriendo (por defecto en `http://localhost:3000`).
Si está en otra dirección, copia `.env.example` como `.env.local` y cambia `VITE_API_URL`.

## Scripts

- `npm run dev`: servidor de desarrollo
- `npm run build`: revisa tipos y genera la versión de producción en `dist/`
- `npm run lint`: revisa el código con ESLint
