# Hook useNearbyPlaces

Hook personalizado para obtener lugares cercanos a una ubicación específica usando Google Places API.

## 📋 Características

- 🎯 **Búsqueda por coordenadas**: Encuentra lugares cercanos a cualquier ubicación
- 📏 **Cálculo de distancia**: Calcula y ordena por distancia desde el punto de origen
- ⭐ **Filtrado por rating**: Filtra lugares por calificación mínima
- 🔍 **Búsqueda por tipo**: Filtra por tipo de lugar (restaurantes, hoteles, etc.)
- 🚀 **Hooks especializados**: Incluye hooks pre-configurados para casos comunes
- 💾 **Manejo de estados**: Loading, error y data management integrado

## 🚀 Uso Básico

```typescript
import { useNearbyPlaces } from '../hooks/places';

function MyComponent() {
  const { places, loading, error, fetchNearbyPlaces } = useNearbyPlaces({
    radius: 2000, // 2km de radio
    type: 'restaurant', // Buscar restaurantes
    limit: 10, // Máximo 10 resultados
    minRating: 4.0, // Rating mínimo de 4.0
  });

  const handleSearch = () => {
    const location = { lat: -12.0464, lng: -77.0428 }; // Lima, Perú
    fetchNearbyPlaces(location);
  };

  return (
    <div>
      <button onClick={handleSearch}>Buscar lugares cercanos</button>
      
      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}
      
      {places.map(place => (
        <div key={place.id}>
          <h3>{place.name}</h3>
          <p>Rating: {place.rating}</p>
          <p>Distancia: {place.distance}m</p>
        </div>
      ))}
    </div>
  );
}
```

## 🎨 Hooks Especializados

### useNearbyRestaurants

Hook pre-configurado para buscar restaurantes cercanos.

```typescript
import { useNearbyRestaurants } from '../hooks/places';

function RestaurantsFinder() {
  const location = { lat: -12.0464, lng: -77.0428 };
  
  const { places, loading } = useNearbyRestaurants(location, {
    radius: 3000,
    limit: 15,
    minRating: 4.5,
  });

  // El hook busca automáticamente al pasar la ubicación
  return (
    <div>
      {loading ? (
        <p>Buscando restaurantes...</p>
      ) : (
        places.map(restaurant => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))
      )}
    </div>
  );
}
```

### useNearbyHotels

Hook pre-configurado para buscar hoteles cercanos.

```typescript
import { useNearbyHotels } from '../hooks/places';

function HotelsFinder() {
  const location = { lat: -12.0464, lng: -77.0428 };
  
  const { places, loading } = useNearbyHotels(location, {
    radius: 5000,
    limit: 10,
    minRating: 3.5,
  });

  return (
    <div>
      {places.map(hotel => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  );
}
```

### useNearbyAttractions

Hook pre-configurado para buscar atracciones turísticas cercanas.

```typescript
import { useNearbyAttractions } from '../hooks/places';

function AttractionsFinder() {
  const location = { lat: -12.0464, lng: -77.0428 };
  
  const { places, loading } = useNearbyAttractions(location, {
    radius: 10000, // 10km
    limit: 20,
  });

  return (
    <div>
      <h2>Atracciones turísticas cercanas</h2>
      {places.map(attraction => (
        <AttractionCard key={attraction.id} attraction={attraction} />
      ))}
    </div>
  );
}
```

## 🎯 Uso con Itinerario

Ejemplo de integración con el sistema de itinerarios:

```typescript
import { useNearbyPlaces } from '../hooks/places';
import NearbyPlacesCard from '../components/itinerary/NearbyPlacesCard';

function ItineraryWithNearbyPlaces({ destination }) {
  return (
    <div>
      <DestinationCard destination={destination} />
      
      {/* Restaurantes cercanos */}
      <NearbyPlacesCard
        destination={destination}
        type="restaurant"
        radius={2000}
        limit={5}
      />
      
      {/* Hoteles cercanos */}
      <NearbyPlacesCard
        destination={destination}
        type="lodging"
        radius={3000}
        limit={5}
      />
      
      {/* Atracciones cercanas */}
      <NearbyPlacesCard
        destination={destination}
        type="tourist_attraction"
        radius={5000}
        limit={10}
      />
    </div>
  );
}
```

## 📊 Tipos de Datos

### NearbyPlace

```typescript
interface NearbyPlace {
  id: string;
  name: string;
  location: LatLng; // { lat: number, lng: number }
  rating?: number;
  photo_url?: string;
  place_id: string;
  vicinity?: string;
  types?: string[];
  user_ratings_total?: number;
  distance?: number; // Distancia en metros desde el punto de origen
}
```

### UseNearbyPlacesOptions

