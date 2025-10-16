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
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }} />
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
                  className="rounded-xl p-3 backdrop-blur-md transition hover:scale-105"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 240, 0.2)',
                    color: 'var(--color-bone)'
                  }}
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
                  i === index ? "w-6" : "w-2"
                }`}
                style={{
                  backgroundColor: i === index ? 'var(--color-bone)' : 'rgba(255, 255, 240, 0.6)'
                }}
              />
            ))}
          </div>

          {/* CONTENIDO PRINCIPAL */}
          <div className="rounded-t-3xl p-8 shadow-2xl min-h-[45vh]" style={{ backgroundColor: 'var(--color-bone)' }}>
            <div className="flex flex-col gap-4 text-left">
              <h1 className="flex flex-col items-baseline gap-x-2 text-5xl font-extrabold leading-tight" style={{ color: 'var(--color-blue)' }}>
                {s.title && <span>{s.title}</span>}
                {s.title1 && <span>{s.title1}</span>}
                {s.title3 && <span style={{ color: 'var(--color-green)' }}>{s.title3}</span>}
              </h1>

              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-blue-light)' }}>
                {s.subtitle}
              </p>
            </div>

            <button
              onClick={next}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-semibold transition-colors"
              style={{ 
                backgroundColor: 'var(--color-green)',
                color: 'var(--color-bone)'
              }}
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
