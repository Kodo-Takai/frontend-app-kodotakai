import Button from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { HiArrowLeftEndOnRectangle } from "react-icons/hi2";
import "../styles/_index.scss";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center min-h-screen max-w-md relative" style={{ backgroundColor: 'var(--color-blue-dark)' }}>
      {/* Imagen de fondo - Responsive */}
      <div className="absolute inset-0 w-full h-[38%] sm:h-[40%] md:h-[45%] lg:h-[50%]">
        <img 
          className="w-full h-full object-cover" 
          src="/Colombia.svg" 
          alt="Screen-Welcome" 
        />
      </div>
      
      {/* Logo en la parte superior */}
      <div className="absolute top-10 left-5 z-20">
        <h1 className="text-4xl font-extrabold" style={{ color: 'var(--color-bone)' }}>
          VIAJA<span style={{ color: 'var(--color-green)' }}>YA</span>
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-bone)' }}>Developed by KodoTakaiTeam</p>
      </div>

      {/* Contenido desde abajo */}
      <div className="flex-1 flex items-end w-full">
        <div className="flex flex-col gap-4 rounded-t-[40px] p-8 w-full relative z-10 pb-10 sm:pb-20 md:pb-24 lg:pb-32" style={{ backgroundColor: 'var(--color-bone)' }}>
        <h1 className="text-5xl leading-tighter font-extrabold tracking-tight" style={{ color: 'var(--color-blue)' }}>
          Adéntrate en Colombia y su cultura
        </h1>
        <p className="text-sm font-medium" style={{ color: 'var(--color-blue)' }}>
          Prepárate para caminar, experimentar y explorar nuevas vivencias.
        </p>
        <Button
          variant="blue"
          className="flex items-center justify-center"
          onClick={() => navigate("/login")}
        >
          Iniciar Sesión <HiArrowLeftEndOnRectangle className="ml-2 w-5 h-5" />
        </Button>
        <Button
          className="flex items-center justify-center"
          style={{ backgroundColor: 'var(--color-green-dark)' }}
          onClick={() => navigate("/register")}
        >
          Crear Nueva cuenta
          <FaArrowRight className="ml-2 w-5 h-5" />
        </Button>
        </div>
      </div>
    </div>
  );
}