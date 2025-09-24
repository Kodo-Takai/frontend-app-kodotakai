import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home"
import { useSplashScreen } from "./hooks/useSplashScreen";
import SplashScreen from "./components/common/splashScreen";
import ForgotPassword from "./pages/ForgotPassword";
// import { BottomNav } from "./components/layout/BottomNav";
// import { defaultItems } from "./components/layout/BottomNav";

export default function App() {
  const isLoading = useSplashScreen();
  return (
    <BrowserRouter>
      <SplashScreen visible={!isLoading} />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
      </Routes>
      {/* <BottomNav items={defaultItems} className="Hola"/> */}
    </BrowserRouter>
  );
}
