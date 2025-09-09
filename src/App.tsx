import { useState } from 'react'
import SplashScreen from './components/SplashScreen'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import ApiService from './services/apiService'
import './App.css'

const APP_STATES = {
  SPLASH: 'splash',
  LOGIN: 'login',
  REGISTER: 'register',
  HOME: 'home'
} as const

type AppState = typeof APP_STATES[keyof typeof APP_STATES]

function App() {
  const [currentState, setCurrentState] = useState<AppState>(APP_STATES.SPLASH)

  // No useEffect needed - splash screen will handle the initial state

  const handleSplashComplete = async () => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      const result = await ApiService.verifyToken(token)
      if (result.success) {
        setCurrentState(APP_STATES.HOME)
      } else {
        // Invalid token, clear storage
        localStorage.removeItem('auth_token')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('user')
        setCurrentState(APP_STATES.LOGIN)
      }
    } else {
      setCurrentState(APP_STATES.LOGIN)
    }
  }

  const handleLoginSuccess = () => {
    setCurrentState(APP_STATES.HOME)
  }

  const handleNavigateToRegister = () => {
    setCurrentState(APP_STATES.REGISTER)
  }

  const handleNavigateToLogin = () => {
    setCurrentState(APP_STATES.LOGIN)
  }

  const handleLogout = async () => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      await ApiService.logout(token)
    }
    localStorage.removeItem('auth_token')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('user')
    setCurrentState(APP_STATES.LOGIN)
  }

  const renderCurrentState = () => {
    switch (currentState) {
      case APP_STATES.SPLASH:
        return (
          <SplashScreen 
            onComplete={handleSplashComplete}
            duration={3000}
            logo="/kodotakai-logo.svg"
            appName="Kodotakai"
          />
        )
      case APP_STATES.LOGIN:
        return <Login onLoginSuccess={handleLoginSuccess} onNavigateToRegister={handleNavigateToRegister} />
      case APP_STATES.REGISTER:
        return <Register onNavigateToLogin={handleNavigateToLogin} />
      case APP_STATES.HOME:
        return <Home onLogout={handleLogout} />
      default:
        return <Login onLoginSuccess={handleLoginSuccess} onNavigateToRegister={handleNavigateToRegister} />
    }
  }

  return renderCurrentState()
import Login from './pages/Login';
import { useSplashScreen } from './hooks/useSplashScreen';
import SplashScreen from './components/common/splashScreen';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';

export default function App() {
  const isLoading = useSplashScreen();
  return (
    <BrowserRouter>
      <SplashScreen visible={!isLoading} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<div style={{ padding: 24 }}>Recuperar contraseña</div>} />
        <Route path="/register" element={<div style={{ padding: 24 }}>Registro</div>} />
      </Routes>
    </BrowserRouter>
  );
}
