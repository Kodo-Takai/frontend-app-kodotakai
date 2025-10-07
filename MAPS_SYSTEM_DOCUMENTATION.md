# 📍 Sistema de Maps - Documentación Completa

## 🎯 **Descripción General**

El sistema de Maps es una funcionalidad completa que permite a los usuarios visualizar lugares en un mapa interactivo, buscar por categorías, realizar búsquedas por texto y obtener información detallada de lugares cercanos a su ubicación.

## 🏗️ **Arquitectura del Sistema**

### **Componentes Principales:**

```
📁 Sistema de Maps
├── 🗺️ Maps.tsx (Página principal)
├── 🎯 MapDisplay (Componente de mapa)
├── 🔍 usePlaces (Hook principal)
├── 🛠️ GoogleMapsService (Servicio de Google Maps)
├── 🧠 SmartSearchService (Búsqueda inteligente)
└── 📊 EnrichmentService (Enriquecimiento de datos)
```

## 📋 **Componentes y Responsabilidades**

### **1. Maps.tsx - Página Principal**
**Ubicación:** `src/pages/Maps.tsx`

**Responsabilidades:**
- ✅ Interfaz de usuario principal
- ✅ Gestión de estados (búsqueda, categorías, zoom)
- ✅ Mapeo de categorías entre UI y backend
- ✅ Lógica de zoom dinámico
- ✅ Texto dinámico según contexto

**Estados Principales:**
```typescript
const [isApiReady, setIsApiReady] = useState(false);
const [isFilterVisible, setIsFilterVisible] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
const [activeCategories, setActiveCategories] = useState<'all' | 'beaches' | 'restaurants' | 'hotels' | 'destinations'>('all');
const [zoom, setZoom] = useState(12);
```

**Mapeo de Categorías:**
```typescript
const categoryMapping: Record<string, 'all' | 'beaches' | 'restaurants' | 'hotels' | 'destinations'> = {
  'all': 'all',
  'lodging': 'hotels',
  'shopping_mall': 'destinations',
  'restaurant': 'restaurants',
  'point_of_interest': 'destinations',
  'stadium': 'destinations'
};
```

### **2. MapDisplay - Componente de Mapa**
**Ubicación:** `src/components/cards/mapDisplay/index.tsx`

**Responsabilidades:**
- ✅ Renderizado del mapa de Google Maps
- ✅ Gestión de marcadores
- ✅ InfoWindows con información de lugares
- ✅ Marcador de ubicación del usuario
- ✅ Ajuste automático de zoom

**Props:**
```typescript
interface MapDisplayProps {
  center: { lat: number; lng: number };
  zoom: number;
  markers: Place[];
}
```

**Características:**
- 🎯 **Marcador de usuario**: Círculo azul personalizado
- 📍 **Marcadores de lugares**: Con animación DROP
- 💬 **InfoWindows**: Con foto, nombre y rating
- 🔍 **Zoom inteligente**: Ajuste automático según cantidad de marcadores

### **3. usePlaces - Hook Principal**
**Ubicación:** `src/hooks/places/usePlaces.ts`

**Responsabilidades:**
- ✅ Gestión de datos de lugares
- ✅ Coordinación entre servicios
- ✅ Manejo de estados de carga
- ✅ Gestión de errores

**Parámetros:**
```typescript
{
  category: PlaceCategory;
  searchQuery?: string;
  enableEnrichment?: boolean;
  maxResults?: number;
}
```

**Retorna:**
```typescript
{
  places: EnrichedPlace[];
  mapCenter: LatLng;
  loading: boolean;
  status: string;
  error: string | null;
}
```

### **4. GoogleMapsService - Servicio de Google Maps**
**Ubicación:** `src/hooks/places/services/GoogleMapsService.ts`

**Responsabilidades:**
- ✅ Carga de Google Maps API
- ✅ Obtención de ubicación del usuario
- ✅ Búsqueda de lugares
- ✅ Formateo de resultados

**Métodos Principales:**
```typescript
static async loadApi(): Promise<void>
static async getUserLocation(): Promise<LatLng>
static createService(): google.maps.places.PlacesService
static async searchNearby(service, location, type): Promise<PlaceResult[]>
static async searchByText(service, query): Promise<PlaceResult[]>
static formatPlaceResult(p): Place | null
```

**Configuración:**
```typescript
const FALLBACK_LOCATION: LatLng = { lat: -12.0464, lng: -77.0428 };
const SEARCH_RADII = [2000, 10000, 30000];
```

### **5. SmartSearchService - Búsqueda Inteligente**
**Ubicación:** `src/hooks/places/services/SmartSearchService.ts`

