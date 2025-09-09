import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import ApiService from './services/apiService';
import './App.css';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const result = await ApiService.verifyToken(token);
        if (result.success) {
          setAuthenticated(true);
        } else {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('user');
          setAuthenticated(false);
        }
      } else {
        setAuthenticated(false);
      }
      setTimeout(() => setLoading(false), 2000); // splash 2s
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <SplashScreen
        onComplete={() => {}}
        duration={2000}
        logo="/kodotakai-logo.svg"
        appName="Kodotakai"
      />
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {authenticated ? (
          <>
            <Route path="/" element={<Home onLogout={() => {
              const token = localStorage.getItem('auth_token');
              if (token) {
                ApiService.logout(token);
              }
              localStorage.clear();
              setAuthenticated(false);
            }} />} />
            <Route path="*" element={<Home onLogout={() => {
              localStorage.clear();
              setAuthenticated(false);
            }} />} />
          </>
        ) : (
          <>
            <Route
              path="/login"
              element={<Login onLoginSuccess={() => setAuthenticated(true)} onNavigateToRegister={() => { window.location.href = '/register'; }} />}
            />
            <Route
              path="/register"
              element={<Register onNavigateToLogin={() => { window.location.href = '/login'; }} />}
            />
            <Route
              path="/forgot-password"
              element={<div style={{ padding: 24 }}>Recuperar contraseña</div>}
            />
            <Route path="*" element={<Login onLoginSuccess={() => setAuthenticated(true)} onNavigateToRegister={() => { window.location.href = '/register'; }} />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
