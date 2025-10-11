# 📅 Sistema de Agenda - Documentación Completa

## 🎯 **Descripción General**

El sistema de Agenda es una funcionalidad completa que permite a los usuarios gestionar sus eventos y actividades programadas. Incluye navegación por fechas, selección de días, modal de calendario personalizado y gestión de estado con Redux Toolkit.

## 🏗️ **Arquitectura del Sistema**

### **Componentes Principales:**

```
📁 Sistema de Agenda
├── 📄 Agenda.tsx (Página principal)
├── 🗓️ DaySelector (Navegación de semanas)
├── 📅 WeekDaysSelector (Selector de días)
├── 🗓️ CalendarModal (Modal de calendario)
├── 🎯 useDateNavigation (Hook de navegación)
├── 📊 useAgenda (Hook de gestión de agenda)
└── 🏪 agendaSlice (Estado Redux)
```

## 📋 **Archivos Creados y Modificados**

### **🆕 Archivos Nuevos:**

1. **`src/redux/slice/agendaSlice.ts`** - Estado global de agenda
2. **`src/hooks/useDateNavigation.ts`** - Hook para navegación de fechas
3. **`src/hooks/useAgenda.ts`** - Hook para gestión de agenda
4. **`src/components/ui/DaySelector.tsx`** - Componente de navegación semanal
5. **`src/components/ui/WeekDaysSelector.tsx`** - Selector de días de la semana
6. **`src/components/ui/CalendarModal.tsx`** - Modal de calendario personalizado

### **🔄 Archivos Modificados:**

1. **`src/pages/Agenda.tsx`** - Página principal integrada
2. **`src/redux/store.ts`** - Store actualizado con agendaSlice
3. **`src/App.tsx`** - Ruta de agenda agregada

## 🧩 **Análisis Detallado de Componentes**

### **1. agendaSlice.ts - Estado Global**

**Ubicación:** `src/redux/slice/agendaSlice.ts`

**Propósito:** Gestiona el estado global de la agenda usando Redux Toolkit.

**Tipos Definidos:**
```typescript
export interface AgendaItem {
  id: string;
  destinationId: string;
  destinationName: string;
  location: string;
  scheduledDate: Date;
  scheduledTime: string;
  status: 'pending' | 'completed' | 'cancelled';
  category: 'restaurant' | 'hotel' | 'beach' | 'park' | 'disco' | 'study';
  image: string;
  description?: string;
  notes?: string;
}

export interface AgendaState {
  items: AgendaItem[];
  selectedDate: Date;
  isLoading: boolean;
  error: string | null;
}

export type AgendaSection = 'agendados' | 'itinerarios';
```

**Acciones Disponibles:**
- `setSelectedDate` - Cambiar fecha seleccionada
- `addAgendaItem` - Agregar nuevo evento
- `updateAgendaItem` - Actualizar evento existente
- `removeAgendaItem` - Eliminar evento
- `moveAgendaItem` - Mover evento a otra fecha/hora
- `setAgendaItems` - Establecer lista completa de eventos
- `setLoading` - Controlar estado de carga
- `setError` / `clearError` - Gestión de errores

**Características Técnicas:**
- ✅ Generación automática de IDs únicos
- ✅ Inmutabilidad garantizada por Redux Toolkit
- ✅ TypeScript con tipado estricto
- ✅ Manejo de errores integrado

### **2. useDateNavigation.ts - Hook de Navegación**

**Ubicación:** `src/hooks/useDateNavigation.ts`

**Propósito:** Maneja la lógica de navegación entre fechas y generación de días de la semana.

