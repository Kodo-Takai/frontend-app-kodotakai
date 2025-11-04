import React from "react";

interface InitialContentProps {
  isAccordionOpen: boolean;
  onToggleAccordion: () => void;
  onGenerateItinerary: () => void;
  accordionRef: React.RefObject<HTMLDivElement>;
}

const InitialContent: React.FC<InitialContentProps> = ({
  isAccordionOpen,
  onToggleAccordion,
  onGenerateItinerary,
  accordionRef,
}) => {
  return (
    <>
      {/* Imagen de Kodi */}
      <div className="flex justify-center mb-6 mt-10">
        <img src="/kodi.png" alt="Kodi" className="w-25 h-25 object-contain" />
      </div>

      <h1 className="text-4xl font-extrabold mb-4 tracking-tighter">
        Hola! soy KODI
      </h1>
      <p className="text-xl mb-8 font-bold text-[var(--color-blue)]">
        Tu asistente inteligente está listo para ayudarte
      </p>

      {/* Botón del acordeón */}
      <button
        onClick={onToggleAccordion}
        className="w-70 px-8 justify-between py-3 rounded-2xl font-bold text-lg transition-all duration-300 mb-6 flex items-center gap-3 mx-auto hover:scale-105"
        style={{
          backgroundColor: "var(--color-beige)",
          color: "var(--color-blue)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-bone)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-beige)";
        }}
      >
        <span>Conóceme</span>
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${
            isAccordionOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={4}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Acordeón con contenido */}
      <div
        ref={accordionRef}
        className="overflow-hidden"
        style={{ display: "none", height: 0 }}
      >
        <div className="space-y-6 mb-8">
          <div
            className="rounded-2xl p-6 border-6 border-[var(--color-blue-dark)]"
            style={{ backgroundColor: "var(--color-blue)" }}
          >
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: "var(--color-beige)" }}
            >
              ¿Qué puedo hacer por ti?
            </h3>
            <ul className="space-y-3 text-left">
              <li className="flex items-center gap-3">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "var(--color-beige)" }}
                ></span>
                <span
                  style={{
                    color: "var(--color-blue-darker)",
                    fontWeight: "bold",
                  }}
                >
                  Crear itinerarios personalizados
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "var(--color-beige)" }}
                ></span>
                <span
                  style={{
                    color: "var(--color-blue-darker)",
                    fontWeight: "bold",
                  }}
                >
                  Sugerir lugares según tus preferencias
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "var(--color-beige)" }}
                ></span>
                <span
                  style={{
                    color: "var(--color-blue-darker)",
                    fontWeight: "bold",
                  }}
                >
                  Optimizar rutas de viaje
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "var(--color-beige)" }}
                ></span>
                <span
                  style={{
                    color: "var(--color-blue-darker)",
                    fontWeight: "bold",
                  }}
                >
                  Recomendar restaurantes y actividades
                </span>
              </li>
            </ul>
          </div>

          <div
            className="rounded-2xl p-6 border-6 border-[var(--color-blue-dark)]"
            style={{ backgroundColor: "var(--color-blue)" }}
          >
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: "var(--color-beige)" }}
            >
              Características
            </h3>
            <p
              className="text-lg font-bold"
              style={{ color: "var(--color-blue-darker)" }}
            >
              Utilizo inteligencia artificial avanzada para crear experiencias
              de viaje únicas y personalizadas. Analizo tus preferencias, el
              clima, eventos locales y mucho más para ofrecerte las mejores
              recomendaciones.
            </p>
          </div>

          <div
            className="rounded-2xl p-6 border-6 border-[var(--color-blue-dark)]"
            style={{ backgroundColor: "var(--color-blue)" }}
          >
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: "var(--color-beige)" }}
            >
              ¿Cómo funciona?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: "var(--color-green)" }}
                >
                  <span
                    className="font-bold text-2xl"
                    style={{ color: "var(--color-blue)" }}
                  >
                    1
                  </span>
                </div>
                <p
                  className="font-semibold"
                  style={{ color: "var(--color-blue-dark)" }}
                >
                  Cuéntame tus planes
                </p>
              </div>
              <div className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: "var(--color-green)" }}
                >
                  <span
                    className="font-bold text-2xl"
                    style={{ color: "var(--color-blue)" }}
                  >
                    2
                  </span>
                </div>
                <p
                  className="font-semibold"
                  style={{ color: "var(--color-blue-dark)" }}
                >
                  Analizo opciones
                </p>
              </div>
              <div className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: "var(--color-green)" }}
                >
                  <span
                    className="font-bold  text-xl"
                    style={{ color: "var(--color-bone)" }}
                  >
                    3
                  </span>
                </div>
                <p
                  className="font-semibold"
                  style={{ color: "var(--color-blue-dark)" }}
                >
                  Te doy recomendaciones
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón Armar tu itinerario */}
      <button
        onClick={onGenerateItinerary}
        className="w-70 bg-[var(--color-blue-dark)] text-[var(--color-green)] px-8 py-3 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-200 shadow-lg z-40"
      >
        Generar itinerario con IA
      </button>
    </>
  );
};

export default InitialContent;
