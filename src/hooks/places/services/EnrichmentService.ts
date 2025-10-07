import type { Place, EnrichedPlace, PlaceCategory } from "../types";
import { EnrichmentConfigFactory, CACHE_CONFIG } from "../enrichment/enrichmentConfigs";

const PRICE_LEVELS = {
  0: { description: "Gratis", color: "text-green-600" },
  1: { description: "Económico", color: "text-green-500" },
  2: { description: "Moderado", color: "text-yellow-500" },
  3: { description: "Caro", color: "text-orange-500" },
  4: { description: "Lujo", color: "text-red-500" }
};

const DEFAULT_PRICE_LEVEL = 2;
const HIGH_RATING_THRESHOLD = 4;
const enrichmentCache = new Map<string, EnrichedPlace>();

export class EnrichmentService {
  static getPriceInfo(priceLevel: number | undefined, place?: Place) {
    const level = priceLevel ?? (place?.rating && place.rating >= HIGH_RATING_THRESHOLD ? 3 : DEFAULT_PRICE_LEVEL);
    const info = PRICE_LEVELS[level as keyof typeof PRICE_LEVELS] || PRICE_LEVELS[DEFAULT_PRICE_LEVEL];
    
    return {
      level,
      description: info.description,
      symbol: "",
      color: info.color,
      isInferred: !priceLevel
    };
  }

  static processEnrichedData(googleData: google.maps.places.PlaceResult, originalPlace: Place): EnrichedPlace {
    const amenities = this.extractAmenities(googleData);
    const services = this.extractServices(googleData.types || []);
    const types = googleData.types || [];
    
    return {
      ...originalPlace,
      formatted_address: googleData.formatted_address,
      website: googleData.website,
      formatted_phone_number: googleData.formatted_phone_number,
      international_phone_number: googleData.international_phone_number,
      photo_url: googleData.photos?.[0]?.getUrl() || originalPlace.photo_url,
      photos: googleData.photos || originalPlace.photos,
      editorial_summary: (googleData as any).editorial_summary?.overview ? {
        overview: (googleData as any).editorial_summary.overview
      } : undefined,
      reviews: googleData.reviews?.map(review => ({
        author_name: review.author_name || "",
        rating: review.rating || 0,
        text: review.text || "",
        time: review.time || 0,
        relative_time_description: review.relative_time_description || ""
      })) || [],
      opening_hours_detailed: googleData.opening_hours ? {
        periods: (googleData.opening_hours.periods || []).map(period => ({
          open: { day: period.open?.day || 0, time: period.open?.time || "0000" },
          close: period.close ? { day: period.close.day, time: period.close.time } : { day: 0, time: "0000" }
        })),
        weekday_text: googleData.opening_hours.weekday_text || []
      } : undefined,
      utc_offset_minutes: (googleData as any).utc_offset_minutes,
      is_open_now: googleData.opening_hours?.isOpen?.() ?? (googleData as any).open_now,
      price_info: this.getPriceInfo((googleData as any).price_level, originalPlace),
      business_status: googleData.business_status,
      vicinity: googleData.vicinity,
      place_id: googleData.place_id || originalPlace.place_id,
      rating: googleData.rating || originalPlace.rating,
      name: googleData.name || originalPlace.name,
      location: googleData.geometry?.location?.toJSON() || originalPlace.location,
      amenities: amenities,
      services: services,
      types: types
    };
  }

  private static extractAmenities(googleData: google.maps.places.PlaceResult): string[] {
    const amenities: string[] = [];
    
    if ((googleData as any).wheelchair_accessible_entrance) {
      amenities.push("Accesible para sillas de ruedas");
    }
    
    const serviceMappings = [
      { field: 'curbside_pickup', label: 'Recogida en acera' },
      { field: 'delivery', label: 'Delivery' },
      { field: 'dine_in', label: 'Comer en el lugar' },
      { field: 'takeout', label: 'Para llevar' },
      { field: 'reservable', label: 'Reservas disponibles' },
      { field: 'serves_breakfast', label: 'Desayuno' },
      { field: 'serves_lunch', label: 'Almuerzo' },
      { field: 'serves_dinner', label: 'Cena' },
      { field: 'serves_beer', label: 'Cerveza' },
      { field: 'serves_wine', label: 'Vino' },
      { field: 'serves_brunch', label: 'Brunch' },
      { field: 'serves_vegetarian_food', label: 'Comida vegetariana' }
    ];
    
    serviceMappings.forEach(service => {
      if ((googleData as any)[service.field]) {
        amenities.push(service.label);
      }
    });
    
    return amenities;
  }

  private static extractServices(types: string[]): string[] {
    const typeServiceMap: Record<string, string> = {
      'lodging': 'Alojamiento',
      'restaurant': 'Restaurante',
      'spa': 'Spa',
      'gym': 'Gimnasio',
      'parking': 'Estacionamiento',
      'wifi': 'WiFi'
    };
    
    return types.map(type => typeServiceMap[type]).filter(Boolean);
  }

  static async enrichPlace(place: Place, category: PlaceCategory = "hotels"): Promise<EnrichedPlace | null> {
    try {
      if (!place?.place_id || !place?.name) {
        console.warn("Invalid place data for enrichment:", place);
        return null;
      }

      const cacheKey = `${place.place_id}_${category}`;
      if (CACHE_CONFIG.enabled && enrichmentCache.has(cacheKey)) {
        const cached = enrichmentCache.get(cacheKey);
        if (cached && Date.now() - (cached as any).cached_at < CACHE_CONFIG.ttl) {
          return cached;
        }
      }

      if (!window.google?.maps?.places?.PlacesService) {
        throw new Error("Google Maps API not loaded");
      }

      const service = new window.google.maps.places.PlacesService(document.createElement('div'));
      const config = EnrichmentConfigFactory.createConfig(category);

      return new Promise((resolve, reject) => {
        service.getDetails({
          placeId: place.place_id,
          fields: config.fields,
          language: config.language,
          region: config.region
        }, (result, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && result) {
            const enrichedPlace = this.processEnrichedData(result, place);
            if (CACHE_CONFIG.enabled) {
              (enrichedPlace as any).cached_at = Date.now();
              enrichmentCache.set(cacheKey, enrichedPlace);
            }
            resolve(enrichedPlace);
          } else {
            reject(new Error(`Places API error: ${status}`));
          }
        });
      });
    } catch (err) {
      console.error("Error enriching place:", err);
      return null;
    }
  }

  static async enrichPlaces(places: Place[], category: PlaceCategory = "hotels"): Promise<EnrichedPlace[]> {
    if (!places.length) return [];
    
    const results = await Promise.allSettled(
      places.map(place => this.enrichPlace(place, category))
    );
    
    return results
      .filter((result): result is PromiseFulfilledResult<EnrichedPlace | null> => result.status === 'fulfilled')
      .map(result => result.value)
      .filter((place): place is EnrichedPlace => place !== null);
  }
}