**Responsabilidades:**
- ✅ Búsqueda múltiple con diferentes radios
- ✅ Eliminación de duplicados
- ✅ Filtrado por categoría
- ✅ Optimización de resultados

**Método Principal:**
```typescript
static async searchPlaces(
  category: PlaceCategory,
  userLocation: LatLng,
  maxResults: number = 20
): Promise<Place[]>
```

**Estrategia de Búsqueda:**
1. 🔍 **Búsqueda múltiple**: Con radios [2000, 10000, 30000] metros
2. 🔄 **Eliminación de duplicados**: Por place_id
3. 🎯 **Filtrado**: Por rating, fotos y reviews
4. 📊 **Limitación**: Máximo de resultados especificado

## 🛠️ **Mantenimiento y Configuración**

### **1. Cambiar Ubicación de Fallback**

**Archivo:** `src/hooks/places/services/GoogleMapsService.ts`

```typescript
// Cambiar estas constantes
const FALLBACK_LOCATION: LatLng = { lat: -12.0464, lng: -77.0428 }; // Lima, Perú
```

**Para cambiar a otra ciudad:**
```typescript
// Ejemplo: Madrid, España
const FALLBACK_LOCATION: LatLng = { lat: 40.4168, lng: -3.7038 };
```

### **2. Ajustar Radios de Búsqueda**

**Archivo:** `src/hooks/places/services/SmartSearchService.ts`

```typescript
const SEARCH_RADII = [2000, 10000, 30000]; // En metros
```

**Opciones de configuración:**
- **Búsqueda local**: `[1000, 3000, 5000]`
- **Búsqueda amplia**: `[5000, 15000, 30000]`
- **Búsqueda urbana**: `[2000, 10000, 30000]` (actual)

### **3. Modificar Filtros de Calidad**

**Archivo:** `src/hooks/places/services/GoogleMapsService.ts`

```typescript
static formatPlaceResult(p: google.maps.places.PlaceResult): any {
  if (!p.place_id || !p.name || !p.geometry?.location) return null;
  if (!p.rating || p.rating < 1.5) return null; // Rating mínimo
  if (!p.photos || p.photos.length === 0) return null; // Requiere fotos
  if (!p.user_ratings_total || p.user_ratings_total < 1) return null; // Reviews mínimas
  // ...
}
```

**Ajustes recomendados:**
- **Más estricto**: `rating < 2.0`, `user_ratings_total < 3`
- **Más permisivo**: `rating < 1.0`, `user_ratings_total < 1`

### **4. Configurar Categorías**

**Archivo:** `src/pages/Maps.tsx`

```typescript
const categoryMapping: Record<string, 'all' | 'beaches' | 'restaurants' | 'hotels' | 'destinations'> = {
  'all': 'all',
  'lodging': 'hotels',
  'shopping_mall': 'destinations',
  'restaurant': 'restaurants',
  'point_of_interest': 'destinations',
  'stadium': 'destinations'
};
```

**Para agregar nuevas categorías:**
1. Actualizar el tipo `activeCategories`
2. Agregar mapeo en `categoryMapping`
3. Actualizar `categoryNames` en el texto dinámico

### **5. Ajustar Zoom Dinámico**

**Archivo:** `src/pages/Maps.tsx`

```typescript
useEffect(() => {
  if (searchQuery && placesToShow.length === 1) {
    setZoom(18); // Zoom muy alto para resultado específico
  } else if (placesToShow.length > 0) {
    setZoom(15); // Zoom medio-alto para lugares cercanos
  } else {
    setZoom(15); // Zoom medio-alto para zona del usuario
  }
}, [searchQuery, placesToShow]);
```

**Niveles de zoom recomendados:**
- **Zoom 18-20**: Resultado específico
- **Zoom 15-17**: Pocos lugares (1-5)
- **Zoom 12-14**: Muchos lugares (6+)
- **Zoom 10-12**: Vista general

## 🔧 **Solución de Problemas Comunes**

### **1. Mapa no se carga**

**Síntomas:**
- Muestra "Cargando mapa..." indefinidamente
- Error en consola sobre Google Maps API

**Soluciones:**
1. **Verificar API Key:**
   ```bash
   # En .env
   VITE_REACT_APP_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
   ```

2. **Verificar dominios autorizados:**
   - Agregar `localhost:5173` en Google Cloud Console
   - Agregar dominio de producción

3. **Verificar cuotas de API:**
   - Revisar límites en Google Cloud Console
   - Verificar facturación

### **2. No encuentra lugares**

**Síntomas:**
- Mapa se carga pero no aparecen marcadores
- Mensaje "0 lugares encontrados"