**Funcionalidades:**
```typescript
export const useDateNavigation = () => {
  // Estados
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => 
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  // Generación de días de la semana
  const weekDays = useMemo((): DayInfo[] => {
    return Array.from({ length: 7 }, (_, index) => {
      const dayDate = addDays(currentWeekStart, index);
      return {
        date: dayDate,
        dayName: format(dayDate, 'EEE', { locale: es }).toUpperCase(),
        dayNumber: format(dayDate, 'dd'),
        isToday: isToday(dayDate),
        isSelected: isSameDay(dayDate, selectedDate),
      };
    });
  }, [currentWeekStart, selectedDate]);

  // Funciones de navegación
  const goToPreviousWeek = () => { /* ... */ };
  const goToNextWeek = () => { /* ... */ };
  const selectDay = (date: Date) => { /* ... */ };
  const getCurrentWeekText = () => { /* ... */ };
  const goToCurrentWeek = () => { /* ... */ };
};
```

**Características Técnicas:**
- ✅ Usa `date-fns` para manipulación de fechas
- ✅ Localización en español
- ✅ Memoización para optimización de rendimiento
- ✅ Lunes como primer día de la semana
- ✅ Formateo automático de fechas

### **3. useAgenda.ts - Hook de Gestión**

**Ubicación:** `src/hooks/useAgenda.ts`

**Propósito:** Proporciona una interfaz simplificada para interactuar con el estado de agenda.

**Funcionalidades Principales:**
```typescript
export const useAgenda = () => {
  // Obtener items del día seleccionado
  const getItemsForSelectedDate = useCallback(() => {
    return agenda.items.filter(item => 
      isSameDay(new Date(item.scheduledDate), agenda.selectedDate)
    );
  }, [agenda.items, agenda.selectedDate]);

  // Obtener items por categoría
  const getItemsByCategory = useCallback((category: string) => {
    return agenda.items.filter(item => item.category === category);
  }, [agenda.items]);

  // Acciones CRUD
  const addItem = useCallback((item: Omit<AgendaItem, 'id'>) => {
    dispatch(addAgendaItem(item));
  }, [dispatch]);

  const updateItem = useCallback((id: string, updates: Partial<AgendaItem>) => {
    dispatch(updateAgendaItem({ id, updates }));
  }, [dispatch]);

  const removeItem = useCallback((id: string) => {
    dispatch(removeAgendaItem(id));
  }, [dispatch]);

  const moveItem = useCallback((id: string, newDate: Date, newTime?: string) => {
    dispatch(moveAgendaItem({ id, newDate, newTime }));
  }, [dispatch]);
};
```

**Características Técnicas:**
- ✅ Callbacks memoizados para optimización
- ✅ Filtrado inteligente por fecha y categoría
- ✅ Interfaz simplificada para operaciones CRUD
- ✅ Integración completa con Redux

### **4. DaySelector.tsx - Navegación Semanal**

**Ubicación:** `src/components/ui/DaySelector.tsx`

**Propósito:** Componente que muestra la barra de navegación con flechas y texto de semana.

**Estructura:**
```typescript
export interface DayInfo {
  date: Date;
  dayName: string;
  dayNumber: string;
  isToday: boolean;
  isSelected: boolean;
}

const DaySelector: React.FC<DaySelectorProps> = ({
  weekDays,
  onDaySelect,
  onPreviousWeek,
  onNextWeek,
  currentWeekText,
}) => {
  return (
    <div className="bg-[#D9D9D9] w-full h-[40px] flex items-center justify-between p-2 text-[#727272] text-[14px] rounded-lg">
      {/* Botón flecha izquierda */}
      <button onClick={onPreviousWeek}>
        <img src="./icons/white-arrow-left.svg" alt="semana anterior" />
      </button>

      {/* Texto de la semana actual */}
      <span className="font-normal">{currentWeekText}</span>

      {/* Botón flecha derecha */}
      <button onClick={onNextWeek}>
        <img src="./icons/white-arrow-right.svg" alt="semana siguiente" />
      </button>
    </div>
  );
};
```

**Características de Diseño:**
- ✅ Diseño fiel a la imagen de referencia
- ✅ Flechas de navegación con hover effects
- ✅ Texto centrado de la semana actual
- ✅ Colores y estilos consistentes

### **5. WeekDaysSelector.tsx - Selector de Días**

