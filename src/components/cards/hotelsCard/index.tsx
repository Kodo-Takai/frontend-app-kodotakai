import { useState } from "react";
import { RiUser3Fill } from "react-icons/ri";
import { PiDogBold } from "react-icons/pi";
import { TbGlassCocktail } from "react-icons/tb";
import { MdTv } from "react-icons/md";
import { usePlaces } from "../../../hooks/usePlaces";
import "./index.scss";

interface Hotel {
    name: string;
    rating?: number;
    description?: string;
    place_id: string;
    photo_url: string;
    location?: { lat: number; lng: number };
}

export default function HotelCards() {
    const { places, loading } = usePlaces({
        category: "hotels",
        searchMethod: "both",
        limit: 6, 
        radius: 30000,
    });

    const displayedHotels = places.slice(0, 6);

    const HotelCard = ({ hotel }: { hotel: Hotel }) => {
        const [imageError, setImageError] = useState(false);

        const handleImageError = () => setImageError(true);

        // Datos simulados
        const mockInfo = {
        persons: Math.floor(Math.random() * 4) + 1,
        price: Math.floor(Math.random() * 200000) + 80000,
        nights: "2 días · 1 noche",
        pets: Math.random() > 0.5,
        drinks: Math.random() > 0.5,
        tv: Math.random() > 0.5,
        };

        return (
        <div className="min-w-[300px] max-w-[350px] flex-shrink-0 bg-white overflow-hidden">
            <div className="relative h-47 w-full">
                <img
                    src={
                    imageError
                        ? "https://via.placeholder.com/400x200/3B82F6/ffffff?text=🏨+Sin+Imagen"
                        : hotel.photo_url
                    }
                    alt={hotel.name}
                    className="w-full h-full rounded-2xl object-cover"
                    onError={handleImageError}
                />

                <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-black to-transparent rounded-b-2xl" />

                <div className="absolute top-2 left-2 flex gap-1">
                    <div className="flex items-center gap-0.5 bg-white rounded-lg px-1 py-0.5 text-sm font-medium text-[#00324A]">
                    <RiUser3Fill className="text-[#00324A]" />
                    {mockInfo.persons}
                    </div>
                    <div className="flex items-center bg-white rounded-lg  px-1 py-1 text-xs font-medium">
                    <PiDogBold className={`${mockInfo.pets ? "text-[#00324A]" : "text-gray-400"} text-lg`}/>
                    {mockInfo.pets}
                    </div>
                    <div className="flex items-center bg-white rounded-lg px-1 py-1 text-xs font-medium">
                    <TbGlassCocktail className={`${mockInfo.drinks ? "text-[#00324A]" : "text-gray-400"} text-lg`} />
                    {mockInfo.drinks}
                    </div>
                    <div className="flex items-center bg-white rounded-lg px-1 py-1 text-xs font-medium">
                    <MdTv className={`${mockInfo.tv ? "text-[#00324A]" : "text-gray-400"} text-lg`} />
                    {mockInfo.tv}
                    </div>
                </div>

                <div className="absolute bottom-2 right-2 text-white rounded-md px-3 py-1 text-xs font-semibold flex flex-col items-end">
                    <span className="text-2xl font-extrabold text-[#FF0007] leading-none">
                        {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                        }).format(mockInfo.price)} COP
                    </span>
                    <span className="text-[12px] font-normal">{mockInfo.nights}</span>
                </div>
            </div>

            <div className="pt-3 px-1">
                <h3 className="text-xl font-bold text-[#00324A] line-clamp-1">
                    {hotel.name}
                </h3>
                <p className="text-sm text-black mt-1 line-clamp-2">
                    {hotel.description ||
                    "Descubre este hotel y disfruta de una experiencia de descanso única."}
                </p>
            </div>
        </div>
        );
    };

    if (loading) {
        return (
        <div className="hotel-scroll">
            {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="hotel-card-width">
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
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">
            A descansar un momento
        </h2>
        <div className="hotel-scroll">
            {displayedHotels.map((hotel) => (
            <HotelCard key={hotel.place_id} hotel={hotel} />
            ))}
        </div>
        </div>
    );
}