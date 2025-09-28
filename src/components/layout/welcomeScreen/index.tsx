import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { HiMiniArrowRightStartOnRectangle } from "react-icons/hi2";
import "../../../styles/_index.scss";

interface WelcomeScreensProps {
  onComplete: () => void;
}

export default function WelcomeScreens({ onComplete }: WelcomeScreensProps) {
  const [index, setIndex] = useState(0);

  const screens = [
    {
      id: 1,
      image: "/MapsScreen.svg",
      title: "¡Hola!",
      title1: "Bienvenido a",
      title3: "ViajaYA",
      overlayImage: "/icons/pictures.svg",
      subtitle:
        "Sumérgete en los mejores lugares para pasar el momento, desde hospedajes hasta Airbnb",
      tint: "from-blue-500 to-teal-600",
    },
    {
      id: 2,
      image: "/MapsScreen_2.svg",
      title: "Encuentra los mejores destinos",
      subtitle:
        "Descubre lugares únicos y experiencias inolvidables en cada rincón del país",
      tint: "from-teal-500 to-blue-600",
    },
  ];

  const s = screens[index];

  const next = () => {
    if (index < screens.length - 1) setIndex((i) => i + 1);
    else{
      onComplete();
    };
  };

  const back = () => index > 0 && setIndex((i) => i - 1);

  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="relative w-full max-w-md h-screen overflow-hidden">
        {/* IMAGEN DE FONDO FIJA */}
        <div
          className="fixed inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${s.image})` }}
        >
          {/* Tinte (gradiente) para dar look & legibilidad */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${s.tint} opacity-70 mix-blend-multiply`}
          />
          {/* Ligero oscurecido extra */}
          <div className="absolute inset-0 bg-black/10" />
        </div>
        {/* IMAGEN SUPERPUESTA  - Solo para el primer screen */}
        {s.overlayImage && (
          <div className="absolute bottom-70 inset-0 flex items-center justify-center z-20">
            <img
              src={s.overlayImage}
              alt="Logo ViajaYA"
              className="w-full h-full drop-shadow-2xl"
            />
          </div>
        )}
        {/* CONTENIDO SUPERPUESTO */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Header con botón atrás */}
          <div className="p-4">
            {/* Botón atrás */}
            {index > 0 && (
              <div className="flex justify-start">
                <button
                  onClick={back}
                  aria-label="Atrás"
                  className="rounded-xl bg-white/20 p-3 text-white backdrop-blur-md transition hover:scale-105 hover:bg-white/30"
                >
                  <FaArrowLeft size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Espacio flexible para empujar el contenido hacia abajo */}
          <div className="flex-1"></div>

          {/* Indicadores centrados - justo arriba del contenido */}
          <div className="flex justify-center items-center space-x-3 pb-4">
            {screens.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Ir a pantalla ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-white" : "w-2 bg-white/60"
                }`}
              />
            ))}
          </div>

          {/* CONTENIDO PRINCIPAL */}
          <div className="bg-white rounded-t-3xl p-8 shadow-2xl min-h-[45vh]">
            <div className="flex flex-col gap-4 text-left">
              <h1 className="flex flex-col items-baseline gap-x-2 text-5xl font-extrabold  text-[var(--color-blueDark)] leading-tight">
                {s.title && <span>{s.title}</span>}
                {s.title1 && <span>{s.title1}</span>}
                {s.title3 && <span className="text-red-600">{s.title3}</span>}
              </h1>

              <p className="text-sm text-[var(--color-blueLight)] leading-relaxed">
                {s.subtitle}
              </p>
            </div>

            <button
              onClick={next}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-4 font-semibold text-white transition-colors hover:bg-red-700"
            >
              <span>
                {index === screens.length - 1 ? "Comenzar" : "Siguiente"}
              </span>
              <HiMiniArrowRightStartOnRectangle size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