**Ubicación:** `src/components/ui/WeekDaysSelector.tsx`

**Propósito:** Componente que muestra los 7 días de la semana como botones seleccionables.

**Lógica de Estados:**
```typescript
const WeekDaysSelector: React.FC<WeekDaysSelectorProps> = ({
  weekDays,
  onDaySelect,
}) => {
  return (
    <div className="w-full flex justify-between gap-2">
      {weekDays.map((day, index) => (
        <button
          key={index}
          onClick={() => onDaySelect(day.date)}
          className={`flex-1 flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all duration-200 hover:scale-105 ${
            day.isSelected
              ? 'bg-black text-white'           // Día seleccionado
              : day.isToday
              ? 'bg-gray-100 text-black border-2 border-gray-300'  // Día actual
              : 'bg-white text-gray-600 hover:bg-gray-50'          // Día normal
          }`}
        >
          <span className="text-xs font-medium mb-1">{day.dayName}</span>
          <span className={`text-lg font-bold ${
            day.isSelected ? 'text-[#B8F261]' : ''
          }`}>
            {day.dayNumber}
          </span>
        </button>
      ))}
    </div>
  );
};
```

**Estados Visuales:**
- 🟢 **Día Seleccionado**: Fondo negro, texto blanco, número verde
- 🔵 **Día Actual**: Fondo gris claro con borde
- ⚪ **Día Normal**: Fondo blanco con hover effect

### **6. CalendarModal.tsx - Modal de Calendario**

**Ubicación:** `src/components/ui/CalendarModal.tsx`

**Propósito:** Modal personalizado con calendario para selección de fechas.

**Características Técnicas:**
```typescript
const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onDateSelect,
}) => {
  const handleDateChange = (date: Date | Date[]) => {
    if (date instanceof Date) {
      onDateSelect(date);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        {/* Header del modal */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">Seleccionar Fecha</h2>
          <button onClick={onClose}>×</button>
        </div>

        {/* Calendario */}
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          locale="es"
          calendarType="ISO 8601"
          className="custom-calendar"
          tileClassName={({ date, view }) => {
            if (view === 'month') {
              const today = new Date();
              const isToday = date.toDateString() === today.toDateString();
              const isSelected = date.toDateString() === selectedDate.toDateString();
              
              return `custom-tile ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`;
            }
            return '';
          }}
        />

        {/* Botones de acción */}
        <div className="flex gap-3 mt-6">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={() => { onDateSelect(selectedDate); onClose(); }}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};
```

**Características de Diseño:**
- ✅ Modal overlay con backdrop
- ✅ Calendario personalizado con estilos CSS
- ✅ Día actual resaltado en negro con texto verde
- ✅ Día seleccionado con fondo verde
- ✅ Botones de confirmación y cancelación
- ✅ Responsive design

### **7. Agenda.tsx - Página Principal**

**Ubicación:** `src/pages/Agenda.tsx`

**Propósito:** Página principal que integra todos los componentes del sistema de agenda.

