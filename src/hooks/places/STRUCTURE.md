# 📁 Estructura de Hooks Places

## 🎯 Archivos Principales

### **`index.ts`** - Barrel Exports
- **Función**: Exporta todos los hooks disponibles
- **Uso**: `import { usePlaces, usePlacesWithIA } from "../../hooks/places"`
- **Afecta**: Imports en componentes

### **`types.ts`** - Definiciones TypeScript
- **Función**: Interfaces y tipos para lugares, enriquecimiento, filtros
- **Contiene**: `Place`, `EnrichedPlace`, `PlaceCategory`, `PriceInfo`
- **Afecta**: Type safety en toda la aplicación

### **`usePlaces.ts`** - Hook Base
- **Función**: Búsqueda básica de lugares con Google Maps
- **Usa**: Google Places API, geolocalización
- **Afecta**: Maps.tsx, búsquedas simples

### **`usePlacesWithIA.ts`** - Hook con IA
- **Función**: Combina datos de Google + procesamiento IA
- **Flags**: `enableAI`, `enableEnrichment`
- **Afecta**: HotelesPage.tsx, datos inteligentes

### **`usePlacesWithFilters.ts`** - ❌ ELIMINADO (Redundante)
- **Razón**: Era solo un wrapper de `usePlacesWithIA`
- **Reemplazo**: Usar `usePlacesWithIA` directamente
- **Estado**: Archivo eliminado

## 📂 Carpetas Especializadas

### **`enrichment/`** - Enriquecimiento de Datos
- **`usePlacesEnrichment.ts`**: Enriquece lugares con Google Places Details
- **`enrichmentConfigs.ts`**: Configuración de campos por categoría
- **Afecta**: Datos detallados, precios, horarios, fotos

### **`categories/`** - Hooks por Categoría
- **`useBeaches.ts`**: Hook específico para playas
- **`useRestaurants.ts`**: Hook específico para restaurantes
- **`useHotelsTopRated.ts`**: Hook para hoteles top rated
- **`useDestinations.ts`**: Hook para destinos generales
- **`categoryConfigs.ts`**: Configuración por categoría (no exportado)
- **Afecta**: Páginas específicas de cada categoría

### **`photos/`** - Manejo de Fotos
- **`usePlacesPhotos.ts`**: Obtiene fotos de Google Places
- **Afecta**: Imágenes en cards y componentes

### **`search/`** - Búsquedas Avanzadas
- **`usePlacesSearch.ts`**: Búsqueda con múltiples estrategias
- **`searchStrategies.ts`**: Estrategias de búsqueda (no exportado)
- **Afecta**: Funcionalidad de búsqueda

### **`filters/`** - Filtros Inteligentes
- **`useIntelligentFilters.ts`**: Filtros basados en IA
- **Afecta**: Filtrado inteligente de resultados

### **`topRated/`** - Lugares Top Rated
- **`useTopRatedPlaces.ts`**: Hook para lugares mejor valorados
- **Afecta**: TopRatedSection, carruseles de destacados

### **`ai/`** - Servicios de IA
- **`useAIService.ts`**: Comunicación con backend de IA
- **Afecta**: Procesamiento inteligente de datos

### **`processors/`** - Procesadores de Datos
- **`amenitiesProcessor.ts`**: Procesa amenidades de lugares
- **`reviewsProcessor.ts`**: Procesa reviews y ratings
- **Afecta**: Datos enriquecidos

### **`base/`** - Hooks Base
- **`useGeolocation.ts`**: Manejo de geolocalización
- **`useGoogleMaps.ts`**: Inicialización de Google Maps
- **Afecta**: Funcionalidad base de mapas

### **`filter/`** - Sistema de Filtros
- **`usePlacesFilter.ts`**: Filtrado genérico
- **`filterFactory.ts`**: Factory de filtros (no exportado)
- **`filterStrategies.ts`**: Estrategias de filtrado (no exportado)
- **Afecta**: Filtrado en todas las categorías

### **`singleton/`** - Patrón Singleton
- **Estado**: Carpeta vacía (no implementado)
- **Función**: Instancias únicas de servicios (futuro)
- **Afecta**: Performance y consistencia (cuando se implemente)

## 🔄 Flujo de Datos

```
usePlaces (base) 
    ↓
usePlacesWithIA (enriquecimiento + IA)
    ↓
usePlacesWithIA (filtrado con IA)
    ↓
categories/ (específicos por tipo)
    ↓
Componentes (UI)
```

## 🎯 Uso Recomendado

- **Maps**: `usePlaces`
- **Páginas de categoría**: `usePlacesWithIA` + `categories/`
- **Filtrado**: `usePlacesWithIA`
- **Top rated**: `topRated/useTopRatedPlaces`
- **Búsquedas**: `search/usePlacesSearch`

## ⚠️ Archivos No Exportados (Internos)

### **Archivos de Configuración:**
- **`categories/categoryConfigs.ts`**: Configuraciones por categoría
- **`enrichment/enrichmentConfigs.ts`**: Configuración de campos de enriquecimiento
- **`search/searchStrategies.ts`**: Estrategias de búsqueda
- **`filter/filterFactory.ts`**: Factory de filtros
- **`filter/filterStrategies.ts`**: Estrategias de filtrado

### **Estado de Implementación:**
- **`singleton/`**: Carpeta vacía (no implementado)
- **Archivos de configuración**: Solo para uso interno
- **Estrategias**: Patrones de diseño no expuestos

## 🤖 Activación de IA (Cuando esté lista)

### **🔧 Pasos para Habilitar IA:**

#### **1. Configurar Variables de Entorno**
```env
# .env
VITE_AI_ENDPOINT=http://localhost:8000/api/hotels/analyze
VITE_AI_ENABLED=true
```

#### **2. Modificar HotelesPage.tsx**
```typescript
// Cambiar de:
const { places, loading, error } = usePlacesWithIA({
  category: "hotels",
  enableEnrichment: true,
  enableAI: false, // ← Cambiar a true
});

// A:
const { places, loading, error } = usePlacesWithIA({
  category: "hotels",
  enableEnrichment: true,
  enableAI: true, // ← Habilitar IA
});
```

#### **3. Verificar Backend de IA**
- **Endpoint**: `POST /api/hotels/analyze`
- **Payload**: `{ places: Place[], userPreferences?: any }`
- **Response**: `{ filteredPlaces: Place[], suggestions: string[] }`

#### **4. Archivos que se Activan Automáticamente:**
- **`ai/useAIService.ts`**: Comunicación con backend
- **`filters/useIntelligentFilters.ts`**: Filtros inteligentes
- **`processors/`**: Procesamiento de datos con IA

### **⚠️ Estado Actual:**
- **IA**: ❌ Deshabilitada (`enableAI: false`)
- **Enriquecimiento**: ✅ Habilitado (`enableEnrichment: true`)
- **Datos**: ✅ Funcionando con Google Places API

### **🚀 Cuando IA esté lista:**
1. Cambiar `enableAI: false` → `enableAI: true`
2. Configurar endpoint en variables de entorno
3. ¡Listo! Los datos inteligentes se activarán automáticamente
