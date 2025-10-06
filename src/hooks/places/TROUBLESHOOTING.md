# 🔧 Troubleshooting - Hooks de Places

## 📋 Errores Comunes y Soluciones

### **❌ Error: "process is not defined"**
**Causa:** Uso de `process.env` en lugar de `import.meta.env`
**Solución:** Cambiar a `import.meta.env.VITE_*`

```typescript
// ❌ Incorrecto
const apiKey = process.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;

// ✅ Correcto
const apiKey = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;
```

### **❌ Error: "useMemo is not defined"**
**Causa:** Import faltante de React hooks
**Solución:** Agregar import de `useMemo` y `useCallback`

```typescript
// ❌ Incorrecto
import { useState, useEffect } from "react";

// ✅ Correcto
import { useState, useEffect, useMemo, useCallback } from "react";
```

### **❌ Error: "Maximum update depth exceeded"**
**Causa:** Dependencias inestables en `useEffect`
**Solución:** Optimizar dependencias o usar `useRef`

```typescript
// ❌ Incorrecto
useEffect(() => {
  // Lógica que causa re-renders infinitos
}, [places, processPlaces]);

// ✅ Correcto
useEffect(() => {
  // Lógica optimizada
}, [places.length, enableEnrichment, enableAI]);
```

### **❌ Error: "API key not found"**
**Causa:** Variable de entorno no configurada
**Solución:** Verificar que `VITE_REACT_APP_GOOGLE_MAPS_API_KEY` esté en `.env.local`

```env
# .env.local
VITE_REACT_APP_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

### **❌ Error: "IA endpoint not found"**
**Causa:** Variable de entorno no configurada
**Solución:** Verificar que `VITE_AI_ENDPOINT` esté en `.env.local`

```env
# .env.local
VITE_AI_ENDPOINT=http://localhost:8000/api/hotels/analyze
```

### **❌ Error: "Cannot read properties of undefined (reading 'maps')"**
**Causa:** Google Maps API no cargada
**Solución:** Esperar a que la API esté disponible

```typescript
// ❌ Incorrecto
const service = new window.google.maps.places.PlacesService(div);

// ✅ Correcto
await loadGoogleMapsApi();
if (window.google?.maps?.places) {
  const service = new window.google.maps.places.PlacesService(div);
}
```

### **❌ Error: "Each child in a list should have a unique key prop"**
**Causa:** Componentes en lista sin `key` único
**Solución:** Agregar `key` único a cada elemento

```typescript
// ❌ Incorrecto
{places.map(place => <PlaceCard place={place} />)}

// ✅ Correcto
{places.map(place => <PlaceCard key={place.place_id || `place-${index}`} place={place} />)}
```

## 🔍 Verificación de Configuración

### **✅ Verificar Variables de Entorno**
```javascript
// En DevTools Console
console.log(import.meta.env.VITE_AI_ENDPOINT);
console.log(import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY);
```

### **✅ Verificar Google Maps API**
```javascript
// En DevTools Console
console.log(window.google?.maps?.places);
```

### **✅ Verificar IA Endpoint**
```javascript
// En DevTools Console
fetch(import.meta.env.VITE_AI_ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ test: true })
})
.then(response => console.log('IA endpoint:', response.status))
.catch(error => console.log('IA endpoint error:', error));
```

## 🚀 Soluciones por Escenario

### **📋 Escenario 1: Sin IA (Actual)**
```typescript
// HotelesPage.tsx - Configuración estable
import { useHotelsTopRated } from "../../hooks/places";

const { places, loading, error } = useHotelsTopRated({
  radius: 30000,
  limit: 20
});

// Variables de entorno mínimas
VITE_REACT_APP_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

### **📋 Escenario 2: Con IA (Futuro)**
```typescript
// HotelesPage.tsx - Configuración híbrida
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

// Variables de entorno completas
VITE_REACT_APP_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
VITE_AI_ENDPOINT=http://localhost:8000/api/hotels/analyze
```

## 🔧 Debugging Avanzado

### **✅ Verificar Hooks**
```typescript
// En DevTools Console
console.log('useHotelsTopRated:', useHotelsTopRated);
console.log('useHotelsWithFilters:', useHotelsWithFilters);
console.log('usePlacesSimple:', usePlacesSimple);
```

### **✅ Verificar Estados**
```typescript
// En DevTools Console
console.log('places:', places);
console.log('loading:', loading);
console.log('error:', error);
```

### **✅ Verificar Filtros**
```typescript
// En DevTools Console
console.log('activeFilters:', activeFilters);
console.log('filteredPlaces:', filteredPlaces);
console.log('filterStats:', getFilterStatistics());
```

## 📋 Checklist de Verificación

### **✅ Configuración Básica**
- [ ] Variables de entorno configuradas
- [ ] Google Maps API key válida
- [ ] Servidor reiniciado
- [ ] Sin errores en consola

### **✅ Funcionalidad Básica**
- [ ] HotelesPage carga hoteles
- [ ] Filtros por badges funcionan
- [ ] Búsqueda de texto opera
- [ ] Maps muestra lugares

### **✅ Funcionalidad Avanzada (Con IA)**
- [ ] IA endpoint responde
- [ ] Filtros inteligentes funcionan
- [ ] Datos enriquecidos se muestran
- [ ] Confianza se calcula correctamente

## 🎯 Soluciones Rápidas

### **🔧 Error de Import**
```typescript
// Agregar import faltante
import { useMemo, useCallback } from "react";
```

### **🔧 Error de Dependencias**
```typescript
// Optimizar dependencias
useEffect(() => {
  // Lógica
}, [places.length, enableEnrichment, enableAI]);
```

### **🔧 Error de Variables de Entorno**
```env
# Verificar .env.local
VITE_REACT_APP_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
VITE_AI_ENDPOINT=http://localhost:8000/api/hotels/analyze
```

### **🔧 Error de Google Maps**
```typescript
// Esperar a que la API esté disponible
await loadGoogleMapsApi();
if (window.google?.maps?.places) {
  // Usar la API
}
```

**¡Soluciones para todos los errores comunes!** 🚀✨
