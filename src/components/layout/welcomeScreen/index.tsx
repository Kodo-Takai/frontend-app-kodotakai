import  { useState } from 'react';
import { HiMiniArrowRightStartOnRectangle } from "react-icons/hi2";


const WelcomeScreens = () => {
  const [currentScreen, setCurrentScreen] = useState(0);

  const screens = [
    {
      id: 1,
      image: "/api/placeholder/300/400",
      title: "¡Hola! Bienvenido a ViajaYA",
      subtitle: "Comienza tu aventura explorando los destinos más increíbles de Colombia",
      bgColor: "bg-gradient-to-br from-blue-500 to-teal-600"
    },
    {
      id: 2,
      image: "/api/placeholder/300/400", 
      title: "Encuentra los mejores destinos",
      subtitle: "Descubre lugares únicos y experiencias inolvidables en cada rincón del país",
      bgColor: "bg-gradient-to-br from-teal-500 to-blue-600"
    }
  ];

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      // Aquí redirigiría al formulario de registro
      console.log("Ir al formulario de registro");
    }
  };

  const handleBack = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const currentScreenData = screens[currentScreen];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header con imagen de fondo */}
        <div className={`${currentScreenData.bgColor} h-96 relative flex items-center justify-center p-8`}>
          {/* Botón de retroceso */}
          {currentScreen > 0 && (
            <button 
              onClick={handleBack}
              className="absolute top-4 left-4 text-white bg-white/20 rounded-full p-2 backdrop-blur-sm"
            >
              <HiMiniArrowRightStartOnRectangle size={20} />
            </button>
          )}
          
          {/* Indicadores de progreso */}
          <div className="absolute top-4 right-4 flex space-x-2">
            {screens.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentScreen ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Imagen/Ilustración placeholder */}
          <div className="w-64 h-64 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <div className="text-white text-6xl">
              {currentScreen === 0 ? '📸' : '🗺️'}
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-8 space-y-6">
          <div className="text-center space-y-3">
            <h1 className="text-2xl font-bold text-gray-800 leading-tight">
              {currentScreenData.title}
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              {currentScreenData.subtitle}
            </p>
          </div>

          {/* Botón Siguiente */}
          <button 
            onClick={handleNext}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-2xl flex items-center justify-center space-x-2 transition-colors duration-200"
          >
            <span>{currentScreen === screens.length - 1 ? 'Comenzar' : 'Siguiente'}</span>
            <HiMiniArrowRightStartOnRectangle size={20} />
          </button>

          {/* Indicador inferior */}
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreens;