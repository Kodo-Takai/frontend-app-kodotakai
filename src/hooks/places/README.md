# 🏨 Hooks de Places - Documentación Completa

## 📋 Arquitectura de Hooks

### **🎯 Hooks Principales**

#### **1. `usePlaces` - Hook Principal**
```typescript
// Maps.tsx
import { usePlaces } from "../../hooks/places";

const { places, mapCenter, loading, status } = usePlaces(
  activeCategories, 
  searchQuery
);
```

#### **2. `usePlacesWithIA` - Hook con IA**
```typescript
// Para filtros inteligentes y análisis avanzado
import { usePlacesWithIA } from "../../hooks/places";

const {
  places,
  filteredPlaces,
  loading,
  error,
  aiAnalysis,
  getFilteredPlaces
} = usePlacesWithIA({
  category: "hotels",
  requestedFilters: ["petfriendly", "lujo"],
  enableEnrichment: true,
  enableAI: true
});
```

#### **3. Hooks Específicos (Opcionales)**
```typescript
// Para hoteles básicos
import { useHotelsTopRated } from "../../hooks/places";
const { places, loading } = useHotelsTopRated({ radius: 30000, limit: 20 });

// Para playas
import { useBeaches } from "../../hooks/places";
const { places, loading } = useBeaches({ radius: 10000 });

// Para restaurantes
import { useRestaurants } from "../../hooks/places";
const { places, loading } = useRestaurants({ radius: 5000 });

// Para destinos
import { useDestinations } from "../../hooks/places";
const { places, loading } = useDestinations({ radius: 15000 });
```

## 🔧 Configuración por Escenario

### **📋 Escenario 1: Sin IA (Actual)**
```typescript
// HotelesPage.tsx - Configuración actual
const { places, loading, error } = useHotelsTopRated({
  radius: 30000,
  limit: 20
});

// Filtros básicos por keyword
const getPlacesByFilter = (filter: string) => {
  return places.filter(place => {
    // Lógica de filtrado básica
  });
};
```

**✅ Funcionalidades:**
- Carga hoteles con Google Maps API
- Filtros básicos por keyword
- Búsqueda de texto
- Sin procesamiento de IA

### **📋 Escenario 2: Con IA (Futuro)**
```typescript
// HotelesPage.tsx - Configuración futura
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
  enableEnrichment: true,  // ← Habilitado
  enableAI: true          // ← Habilitado
});
```

**✅ Funcionalidades:**
- Datos enriquecidos con Google Places Details API
- Filtros inteligentes basados en IA
- Análisis de reviews y amenities
- Confianza medible para cada resultado

## 🚀 Cómo Activar IA (Cuando Esté Lista)

### **🔧 Paso 1: Cambiar Hook en HotelesPage**
```typescript
// src/pages/categories/HotelesPage.tsx

// ELIMINAR:
import { useHotelsTopRated } from "../../hooks/places";
const { places, loading, error } = useHotelsTopRated({...});

// AGREGAR:
import { usePlacesWithIA } from "../../hooks/places";
const {
  places,
  filteredPlaces,
  loading,
  error,
  getPlacesByFilter,
  getFilterStatistics,
  activeFilters,
  updateActiveFilters
} = usePlacesWithIA({
  searchQuery,
  activeFilters: selectedBadge ? [selectedBadge] : [],
  category: "hotels",
  maxResults: 20,
  enableEnrichment: true,  // ← Cambiar a true
  enableAI: true          // ← Cambiar a true
});
```

### **🔧 Paso 2: Restaurar Funciones**
```typescript
// ELIMINAR funciones básicas:
const getPlacesByFilter = (filter: string) => { ... };
const getFilterStatistics = () => ({});
const activeFilters = selectedBadge ? [selectedBadge] : [];
const updateActiveFilters = () => {};

// RESTAURAR función de badges:
const handleBadgeClick = (badgeId: string) => {
  const newSelectedBadge = selectedBadge === badgeId ? null : badgeId;
  setSelectedBadge(newSelectedBadge);
  
  // Actualizar filtros activos
  const newActiveFilters = newSelectedBadge ? [newSelectedBadge] : [];
  updateActiveFilters(newActiveFilters);
};
```

### **🔧 Paso 3: Configurar Variables de Entorno**
```env
# Crear archivo .env.local en la raíz del proyecto
VITE_REACT_APP_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
VITE_AI_ENDPOINT=http://localhost:8000/api/hotels/analyze
```

### **🔧 Paso 4: Reiniciar Servidor**
```bash
npm run dev
```

## 📊 Hooks Disponibles por Categoría

### **🏨 Hooks de Hoteles**
```typescript
// Básico (actual)
import { useHotelsTopRated } from "../../hooks/places";

// Genérico para todas las categorías (recomendado)
import { usePlacesWithIA } from "../../hooks/places";
```

### **🏖️ Hooks de Playas**
```typescript
// Genérico con filtros (recomendado)
import { usePlacesWithIA } from "../../hooks/places";
const { places, loading, getPlacesByFilter } = usePlacesWithIA({
  category: "beaches",
  activeFilters: ["surf", "pesca"]
});
```

### **🍽️ Hooks de Restaurantes**
```typescript
// Genérico con filtros (recomendado)
import { usePlacesWithIA } from "../../hooks/places";
const { places, loading, getPlacesByFilter } = usePlacesWithIA({
  category: "restaurants",
  activeFilters: ["vegetariano", "mariscos"]
});
```

### **🗺️ Hooks de Destinos**
```typescript
// Genérico con filtros (recomendado)
import { usePlacesWithIA } from "../../hooks/places";
const { places, loading, getPlacesByFilter } = usePlacesWithIA({
  category: "destinations",
  activeFilters: ["historico", "natural"]
});
```

### **🔍 Hooks de Búsqueda**
```typescript
// Búsqueda simple
import { usePlacesSimple } from "../../hooks/places";

// Búsqueda avanzada
import { usePlacesSearch } from "../../hooks/places";
```

## 🎯 Filtros Disponibles

### **📋 Filtros Básicos (Sin IA)**
- **`petfriendly`** - Por keywords "pet", "mascota"
- **`lujo`** - Rating >= 4.5
- **`economic`** - Rating <= 3.5
- **`playa`** - Keywords "playa", "beach"
- **`piscina`** - Keywords "piscina", "pool"

### **🧠 Filtros Inteligentes (Con IA)**
- **`petfriendly`** - Análisis de reviews y amenities
- **`lujo`** - Análisis de características y rating
- **`economic`** - Análisis de precio y características
- **`beach`** - Análisis de ubicación y amenities
- **`pool`** - Análisis de amenities específicos

## 🔧 Configuración de Variables de Entorno

### **📋 Variables Requeridas**
```env
# Google Maps API Key
VITE_REACT_APP_GOOGLE_MAPS_API_KEY=tu_api_key_aqui

# IA Python Endpoint (solo cuando IA esté lista)
VITE_AI_ENDPOINT=http://localhost:8000/api/hotels/analyze
```

### **📋 Variables Opcionales**
```env
# Backend URL (opcional)
VITE_REACT_APP_BACKEND_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

## 🚀 Beneficios por Escenario

### **✅ Sin IA (Actual)**
- **Funcionalidad básica** estable
- **Filtros por keyword** funcionando
- **Búsqueda de texto** operativa
- **Sin dependencias** externas
- **Performance** optimizada

### **✅ Con IA (Futuro)**
- **Datos enriquecidos** con Google Places Details API
- **Filtros inteligentes** basados en IA
- **Análisis de reviews** y sentimientos
- **Amenities detectados** automáticamente
- **Confianza medible** para cada resultado

## 🔍 Verificación Post-Activación

### **✅ Verificar Variables de Entorno**
```javascript
// En DevTools Console
console.log(import.meta.env.VITE_AI_ENDPOINT);
console.log(import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY);
```

### **✅ Verificar Funcionamiento**
- **HotelesPage** carga hoteles
- **Filtros por badges** funcionan
- **Búsqueda de texto** opera
- **Sin errores** en consola

### **✅ Verificar IA**
- **Endpoint** responde correctamente
- **Filtros inteligentes** funcionan
- **Datos enriquecidos** se muestran
- **Confianza** se calcula correctamente

## 📋 Resumen de Cambios para Activar IA

### **🔧 Solo 3 Archivos a Cambiar:**
1. **`src/pages/categories/HotelesPage.tsx`** - Cambiar hook y funciones
2. **`.env.local`** - Agregar variables de entorno
3. **Reiniciar servidor** - `npm run dev`

### **✅ Todo lo Demás Ya Está Listo:**
- **Hooks de IA** - ✅ Implementados
- **Procesadores** - ✅ Implementados
- **Configuraciones** - ✅ Implementadas
- **Tipos** - ✅ Implementados
- **Filtros inteligentes** - ✅ Implementados

## 🎯 Endpoint de IA Esperado

### **🔧 Formato de Request**
```json
POST /api/hotels/analyze
{
  "places": [
    {
      "place_id": "ChIJ...",
      "name": "Hotel Example",
      "reviews": [...],
      "editorial_summary": {...},
      "amenities": [...]
    }
  ],
  "filters": ["petfriendly", "luxury", "pool"],
  "location": { "lat": -12.0464, "lng": -77.0428 }
}
```

### **🔧 Formato de Response**
```json
{
  "ChIJ...": {
    "categories": {
      "petfriendly": { "confidence": 0.9, "detected": true },
      "luxury": { "confidence": 0.95, "detected": true },
      "pool": { "confidence": 0.8, "detected": true }
    },
    "overall_confidence": 0.88,
    "processed_at": "2024-01-01T00:00:00Z"
  }
}
```

**¡Solo necesitas cambiar 3 cosas para activar toda la funcionalidad de IA!** 🚀✨