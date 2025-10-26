# MVP Features - Todo App

## Core Features

### 1. Todo Management
Crear, visualizar, editar y eliminar tareas. Cada tarea incluye título, descripción opcional, estado (completada/pendiente) y fecha de creación, resolución y opcional fecha de vencimiento.

### 2. Local Storage Persistence
Guardar automáticamente todas las tareas en localStorage del navegador para que persistan entre sesiones.

### 3. Mark as Complete/Incomplete and expired
Marcar tareas como completadas o pendientes mediante checkbox. Las completadas se muestran con estilo diferenciado (fondo verde claro) y las expired en fondo rojo claro. 

### 4. Filter by Status and dates
Filtrar vista de tareas por: Todas, Activas (pendientes) y por fechas, Completadas. Incluye contador.

### 5. Delete Completed
Botón para eliminar todas las tareas completadas de una vez.

### 6. Light/Dark Mode
Tema claro/oscuro que detecta preferencia del sistema y permite cambio manual. Guarda preferencia en localStorage.

### Counter
Contador de tareas pendientes y vencidas.

### Expired advice
Mostrar un mensaje llamativo para notificar sobre tareas vencidas.


## Technical Requirements

- **Testing Coverage**: Mínimo 80% en todas las features
- **Responsive Design**: Funcional en mobile, tablet y desktop
- **Accessibility**: Uso de roles ARIA y navegación por teclado
- **DDD Architecture**: Seguir estructura de dominio, repositorios, hooks y componentes
- **SOLID Principles**: Código mantenible y testeable

## Out of Scope (Post-MVP)

- Categorías/etiquetas
- Fechas de vencimiento
- Prioridades
- Búsqueda de tareas
- Sincronización en cloud
- Múltiples listas
- Drag & drop para reordenar


Todo to complete:

-[ ] Management
-[ ] Local Storage Persistence
-[ ] Mark as Complete/Incomplete and expired
-[ ] Filter by Status and dates
-[ ] Delete Completed
-[ ] Light/Dark Mode
-[ ] Counter
-[ ] Expired advice