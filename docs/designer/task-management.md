# Task Management - Guía Visual de Diseño

## Introducción

Esta guía documenta el diseño visual de la funcionalidad de **Task Management** (Gestión de Tareas), una característica principal que permite a los usuarios crear, visualizar, editar y eliminar tareas con los siguientes atributos:

- **Título** (obligatorio)
- **Descripción** (opcional)
- **Estado**: Completada o Pendiente
- **Fecha de creación** (automática)
- **Fecha de resolución** (automática al completar)
- **Fecha de vencimiento** (opcional)

## Principios de Diseño

### Minimalismo con Personalidad
- Diseño limpio y espaciado, evitando el ruido visual
- Uso de espacios en blanco para respiración visual
- Jerarquía visual clara mediante tamaños de fuente y pesos
- Animaciones sutiles que mejoran la experiencia sin distraer

### Tipografía
- **Títulos**: Gloock (var(--font-family-titles))
- **Cuerpo**: Lato (var(--font-family))
- Escala tipográfica predefinida en variables CSS

### Paleta de Colores
- Soporte para modo claro/oscuro
- Transiciones suaves entre modos
- Colores semánticos para estados (pendiente, completado, vencido)

## Mockups Visuales

### 1. Vista Principal - Lista de Tareas

![Vista Principal](./images/task-management-1.png)