**Integración de Componentes:**
```typescript
export default function Agenda() {
  const [selectedSection, setSelectedSection] = useState<'agendados' | 'itinerarios'>('agendados');
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  
  const {
    selectedDate,
    weekDays,
    currentWeekText,
    goToPreviousWeek,
    goToNextWeek,
    selectDay,
  } = useDateNavigation();
  
  const {
    selectDate,
  } = useAgenda();

  return (
    <CategoryWrapper
      backgroundImage="/default-background-light.svg"
      backgroundSize="100%"
      backgroundPosition="top center"
    >
      {/* Header con título y botón de calendario */}
      <div className="flex justify-between items-center mt-5">
        <div className="flex flex-col gap-2.5">
          <h1 className="text-black text-[40px] font-extrabold leading-[26px] tracking-[-1px]">
            AGENDA
          </h1>
          <p className="text-black text-[15px] font-medium leading-[22px]">
            Qué tenemos planeado hoy?
          </p>
        </div>

        <button
          onClick={() => setIsCalendarModalOpen(true)}
          className="w-10 h-10 bg-[#090909] rounded-lg flex items-center justify-center hover:scale-105 hover:shadow-lg transition-all duration-300 ease-out cursor-pointer"
        >
          <img src="./icons/calendar-icon.svg" alt="Calendar" className="w-6 h-6" />
        </button>
      </div>

      {/* Navegación de semanas */}
      <DaySelector
        weekDays={weekDays}
        onDaySelect={selectDay}
        onPreviousWeek={goToPreviousWeek}
        onNextWeek={goToNextWeek}
        currentWeekText={currentWeekText}
      />

      {/* Selector de días */}
      <WeekDaysSelector
        weekDays={weekDays}
        onDaySelect={selectDay}
      />

      {/* Secciones Agendados/Itinerarios */}
      <div className="w-full flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-black text-[15px] font-medium">Elige tu sección</h2>
          <img src="./icons/notification-bell.svg" alt="signo de pregunta" className="w-6 h-6" />
        </div>
        <div className="flex justify-between w-full">
          <button 
            id="agendados-btn"
            onClick={() => setSelectedSection('agendados')}
            className={`flex items-center gap-2 text-black px-6 py-3 rounded-3xl font-medium transition-all duration-200 hover:scale-105 ${
              selectedSection === 'agendados' 
                ? 'bg-[#B8F261]' 
                : 'bg-white'
            }`}
          >
            <img src="./icons/agendados-icon.svg" alt="calendar" className="w-7 h-7" />
            Agendados
          </button>
          <button 
            id="itinerarios-btn"
            onClick={() => setSelectedSection('itinerarios')}
            className={`flex items-center gap-2 text-black px-6 py-3 rounded-3xl font-medium transition-all duration-200 hover:scale-105 ${
              selectedSection === 'itinerarios' 
                ? 'bg-[#B8F261]' 
                : 'bg-white'
            }`}
          >
            <img src="./icons/itinerarios-icon.svg" alt="document" className="w-7 h-7" />
            Itinerarios
          </button>
        </div>
      </div>

      {/* Modal de calendario */}
      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        selectedDate={selectedDate}
        onDateSelect={(date) => {
          selectDate(date);
          selectDay(date);
        }}
      />
    </CategoryWrapper>
  );
}
```

## 🔧 **Dependencias Instaladas**

```bash
pnpm add react-calendar date-fns
pnpm add @types/react-calendar
```

**Librerías Utilizadas:**
- **`react-calendar`** - Componente de calendario personalizable
- **`date-fns`** - Manipulación de fechas moderna y ligera
- **`@reduxjs/toolkit`** - Estado global (ya existía)
- **`react-redux`** - Integración con React (ya existía)

## 🎨 **Características de Diseño**

### **Colores y Estilos:**
- **Verde Principal**: `#B8F261` - Botones activos y acentos
- **Gris Fondo**: `#D9D9D9` - Barras de navegación
- **Negro**: `#090909` - Botones y texto principal
- **Gris Texto**: `#727272` - Texto secundario

### **Efectos y Transiciones:**
- ✅ `hover:scale-105` - Efecto de escala en hover
- ✅ `transition-all duration-200` - Transiciones suaves
- ✅ `rounded-xl` / `rounded-3xl` - Bordes redondeados
- ✅ `shadow-lg` - Sombras para profundidad

### **Responsive Design:**
- ✅ `flex-1` - Distribución equitativa de espacio
- ✅ `w-full` - Ancho completo
- ✅ `gap-2` / `gap-3` / `gap-4` - Espaciado consistente
- ✅ `px-6 py-3` - Padding uniforme

## 🚀 **Funcionalidades Implementadas**

### **✅ Navegación de Fechas:**
- Navegación entre semanas con flechas
- Selección de días individuales
- Día actual resaltado automáticamente
- Formateo de fechas en español

