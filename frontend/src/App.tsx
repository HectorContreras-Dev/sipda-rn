import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import ProtectedRoute from './components/ProtectedRoute'
import NotFoundPage from './pages/NotFoundPage'
import ProfilePage from './pages/ProfilePage'
import PracticePage from './pages/PracticePage'

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
      {/* :letter es un parámetro: /practice/A, /practice/B... */}
      <Route
        path="/practice/:letter"
        element={
          <ProtectedRoute>
            <PracticePage />
          </ProtectedRoute>
        }
      />
     <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App