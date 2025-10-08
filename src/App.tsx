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
import Maps from "./pages/Maps";
// Import Category Pages
import RestaurantsPage from "./pages/categories/RestaurantsPage";
import PlayasPage from "./pages/categories/PlayasPage";
import HotelesPage from "./pages/categories/HotelesPage";
import DiscosPage from "./pages/categories/DiscosPage";
import EstudiarPage from "./pages/categories/EstudiarPage";
import ParquesPage from "./pages/categories/ParquesPage";
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
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/maps" element={<Maps />} />
            <Route path="/explorar" element={<Explorar />} />
            <Route path="/explorar/restaurants" element={<RestaurantsPage />} />
            <Route path="/explorar/playas" element={<PlayasPage />} />
            <Route path="/explorar/hoteles" element={<HotelesPage />} />
            <Route path="/explorar/discos" element={<DiscosPage />} />
            <Route path="/explorar/estudiar" element={<EstudiarPage />} />
            <Route path="/explorar/parques" element={<ParquesPage />} />
          </Route>
        </Route>
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