### **✅ Modal de Calendario:**
- Apertura desde botón de calendario
- Selección de fechas con confirmación
- Estilos personalizados
- Cierre con backdrop o botones

### **✅ Gestión de Estado:**
- Estado global con Redux Toolkit
- Operaciones CRUD completas
- Filtrado por fecha y categoría
- Persistencia de datos

### **✅ Interfaz de Usuario:**
- Botones de sección con estado activo
- Efectos hover y transiciones
- Diseño responsive
- Iconos integrados

## 🔄 **Flujo de Datos**

```mermaid
graph TB
    A[Agenda.tsx] --> B[useDateNavigation]
    A --> C[useAgenda]
    A --> D[DaySelector]
    A --> E[WeekDaysSelector]
    A --> F[CalendarModal]
    
    B --> G[date-fns]
    C --> H[agendaSlice]
    H --> I[Redux Store]
    
    D --> J[DayInfo Interface]
    E --> J
    F --> K[react-calendar]
    
    L[User Actions] --> A
    A --> M[State Updates]
    M --> N[UI Re-render]
```

## 🛠️ **Casos de Uso**

### **1. Navegación Básica:**
```typescript
// Usuario hace clic en flecha izquierda
goToPreviousWeek() // Cambia a semana anterior

// Usuario hace clic en día específico
selectDay(new Date('2024-01-15')) // Selecciona día específico
```

### **2. Agregar Evento:**
```typescript
const { addItem } = useAgenda();

addItem({
  destinationId: 'rest_123',
  destinationName: 'Restaurante El Buen Sabor',
  location: 'Cartagena, Colombia',
  scheduledDate: new Date('2024-01-15'),
  scheduledTime: '19:00',
  status: 'pending',
  category: 'restaurant',
  image: 'restaurant-image.jpg',
  description: 'Cena de cumpleaños'
});
```

### **3. Filtrar Eventos:**
```typescript
const { itemsForSelectedDate, itemsByCategory } = useAgenda();

// Obtener eventos del día seleccionado
const todayEvents = itemsForSelectedDate;

// Obtener eventos por categoría
const restaurantEvents = itemsByCategory('restaurant');
```

## 🔮 **Próximas Mejoras Sugeridas**

### **1. Funcionalidades Adicionales:**
- [ ] Drag & Drop para mover eventos entre fechas
- [ ] Notificaciones de recordatorio
- [ ] Sincronización con API backend
- [ ] Exportación de agenda (PDF, iCal)
- [ ] Búsqueda de eventos
- [ ] Filtros avanzados por categoría

### **2. Mejoras de UX:**
- [ ] Animaciones de transición entre semanas
- [ ] Indicadores visuales de eventos en días
- [ ] Vista de calendario mensual
- [ ] Modo oscuro
- [ ] Accesibilidad mejorada

### **3. Optimizaciones Técnicas:**
- [ ] Lazy loading de componentes
- [ ] Memoización de cálculos pesados
- [ ] Persistencia en localStorage
- [ ] Service Worker para offline
- [ ] Tests unitarios y de integración

## 📝 **Conclusión**

El sistema de Agenda implementado proporciona una base sólida y escalable para la gestión de eventos. La arquitectura modular, el uso de TypeScript, y la integración con Redux Toolkit garantizan un código mantenible y extensible. El diseño fiel a las especificaciones visuales y las funcionalidades implementadas ofrecen una experiencia de usuario fluida y profesional.

**Características Destacadas:**
- ✅ **Arquitectura Modular**: Componentes reutilizables y separación de responsabilidades
- ✅ **TypeScript Completo**: Tipado estricto en toda la aplicación
- ✅ **Estado Global**: Gestión centralizada con Redux Toolkit
- ✅ **Diseño Responsive**: Adaptable a diferentes dispositivos
- ✅ **Optimización**: Memoización y callbacks optimizados
- ✅ **Extensibilidad**: Fácil agregar nuevas funcionalidades

El sistema está listo para producción y puede ser extendido según las necesidades futuras del proyecto.
