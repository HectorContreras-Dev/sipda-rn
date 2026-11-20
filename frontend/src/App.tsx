import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import ProtectedRoute from './components/ProtectedRoute'
import NotFoundPage from './pages/NotFoundPage'
import ProfilePage from './pages/ProfilePage'
import PracticePage from './pages/PracticePage'
import CapturePage from './pages/CapturePage'
import TrainPage from './pages/TrainPage'
import AttemptPage from './pages/AttemptPage'

function App() {
  return (
    <Routes>
      {/* Sin sesión, ProtectedRoute manda a /login */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={ <ProtectedRoute> <HomePage /></ProtectedRoute>}/>
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      {/* Solo existe en desarrollo (npm run dev), no en producción */}
      {import.meta.env.DEV && <Route path="/capture" element={<CapturePage />} />}
      {import.meta.env.DEV && <Route path="/train" element={<TrainPage />} />}
      {/* :letter es un parámetro: /practice/A, /practice/B... */}
      <Route
        path="/practice/:letter"
        element={
          <ProtectedRoute>
            <PracticePage />
          </ProtectedRoute>
        }
      />
      {/* Modo intento: /intento/A, /intento/B... */}
      <Route
        path="/intento/:letter"
        element={
          <ProtectedRoute>
            <AttemptPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App