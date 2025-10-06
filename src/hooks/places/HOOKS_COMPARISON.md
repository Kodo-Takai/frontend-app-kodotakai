# 🔍 Comparación de Hooks

## 📋 Hooks Disponibles

### **🏨 Hooks de Hoteles**

#### **1. useHotelsTopRated (Actual - Sin IA)**
```typescript
import { useHotelsTopRated } from "../../hooks/places";

const { places, loading, error } = useHotelsTopRated({
  radius: 30000,
  limit: 20
});
```

**✅ Funcionalidades:**
- Carga hoteles con Google Maps API
- Filtros básicos por keyword
- Búsqueda de texto
- Sin procesamiento de IA

**❌ Limitaciones:**
- Filtros básicos por keyword
- Sin análisis de reviews
- Sin amenities detectados
- Sin confianza medible

#### **2. usePlacesWithFilters (Genérico - Con IA)**
```typescript
import { usePlacesWithFilters } from "../../hooks/places";

const {
  places,
  filteredPlaces,
  loading,
  error,
  getPlacesByFilter,
  getFilterStatistics
} = usePlacesWithFilters({
  searchQuery,
  activeFilters: selectedBadge ? [selectedBadge] : [],
  category: "hotels",
  maxResults: 20,
  enableEnrichment: true,
  enableAI: true
});
```

**✅ Funcionalidades:**
- Datos enriquecidos con Google Places Details API
- Filtros inteligentes basados en IA
- Análisis de reviews y sentimientos
- Amenities detectados automáticamente
- Confianza medible para cada resultado

**❌ Limitaciones:**
- Requiere IA backend
- Mayor complejidad
- Dependencias externas

### **🗺️ Hooks de Búsqueda**

#### **1. usePlacesSimple (Maps.tsx)**
```typescript
import { usePlacesSimple } from "../../hooks/places";

const { places, mapCenter, loading, status } = usePlacesSimple(
  activeCategories, 
  searchQuery
);
```

**✅ Funcionalidades:**
- Búsqueda simple de lugares
- Filtros por categoría
- Búsqueda de texto
- Optimizado para Maps

#### **2. usePlacesSearch (Avanzado)**
```typescript
import { usePlacesSearch } from "../../hooks/places";

const { places, loading, error } = usePlacesSearch({
  searchMethod: 'nearby',
  location: userLocation,
  radius: 5000,
  type: 'lodging'
});
```

**✅ Funcionalidades:**
- Búsqueda avanzada con múltiples estrategias
- Filtros por tipo de lugar
- Búsqueda por ubicación
- Búsqueda por texto

### **🏖️ Hooks por Categoría**

#### **1. useBeaches (Playas)**
```typescript
import { useBeaches } from "../../hooks/places";

const { places, loading } = useBeaches({ radius: 10000 });
```

#### **2. useRestaurants (Restaurantes)**
```typescript
import { useRestaurants } from "../../hooks/places";

const { places, loading } = useRestaurants({ radius: 5000 });
```

#### **3. useDestinations (Destinos)**
```typescript
import { useDestinations } from "../../hooks/places";

const { places, loading } = useDestinations({ radius: 15000 });
```

## 🎯 Casos de Uso por Hook

### **📋 HotelesPage.tsx**

#### **❌ Sin IA (Actual)**
```typescript
// Hook básico
const { places, loading, error } = useHotelsTopRated({
  radius: 30000,
  limit: 20
});

// Filtros básicos
const getPlacesByFilter = (filter: string) => {
  return places.filter(place => {
    // Lógica de filtrado básica por keyword
  });
};
```

#### **✅ Con IA (Futuro)**
```typescript
// Hook híbrido
const {
  places,
  filteredPlaces,
  loading,
  error,
  getPlacesByFilter,
  getFilterStatistics
} = useHotelsWithFilters({
  searchQuery,
  activeFilters: selectedBadge ? [selectedBadge] : [],
  maxResults: 20,
  enableEnrichment: true,
  enableAI: true
});
```

### **📋 Maps.tsx**

#### **✅ Búsqueda Simple**
```typescript
// Hook optimizado para Maps
const { places, mapCenter, loading, status } = usePlacesSimple(
  activeCategories, 
  searchQuery
);
```

### **📋 Otras Páginas**

#### **✅ Hooks Específicos**
```typescript
// Para playas
import { useBeaches } from "../../hooks/places";

// Para restaurantes
import { useRestaurants } from "../../hooks/places";

// Para destinos
import { useDestinations } from "../../hooks/places";
```

## 🔧 Configuración por Escenario

### **📋 Escenario 1: Sin IA (Actual)**
```typescript
// HotelesPage.tsx
import { useHotelsTopRated } from "../../hooks/places";

const { places, loading, error } = useHotelsTopRated({
  radius: 30000,
  limit: 20
});

// Variables de entorno
VITE_REACT_APP_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

### **📋 Escenario 2: Con IA (Futuro)**
```typescript
// HotelesPage.tsx
import { useHotelsWithFilters } from "../../hooks/places";

const {
  places,
  filteredPlaces,
  loading,
  error,
  getPlacesByFilter,
  getFilterStatistics
} = useHotelsWithFilters({
  searchQuery,
  activeFilters: selectedBadge ? [selectedBadge] : [],
  maxResults: 20,
  enableEnrichment: true,
  enableAI: true
});

// Variables de entorno
VITE_REACT_APP_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
VITE_AI_ENDPOINT=http://localhost:8000/api/hotels/analyze
```

## 🚀 Beneficios por Hook

### **✅ useHotelsTopRated (Sin IA)**
- **Funcionalidad básica** estable
- **Filtros por keyword** funcionando
- **Búsqueda de texto** operativa
- **Sin dependencias** externas
- **Performance** optimizada

### **✅ usePlacesWithFilters (Genérico con IA)**
- **Datos enriquecidos** con Google Places Details API
- **Filtros inteligentes** basados en IA
- **Análisis de reviews** y sentimientos
- **Amenities detectados** automáticamente
- **Confianza medible** para cada resultado
- **Funciona para todas las categorías**

### **✅ usePlacesSimple (Maps)**
- **Búsqueda simple** de lugares
- **Filtros por categoría** funcionando
- **Búsqueda de texto** operativa
- **Optimizado para Maps**

### **✅ Hooks Específicos (Otras Páginas)**
- **Funcionalidad específica** por categoría
- **Filtros optimizados** por tipo
- **Búsqueda especializada** por lugar
- **Performance** optimizada

## 📋 Resumen de Recomendaciones

### **🏨 Para HotelesPage:**
- **Sin IA:** `useHotelsTopRated` (actual)
- **Con IA:** `usePlacesWithFilters` con `category: "hotels"` (futuro)

### **🗺️ Para Maps.tsx:**
- **Búsqueda simple:** `usePlacesSimple` (actual)

### **🏖️ Para Otras Páginas:**
- **Playas:** `useBeaches`
- **Restaurantes:** `useRestaurants`
- **Destinos:** `useDestinations`

**¡Arquitectura modular y escalable para todos los casos de uso!** 🚀✨
