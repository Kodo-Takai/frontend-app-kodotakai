import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { RiWheelchairLine } from "react-icons/ri";
import { BiSolidWine } from "react-icons/bi";
import { MdOutlineFreeBreakfast } from "react-icons/md";
import { useHotels } from "../../../hooks/useHotels";
import type { Hotel } from "../../../hooks/useHotels";
import "./index.scss";

// Componente HotelCard extraído para evitar recreación
const HotelCard = ({ hotel }: { hotel: Hotel }) => {
  const [imageError, setImageError] = useState(false);
  const handleImageError = () => setImageError(true);

  return (
    <div className="w-[300px] flex-shrink-0 bg-white overflow-hidden">
      <div className="relative h-47 w-full">
        <img
          src={
            imageError
              ? "https://picsum.photos/400/200?random=hotel-error"
              : hotel.photo_url
          }
          alt={hotel.name}
          className="w-full h-full rounded-2xl object-cover"
          onError={handleImageError}
        />

        <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-black to-transparent rounded-b-2xl" />

        <div className="absolute top-2 left-2 flex gap-1">
          <div className="flex items-center gap-0.5 bg-white rounded-lg px-1 py-0.5 text-sm font-medium text-[#00324A]">
            <FaStar className="text-[#00324A]" />
            {hotel.rating ?? "-"}
          </div>
          <div className="flex items-center bg-white rounded-lg  px-1 py-1 text-xs font-medium">
            <RiWheelchairLine
              className={`${
                hotel.wheelchair_accessible_entrance
                  ? "text-[#00324A]"
                  : "text-gray-400"
              } text-lg`}
            />
          </div>
          <div className="flex items-center bg-white rounded-lg px-1 py-1 text-xs font-medium">
            <BiSolidWine
              className={`${
                hotel.serves_wine ? "text-[#00324A]" : "text-gray-400"
              } text-lg`}
            />
          </div>
          <div className="flex items-center bg-white rounded-lg px-1 py-1 text-xs font-medium">
            <MdOutlineFreeBreakfast
              className={`${
                hotel.serves_breakfast ? "text-[#00324A]" : "text-gray-400"
              } text-lg`}
            />
          </div>
        </div>

        <div className="absolute bottom-3 right-2 text-white rounded-md px-3 py-1 text-xs font-semibold flex flex-col items-end">
          <span className="text-2xl font-extrabold text-[#FF0007] leading-none">
            {hotel.opening_now === true
              ? "Abierto ahora"
              : hotel.opening_now === false
              ? "Cerrado"
              : "Consulta aquí"}
          </span>
        </div>
      </div>

      <div className="pt-3 px-1">
        <h3 className="text-xl font-extrabold text-[#00324A] line-clamp-1">
          {hotel.name}
        </h3>
        <p className="text-sm text-black mt-1 line-clamp-2">
          {hotel.vicinity ||
            "Descubre este hotel y disfruta de una experiencia de descanso única."}
        </p>
      </div>
    </div>
  );
};

export default function HotelCards() {
  const { hotels, loading } = useHotels({ radius: 30000 });
  const displayedHotels = hotels.slice(0, 6);

  if (loading) {
    return (
      <div className="hotel-scroll">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={`hotel-skeleton-${i}`} className="hotel-card-width">
            <div className="rounded-xl overflow-hidden animate-pulse">
              <div className="h-60 bg-gray-200" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4" />
                <div className="h-3 bg-gray-300 rounded w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!displayedHotels.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center mx-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No hay hoteles disponibles
        </h3>
        <p className="text-gray-600 text-sm">
          No encontramos hoteles cercanos en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        A descansar un momento
      </h2>
      <div className="hotel-scroll">
        {displayedHotels.map((hotel, index) => (
          <HotelCard key={hotel.place_id || `hotel-${index}`} hotel={hotel} />
        ))}
      </div>
    </div>
  );
}