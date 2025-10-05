import { BrowserRouter, Routes, Route } from "react-router-dom";
// Import Redux
import { store } from "./redux/store";
import { Provider } from "react-redux";
// Import Pages
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Explorar from "./pages/Explorar";
import ForgotPassword from "./pages/ForgotPassword";
import Notifications from "./pages/Notifications";
import CustomProfile from "./pages/CustomProfile";
// Import Hooks and Components
import { useSplashScreen } from "./hooks/useSplashScreen";
import SplashScreen from "./components/common/splashScreen";
import MainLayout from "./components/layout/mainLayout";
import AuthLayout from "./components/layout/AuthLayout";
import ProtectedRoute from "./components/layout/protectedRoute";

function AppContent() {
  const isLoading = useSplashScreen();

  return (
    <>
      <SplashScreen visible={!isLoading} />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/explorar" element={<Explorar />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/custom-profile" element={<CustomProfile />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}
