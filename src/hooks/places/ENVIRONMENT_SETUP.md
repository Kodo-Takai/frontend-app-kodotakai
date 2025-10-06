# 🔧 Configuración de Variables de Entorno

## 📋 Variables Requeridas

### **🔑 Google Maps API Key**
```env
VITE_REACT_APP_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```
**Descripción:** Clave de API de Google Maps para búsqueda de lugares
**Obligatorio:** ✅ Sí
**Formato:** String con clave de API válida

### **🤖 IA Python Endpoint**
```env
VITE_AI_ENDPOINT=http://localhost:8000/api/hotels/analyze
```
**Descripción:** URL del endpoint de IA Python para análisis de hoteles
**Obligatorio:** ✅ Sí (solo cuando IA esté lista)
**Formato:** URL completa del endpoint

## 📋 Variables Opcionales

### **🌐 Backend URL**
```env
VITE_REACT_APP_BACKEND_URL=http://localhost:3000
```
**Descripción:** URL del backend principal
**Obligatorio:** ❌ No
**Formato:** URL completa del backend

### **🌍 Environment**
```env
NODE_ENV=development
```
**Descripción:** Entorno de ejecución
**Obligatorio:** ❌ No
**Formato:** `development` | `production`

## 🔧 Configuración por Escenario

### **📋 Escenario 1: Sin IA (Actual)**
```env
# Solo Google Maps API
VITE_REACT_APP_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

### **📋 Escenario 2: Con IA (Futuro)**
```env
# Google Maps API + IA
VITE_REACT_APP_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
VITE_AI_ENDPOINT=http://localhost:8000/api/hotels/analyze
```

## 🚀 Cómo Configurar

### **🔧 Paso 1: Crear Archivo .env.local**
```bash
# En la raíz del proyecto
touch .env.local
```

### **🔧 Paso 2: Agregar Variables**
```env
# .env.local
VITE_REACT_APP_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
VITE_AI_ENDPOINT=http://localhost:8000/api/hotels/analyze
```

### **🔧 Paso 3: Reiniciar Servidor**
```bash
npm run dev
```

## 🔍 Verificación

### **✅ Verificar Variables en Consola**
```javascript
// En DevTools Console
console.log(import.meta.env.VITE_AI_ENDPOINT);
console.log(import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY);
```

### **✅ Verificar Funcionamiento**
- **Google Maps** carga correctamente
- **Búsqueda de lugares** funciona
- **IA endpoint** responde (si está configurado)

## 📋 Troubleshooting

### **❌ Error: "process is not defined"**
**Causa:** Uso de `process.env` en lugar de `import.meta.env`
**Solución:** Cambiar a `import.meta.env.VITE_*`

### **❌ Error: "API key not found"**
**Causa:** Variable de entorno no configurada
**Solución:** Verificar que `VITE_REACT_APP_GOOGLE_MAPS_API_KEY` esté en `.env.local`

### **❌ Error: "IA endpoint not found"**
**Causa:** Variable de entorno no configurada
**Solución:** Verificar que `VITE_AI_ENDPOINT` esté en `.env.local`

## 🎯 Formato de Archivo .env.local

```env
# Google Maps API Key
VITE_REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyCdVaDpNdGloaySh_36NQZGYDT1KKL_yGE

# IA Python Endpoint
VITE_AI_ENDPOINT=http://localhost:8000/api/hotels/analyze

# Backend URL (opcional)
VITE_REACT_APP_BACKEND_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

**¡Configuración completa para activar IA cuando esté lista!** 🚀✨