```typescript
interface UseNearbyPlacesOptions {
  radius?: number; // Radio de búsqueda en metros (default: 2000)
  type?: string; // Tipo de lugar (restaurant, hotel, etc.)
  limit?: number; // Límite de resultados (default: 10)
  minRating?: number; // Rating mínimo (default: 3.0)
  autoFetch?: boolean; // Si debe buscar automáticamente (default: false)
}
```

## 🔍 Tipos de Lugares Soportados

- `restaurant` - Restaurantes
- `lodging` / `hotel` - Hoteles y alojamiento
- `tourist_attraction` - Atracciones turísticas
- `cafe` - Cafés
- `bar` - Bares y pubs
- `museum` - Museos
- `park` - Parques
- `shopping_mall` - Centros comerciales
- `airport` - Aeropuertos
- `bus_station` - Estaciones de autobús
- `hospital` - Hospitales
- `pharmacy` - Farmacias
- Y muchos más según la API de Google Places

## 🎨 Ejemplo Completo de Componente

```typescript
import React from 'react';
import { useNearbyPlaces } from '../hooks/places';

function NearbyPlacesExplorer({ destination }) {
  const { places, loading, error, fetchNearbyPlaces, clearPlaces } = useNearbyPlaces({
    radius: 2000,
    type: 'restaurant',
    limit: 10,
    minRating: 4.0,
  });

  React.useEffect(() => {
    if (destination.latitude && destination.longitude) {
      fetchNearbyPlaces({
        lat: destination.latitude,
        lng: destination.longitude,
      });
    }
  }, [destination, fetchNearbyPlaces]);

  const formatDistance = (meters?: number) => {
    if (!meters) return '';
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={() => fetchNearbyPlaces({ 
          lat: destination.latitude, 
          lng: destination.longitude 
        })} 
      />
    );
  }

  return (
    <div className="nearby-places">
      <h2>Lugares cercanos a {destination.name}</h2>
      
      <button onClick={clearPlaces}>Limpiar resultados</button>
      
      <div className="places-grid">
        {places.map(place => (
          <div key={place.id} className="place-card">
            {place.photo_url && (
              <img src={place.photo_url} alt={place.name} />
            )}
            <h3>{place.name}</h3>
            {place.rating && (
              <div className="rating">
                ⭐ {place.rating.toFixed(1)}
                {place.user_ratings_total && (
                  <span> ({place.user_ratings_total})</span>
                )}
              </div>
            )}
            {place.distance && (
              <p className="distance">
                📍 {formatDistance(place.distance)} de distancia
              </p>
            )}
            {place.vicinity && (
              <p className="vicinity">{place.vicinity}</p>
            )}
          </div>
        ))}
      </div>
      
      {places.length === 0 && (
        <EmptyState message="No se encontraron lugares cercanos" />
      )}
    </div>
  );
}

export default NearbyPlacesExplorer;
```

## 🔧 Configuración Avanzada

### Búsqueda con múltiples tipos

```typescript
function MultiTypeSearch() {
  const [selectedType, setSelectedType] = React.useState('restaurant');
  
  const { places, loading, fetchNearbyPlaces } = useNearbyPlaces({
    radius: 3000,
    type: selectedType,
    limit: 15,
  });

  const location = { lat: -12.0464, lng: -77.0428 };

  React.useEffect(() => {
    fetchNearbyPlaces(location);
  }, [selectedType, fetchNearbyPlaces]);

  return (
    <div>
      <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
        <option value="restaurant">Restaurantes</option>
        <option value="lodging">Hoteles</option>
        <option value="cafe">Cafés</option>
        <option value="bar">Bares</option>
        <option value="tourist_attraction">Atracciones</option>
      </select>
      
      {/* Renderizar places */}
    </div>
  );
}
```

## 💡 Tips y Mejores Prácticas

1. **Usa hooks especializados** cuando sea posible (`useNearbyRestaurants`, etc.)
2. **Ajusta el radio** según el contexto (ciudad vs. zona rural)
3. **Limita los resultados** para mejor performance
4. **Usa minRating** para filtrar lugares de baja calidad
5. **Maneja el estado de loading** para mejor UX
6. **Implementa manejo de errores** para casos de red
7. **Limpia los datos** cuando cambies de destino

## 🐛 Troubleshooting

### El hook no encuentra lugares

- Verifica que las coordenadas sean válidas
- Aumenta el `radius` de búsqueda
- Reduce el `minRating` si está muy alto
- Verifica que el tipo de lugar sea correcto

### Las distancias no son precisas

- Las distancias se calculan usando la fórmula de Haversine (línea recta)
- Para distancias reales por carretera, usa la Directions API de Google

### Errores de API

- Verifica que la API key de Google Maps esté configurada
- Asegúrate de que Places API esté habilitada en Google Cloud Console
- Revisa los límites de cuota de la API

## 📚 Referencias

- [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview)
- [Place Types](https://developers.google.com/maps/documentation/places/web-service/supported_types)
- [Haversine Formula](https://en.wikipedia.org/wiki/Haversine_formula)
