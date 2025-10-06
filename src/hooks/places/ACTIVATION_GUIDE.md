# 🚀 Guía de Activación de IA

## 📋 Cambios Necesarios para Habilitar IA

### **🔧 Archivo 1: HotelesPage.tsx**

#### **❌ ELIMINAR (Código actual):**
```typescript
// Import actual
import { useHotelsTopRated } from "../../hooks/places";

// Hook actual
const { places, loading, error } = useHotelsTopRated({
  radius: 30000,
  limit: 20
});

// Funciones básicas actuales
const getPlacesByFilter = (filter: string) => {
  if (filter === "todo" || !filter) return places;
  
  return places.filter(place => {
    const lowerName = place.name.toLowerCase();
    const lowerVicinity = place.vicinity?.toLowerCase() || "";
    
    switch (filter) {
      case "petfriendly":
        return lowerName.includes("pet") || lowerName.includes("mascota") || 
               lowerVicinity.includes("pet") || lowerVicinity.includes("mascota");
      case "lujo":
        return place.rating && place.rating >= 4.5;
      case "economic":
        return place.rating && place.rating <= 3.5;
      case "playa":
        return lowerName.includes("playa") || lowerName.includes("beach") || 
               lowerVicinity.includes("playa") || lowerVicinity.includes("beach");
      case "piscina":
        return lowerName.includes("piscina") || lowerName.includes("pool") || 
               lowerVicinity.includes("piscina") || lowerVicinity.includes("pool");
      default:
        return true;
    }
  });
};

const getFilterStatistics = () => ({});
const activeFilters = selectedBadge ? [selectedBadge] : [];
const updateActiveFilters = () => {};

// Función de badges actual
const handleBadgeClick = (badgeId: string) => {
  const newSelectedBadge = selectedBadge === badgeId ? null : badgeId;
  setSelectedBadge(newSelectedBadge);
};
```

#### **✅ AGREGAR (Código nuevo):**
```typescript
// Import nuevo
import { usePlacesWithFilters } from "../../hooks/places";

// Hook nuevo
const {
  places,
  filteredPlaces,
  loading,
  error,
  getPlacesByFilter,
  getFilterStatistics,
  activeFilters,
  updateActiveFilters
} = usePlacesWithFilters({
  searchQuery,
  activeFilters: selectedBadge ? [selectedBadge] : [],
  category: "hotels",
  maxResults: 20,
  enableEnrichment: true,  // ← Cambiar a true
  enableAI: true          // ← Cambiar a true
});

// Función de badges nueva
const handleBadgeClick = (badgeId: string) => {
  const newSelectedBadge = selectedBadge === badgeId ? null : badgeId;
  setSelectedBadge(newSelectedBadge);
  
  // Actualizar filtros activos
  const newActiveFilters = newSelectedBadge ? [newSelectedBadge] : [];
  updateActiveFilters(newActiveFilters);
```

### **🔧 Archivo 2: .env.local**

#### **✅ CREAR archivo en la raíz del proyecto:**
```env
# Google Maps API Key
VITE_REACT_APP_GOOGLE_MAPS_API_KEY=tu_api_key_aqui

# IA Python Endpoint
VITE_AI_ENDPOINT=http://localhost:8000/api/hotels/analyze

# Backend URL (opcional)
VITE_REACT_APP_BACKEND_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

### **🔧 Archivo 3: Reiniciar Servidor**

#### **✅ EJECUTAR:**
```bash
npm run dev
```

## 📊 Comparación de Funcionalidades

### **❌ Sin IA (Actual)**
- **Filtros básicos** por keyword
- **Búsqueda simple** de texto
- **Datos básicos** de Google Maps
- **Sin procesamiento** de IA
- **Performance** optimizada

### **✅ Con IA (Futuro)**
- **Filtros inteligentes** basados en IA
- **Datos enriquecidos** con Google Places Details API
- **Análisis de reviews** y sentimientos
- **Amenities detectados** automáticamente
- **Confianza medible** para cada resultado

## 🔍 Verificación Post-Activación

### **✅ Paso 1: Verificar Variables de Entorno**
```javascript
// En DevTools Console
console.log(import.meta.env.VITE_AI_ENDPOINT);
console.log(import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY);
```

### **✅ Paso 2: Verificar Funcionamiento**
- **HotelesPage** carga hoteles
- **Filtros por badges** funcionan
- **Búsqueda de texto** opera
- **Sin errores** en consola

### **✅ Paso 3: Verificar IA**
- **Endpoint** responde correctamente
- **Filtros inteligentes** funcionan
- **Datos enriquecidos** se muestran
- **Confianza** se calcula correctamente

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

## 📋 Resumen de Cambios

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

**¡Solo necesitas cambiar 3 cosas para activar toda la funcionalidad de IA!** 🚀✨
