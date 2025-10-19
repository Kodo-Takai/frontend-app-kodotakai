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
import CustomProfile from "./pages/CustomProfile";
import Profile from "./pages/Profile";
// Import Category Pages
import RestaurantsPage from "./pages/categories/RestaurantsPage";
import PlayasPage from "./pages/categories/PlayasPage";
import HotelesPage from "./pages/categories/HotelesPage";
import DiscosPage from "./pages/categories/DiscosPage";
import EstudiarPage from "./pages/categories/EstudiarPage";
import ParquesPage from "./pages/categories/ParquesPage";
import TravelerType from "./pages/TravelerType";
import TravelActivities from "./pages/TravelActivities";
import TravelPreferences from "./pages/TravelPreferences";
// Import Hooks and Components
import { useSplashScreen } from "./hooks/useSplashScreen";
import SplashScreen from "./components/common/splashScreen";
import MainLayout from "./components/layout/mainLayout";
import AuthLayout from "./components/layout/AuthLayout";
import Agenda from "./pages/Agenda";
import { NavigationProvider } from "./context/navigationContext";
import { AIProvider } from "./context/aiContext";
import AIOverlay from "./components/ui/AIOverlay";
import CustomToastContainer from "./components/ui/toast";
import { RegisterFlowProvider } from "./context/registerFlowContext";
import ConfettiEffect from "./components/ui/AIOverlay/ConfettiEffect";
import { ConfettiProvider, useConfetti } from "./context/confettiContext";

function AppContent() {
  const isLoading = useSplashScreen();

  return (
    <>
      <CustomToastContainer />
      <SplashScreen visible={!isLoading} />
      <NavigationProvider>
        <RegisterFlowProvider>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register-travel" element={<TravelerType />} />
              <Route
                path="/register-activities"
                element={<TravelActivities />}
              />
              <Route
                path="/register-preferences"
                element={<TravelPreferences />}
              />
            </Route>

            <Route element={<MainLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/explorar" element={<Explorar />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route
                path="/explorar/restaurants"
                element={<RestaurantsPage />}
              />
              <Route path="/explorar/playas" element={<PlayasPage />} />
              <Route path="/explorar/hoteles" element={<HotelesPage />} />
              <Route path="/explorar/discos" element={<DiscosPage />} />
              <Route path="/explorar/estudiar" element={<EstudiarPage />} />
              <Route path="/explorar/parques" element={<ParquesPage />} />
              <Route path="/maps" element={<Maps />} />
              <Route path="/custom-profile" element={<CustomProfile />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </RegisterFlowProvider>
      </NavigationProvider>
      <ConfettiProvider>
        <AppWithConfetti />
      </ConfettiProvider>
    </>
  );
}

function AppWithConfetti() {
  const { showConfetti } = useConfetti();

  return (
    <>
      <AIProvider>
        <AIOverlay>
          <NavigationProvider>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/register" element={<Register />} />
              </Route>

              <Route element={<MainLayout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/explorar" element={<Explorar />} />
                <Route path="/agenda" element={<Agenda />} />
                <Route path="/explorar/restaurants" element={<RestaurantsPage />} />
                <Route path="/explorar/playas" element={<PlayasPage />} />
                <Route path="/explorar/hoteles" element={<HotelesPage />} />
                <Route path="/explorar/discos" element={<DiscosPage />} />
                <Route path="/explorar/estudiar" element={<EstudiarPage />} />
                <Route path="/explorar/parques" element={<ParquesPage />} />
                <Route path="/maps" element={<Maps />} />
                <Route path="/custom-profile" element={<CustomProfile />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Routes>
          </NavigationProvider>
        </AIOverlay>
      </AIProvider>
      
      {/* Confetti global - por encima de todo */}
      <ConfettiEffect show={showConfetti} />
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
