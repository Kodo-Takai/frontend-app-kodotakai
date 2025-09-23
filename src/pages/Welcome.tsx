import Button from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { HiArrowLeftEndOnRectangle } from "react-icons/hi2";
import "../styles/_index.scss";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center max-w-md relative bg-[#00354E]">
      <img 
        className="w-full h-auto object-cover" 
        src="/Colombia.svg" 
        alt="Screen-Welcome" 
      />
      <div className="absolute top-10 left-5">
        <h1 className="text-4xl text-white font-extrabold">
          VIAJA<span className="text-red-700">YA</span>
        </h1>
        <p className="text-white text-sm">Developed by KodoTakaiTeam</p>
      </div>

      <div className="flex flex-col gap-4 bg-white rounded-t-3xl p-8 w-full relative z-10">
        <h1 className="text-4xl text-[var(--color-blueDark)] font-extrabold">
          Adéntrate en Colombia y su cultura
        </h1>
        <p className="text-sm text-[var(--color-blueDark)]">
          Prepárate para caminar, experimentar y explorar nuevas vivencias.
        </p>
        <Button
          className="flex items-center justify-center"
          onClick={() => navigate("/login")}
        >
          Iniciar Sesión <HiArrowLeftEndOnRectangle className="ml-2 w-5 h-5" />
        </Button>
        <Button
          className="flex items-center justify-center"
          variant="blue"
          onClick={() => navigate("/register")}
        >
          Crear Nueva cuenta
          <FaArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
}