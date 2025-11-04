// Componente para mostrar información de precios

interface PriceInfo {
  level: number | null;
  description: string;
  symbol: string;
  color: string;
  isInferred?: boolean; // Indica si el precio fue inferido
}

interface PriceDisplayProps {
  priceInfo?: PriceInfo;
  category: string;
  className?: string;
}

export default function PriceDisplay({
  priceInfo,
  category,
  className = "",
}: PriceDisplayProps) {
  // Determinar si mostrar precios según la categoría
  const shouldShowPrice = ["hotels", "restaurants", "destinations"].includes(
    category
  );

  if (!shouldShowPrice) {
    return null;
  }

  // Mostrar información de precio incluso si no está disponible
  if (!priceInfo) {
    return (
      <div
        className={`p-3 rounded-lg border-l-4 border-gray-300 bg-gray-50 ${className}`}
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg">🏨</span>
          <div>
            <p className="font-semibold text-sm text-gray-600">
              Información de precio no disponible
            </p>
            <p className="text-xs text-gray-500">
              Contacta directamente para consultar precios
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-3 rounded-lg border-l-4 ${priceInfo.color} bg-gray-50 ${className}`}
    >
      <div className="flex items-center space-x-2">
        <span className="text-lg">{priceInfo.symbol}</span>
        <div>
          <p className="font-semibold text-sm text-gray-800">
            {priceInfo.description}
          </p>
          {priceInfo.level !== null && (
            <p className="text-xs text-gray-600">
              Nivel {priceInfo.level}/4
              {priceInfo.isInferred && (
                <span className="ml-1 text-blue-600 font-medium">
                  (Estimado)
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Información adicional según categoría */}
      {category === "hotels" && priceInfo.level !== null && (
        <div className="mt-2 text-xs text-gray-600">
          {priceInfo.level === 0 && "Alojamiento gratuito"}
          {priceInfo.level === 1 && "Hostales, pensiones económicas"}
          {priceInfo.level === 2 && "Hoteles 3 estrellas, negocios"}
          {priceInfo.level === 3 && "Hoteles 4-5 estrellas, lujo"}
          {priceInfo.level === 4 && "Resorts, hoteles de ultra lujo"}
        </div>
      )}

      {category === "restaurants" && priceInfo.level !== null && (
        <div className="mt-2 text-xs text-gray-600">
          {priceInfo.level === 0 && "Comida gratuita"}
          {priceInfo.level === 1 && "Comida rápida, locales económicos"}
          {priceInfo.level === 2 && "Restaurantes casuales, familiares"}
          {priceInfo.level === 3 && "Restaurantes de gama media-alta"}
          {priceInfo.level === 4 && "Restaurantes gourmet, alta cocina"}
        </div>
      )}
    </div>
  );
}
