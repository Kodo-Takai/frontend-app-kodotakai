import { usePlaces } from "./usePlaces";

export interface Hotel {
    name: string;
    rating?: number;
    vicinity?: string;
    opening_now?: boolean | null;
    place_id: string;
    photo_url: string;
    location?: { lat: number; lng: number };
    wheelchair_accessible_entrance?: boolean;
    serves_wine?: boolean;
    serves_breakfast?: boolean;
}

export function useHotels(options: { limit?: number; radius?: number } = {}) {
    const { places, loading, apiStatus } = usePlaces({
        category: "hotels",
        searchMethod: "both",
        radius: options.radius ?? 30000,
        limit: options.limit ?? 6,
    });

    const hotels: Hotel[] = places.map((place) => ({
        name: place.name,
        photo_url: place.photo_url,
        rating: place.rating,
        vicinity: place.vicinity,
        place_id: place.place_id,
        location: place.location,
        opening_now: place.opening_hours?.open_now ?? null,
        wheelchair_accessible_entrance: place.wheelchair_accessible_entrance,
        serves_wine: place.serves_wine,
        serves_breakfast: place.serves_breakfast,
    }));

    return { hotels, loading, apiStatus };
}