**Soluciones:**
1. **Verificar ubicación:**
   ```typescript
   // En GoogleMapsService.ts
   console.log("User location obtained:", location);
   ```

2. **Ajustar filtros:**
   ```typescript
   // Reducir filtros en formatPlaceResult
   if (!p.rating || p.rating < 1.0) return null; // Más permisivo
   ```

3. **Verificar categoría:**
   ```typescript
   // En SmartSearchService.ts
   console.log(`SmartSearchService - Buscando ${category} cerca de:`, userLocation);
   ```

### **3. Ubicación incorrecta**

**Síntomas:**
- Mapa se centra en ubicación incorrecta
- No usa la ubicación real del usuario

**Soluciones:**
1. **Verificar permisos de geolocalización:**
   - Asegurar que el navegador tenga permisos
   - Verificar HTTPS en producción

2. **Verificar fallback:**
   ```typescript
   // En GoogleMapsService.ts
   const FALLBACK_LOCATION: LatLng = { lat: -12.0464, lng: -77.0428 };
   ```

3. **Forzar nueva ubicación:**
   ```typescript
   // Usar forceNewLocation si es necesario
   const userLocation = await GoogleMapsService.forceNewLocation();
   ```

### **4. Marcadores no aparecen**

**Síntomas:**
- Lugares se encuentran pero no se muestran marcadores
- InfoWindows no funcionan

**Soluciones:**
1. **Verificar datos de lugares:**
   ```typescript
   // En MapDisplay
   console.log("Markers received:", markers);
   ```

2. **Verificar ubicaciones:**
   ```typescript
   // Asegurar que place.location existe
   if (!place.location) {
     console.warn("Place without location:", place);
     return;
   }
   ```

3. **Verificar Google Maps API:**
   - Asegurar que `places` library esté cargada
   - Verificar que `PlacesService` esté disponible

## 📊 **Monitoreo y Logs**

### **Logs Importantes:**

```typescript
// En GoogleMapsService.ts
console.log("User location obtained:", location);

// En SmartSearchService.ts
console.log(`SmartSearchService - Buscando ${category} cerca de:`, userLocation);
console.log(`SmartSearchService - Resultados brutos: ${combinedResults.length}`);
console.log(`SmartSearchService - Lugares finales: ${places.length}`);

// En MapDisplay
console.log("MapDisplay - center recibido:", center);
console.log("MapDisplay - Centrando mapa en:", center);
```

### **Métricas a Monitorear:**

1. **Tiempo de carga de API**
2. **Precisión de geolocalización**
3. **Cantidad de resultados por búsqueda**
4. **Tiempo de respuesta de búsquedas**
5. **Errores de API**

## 🚀 **Mejoras Futuras**

### **Funcionalidades Sugeridas:**

1. **🗺️ Clustering de marcadores**: Para muchos lugares
2. **📍 Búsqueda por área**: Dibujar área en el mapa
3. **🔄 Actualización automática**: Refresh periódico
4. **📱 Modo offline**: Cache de lugares
5. **🎨 Temas de mapa**: Modo oscuro/claro
6. **📊 Analytics**: Tracking de uso
7. **🔍 Filtros avanzados**: Por rating, precio, etc.

### **Optimizaciones Técnicas:**

1. **⚡ Lazy loading**: Cargar marcadores bajo demanda
2. **🔄 Debouncing**: Para búsquedas de texto
3. **💾 Cache inteligente**: Persistir resultados
4. **📱 PWA**: Funcionalidad offline
5. **🎯 SEO**: Meta tags para compartir

## 📚 **Referencias Técnicas**

### **APIs Utilizadas:**
- **Google Maps JavaScript API**: Renderizado del mapa
- **Google Places API**: Búsqueda de lugares
- **Geolocation API**: Ubicación del usuario

### **Librerías:**
- **React**: Framework principal
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos
- **React Icons**: Iconografía

### **Configuración de Entorno:**
```bash
# Variables de entorno requeridas
VITE_REACT_APP_GOOGLE_MAPS_API_KEY=tu_api_key
```

---

## 📞 **Soporte y Contacto**

Para problemas técnicos o mejoras, revisar:
1. **Logs de consola** para errores específicos
2. **Google Cloud Console** para cuotas y configuración
3. **Documentación de Google Maps API** para funcionalidades avanzadas

**Mantenimiento regular recomendado:**
- ✅ Revisar cuotas de API mensualmente
- ✅ Actualizar API keys anualmente
- ✅ Monitorear rendimiento de búsquedas
- ✅ Verificar compatibilidad con nuevas versiones de navegadores
