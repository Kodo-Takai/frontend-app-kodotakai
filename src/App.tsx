import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import { useSplashScreen } from './hooks/useSplashScreen';
import SplashScreen from './components/common/splashScreen';

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