**Descripción visual:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Task Management                                    [☀️ / 🌙]    │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  + New Task                                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  📋 Filters: [All] [Pending] [Completed] [Overdue]              │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ☐  Implementar sistema de autenticación                 │  │
│  │      Crear login, registro y recuperación de contraseña  │  │
│  │      📅 Due: Dec 30, 2025  ⏰ Created: Dec 20, 2025     │  │
│  │      [✏️ Edit] [🗑️ Delete]                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ☑  Configurar CI/CD pipeline                            │  │
│  │      ✓ Completed on Dec 22, 2025                         │  │
│  │      📅 Created: Dec 15, 2025                            │  │
│  │      [✏️ Edit] [🗑️ Delete]                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ☐  Diseñar mockups de dashboard                    🔴   │  │
│  │      Incluir gráficos y métricas principales              │  │
│  │      📅 Due: Dec 18, 2025 (OVERDUE)                      │  │
│  │      ⏰ Created: Dec 10, 2025                            │  │
│  │      [✏️ Edit] [🗑️ Delete]                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Showing 3 of 12 tasks                                           │
└─────────────────────────────────────────────────────────────────┘
```

**Elementos clave:**
- Header con título principal y toggle de tema
- Botón prominente "+ New Task" para crear tareas
- Filtros horizontales para cambiar vista
- Cards de tareas con checkbox interactivo
- Estados visuales: normal, completado (tachado), vencido (indicador rojo)
- Acciones rápidas de edición y eliminación
- Fechas formateadas de manera legible
- Contador de tareas al final

### 2. Modal de Creación/Edición de Tarea

![Modal de Creación](./images/task-management-2.png)

**Descripción visual:**
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│    ┌───────────────────────────────────────────────────┐        │
│    │  Create New Task                            ✕     │        │
│    │                                                    │        │
│    │  Title *                                           │        │
│    │  ┌──────────────────────────────────────────────┐ │        │
│    │  │ Enter task title...                          │ │        │
│    │  └──────────────────────────────────────────────┘ │        │
│    │                                                    │        │
│    │  Description (optional)                            │        │
│    │  ┌──────────────────────────────────────────────┐ │        │
│    │  │ Add more details about this task...          │ │        │
│    │  │                                               │ │        │
│    │  │                                               │ │        │
│    │  └──────────────────────────────────────────────┘ │        │
│    │                                                    │        │
│    │  Due Date (optional)                               │        │
│    │  ┌──────────────────────────────────────────────┐ │        │
│    │  │ 📅 Select date...                            │ │        │
│    │  └──────────────────────────────────────────────┘ │        │
│    │                                                    │        │
│    │  Status                                            │        │
│    │  ○ Pending    ○ Completed                         │        │
│    │                                                    │        │
│    │              ┌────────┐  ┌────────┐               │        │
│    │              │ Cancel │  │  Save  │               │        │
│    │              └────────┘  └────────┘               │        │
│    └───────────────────────────────────────────────────┘        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Elementos clave:**
- Modal centrado con overlay semi-transparente
- Formulario limpio con campos claramente etiquetados
- Indicador de campo obligatorio (*)
- Textarea expandible para descripción
- Date picker integrado con icono
- Radio buttons para estado (solo en edición)
- Botones de acción alineados a la derecha
- Botón de cierre (X) en esquina superior derecha

### 3. Vista Mobile - Responsive

![Vista Mobile](./images/task-management-3.png)

**Descripción visual:**
```
┌─────────────────────┐
│  Task Management    │
│              [🌙]   │
│                     │
│  ┌───────────────┐ │
│  │  + New Task   │ │
│  └───────────────┘ │
│                     │
│  [All ▾]           │
│                     │
│  ┌───────────────┐ │
│  │ ☐ Setup CI/CD │ │
│  │   Configure   │ │
│  │   automated   │ │
│  │   testing     │ │
│  │               │ │
│  │ 📅 Dec 30     │ │
│  │ ⏰ Dec 20     │ │
│  │               │ │
│  │  [✏️]  [🗑️]   │ │
│  └───────────────┘ │
│                     │
│  ┌───────────────┐ │
│  │ ☑ Write docs  │ │
│  │   ✓ Dec 22    │ │
│  │               │ │
│  │  [✏️]  [🗑️]   │ │
│  └───────────────┘ │
│                     │
│  Showing 2 of 5    │
└─────────────────────┘
```

**Adaptaciones mobile:**
- Diseño de una columna
- Filtros como dropdown para ahorrar espacio
- Cards más compactas
- Fechas abreviadas
- Botones de acción más grandes (touch-friendly)
- Tipografía ajustada con clamp()

### 4. Estados Interactivos

#### Hover sobre Tarea
- Elevación sutil (box-shadow)
- Fondo ligeramente más claro/oscuro
- Transición suave (0.2s ease)

#### Tarea Completada
- Checkbox marcado con animación
- Título con text-decoration: line-through
- Opacidad reducida (0.7)
- Badge "✓ Completed" con fecha

#### Tarea Vencida
- Indicador rojo visible
- Badge "OVERDUE" destacado
- Borde izquierdo rojo para llamar atención

#### Loading States
- Skeleton screens mientras cargan las tareas
- Spinner en botón "Save" durante guardado
- Feedback visual inmediato en acciones

## Componentes Reutilizables

### Task Card
- Componente card de Shadcn UI como base
- Checkbox component de Shadcn UI
- Button components para acciones
- Badge component para estados

### Task Form
- Input component para título
- Textarea personalizado para descripción
- Date picker (instalar si es necesario)
- Radio group de Shadcn UI para estado

### Filters Bar
- Tabs component de Shadcn UI
- Responsive: tabs → select en mobile

## Animaciones y Transiciones

### Entrada de Tareas
- Fade in + slide up desde abajo
- Stagger delay de 50ms entre cards
- Duration: 0.3s ease-out

### Completar Tarea
- Checkbox: scale + check animation
- Card: fade out opacity
- Reordenación suave con layout animation

### Eliminación
- Slide out hacia la derecha
- Fade out simultáneo
- Duration: 0.25s ease-in

### Modal
- Backdrop: fade in (0.2s)
- Content: scale de 0.95 a 1 + fade in
- Exit: reverse animation

## Accesibilidad

- Contraste mínimo WCAG AA en todos los estados
- Focus visible en todos los elementos interactivos
- Keyboard navigation completa
- ARIA labels descriptivos
- Semantic HTML5

## Notas de Implementación

1. **Shadcn UI Components**: Usar componentes existentes como base
2. **CSS Modules**: Preferir para estilos específicos de componente
3. **Dark Mode**: Usar variables CSS y `prefers-color-scheme`
4. **Responsive**: Mobile-first approach con breakpoints
5. **Performance**: Virtualización si hay >100 tareas

## Referencias de Diseño

- **Estilo**: Minimalismo funcional, inspirado en Todoist y Things
- **Espaciado**: Sistema de 8px base
- **Bordes**: border-radius: 8px para cards, 4px para inputs
- **Sombras**: Sutiles, multicapa para profundidad
