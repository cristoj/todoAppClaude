# Task Management - Documentación Técnica de Implementación

## Índice
1. [Visión General](#visión-general)
2. [Análisis de Requerimientos](#análisis-de-requerimientos)
3. [Arquitectura y Diseño](#arquitectura-y-diseño)
4. [Modelo de Datos](#modelo-de-datos)
5. [Componentes](#componentes)
6. [Repositorios y Servicios](#repositorios-y-servicios)
7. [Plan de Testing](#plan-de-testing)
8. [Plan de Implementación](#plan-de-implementación)
9. [Dependencias](#dependencias)

---

## Visión General

Implementación de un sistema completo de gestión de tareas (Task Management) que permite a los usuarios crear, visualizar, editar y eliminar tareas con múltiples atributos y estados.

### Funcionalidades Principales
- ✅ Crear nuevas tareas con título, descripción opcional y fecha de vencimiento
- ✅ Visualizar lista de tareas con filtros (All, Pending, Completed, Overdue)
- ✅ Visualizar estadísticas (Total, Pending, Completed, Overdue)
- ✅ Filtros de fecha (Today, This Week, This Month, No Date, Custom)
- ✅ Búsqueda de tareas
- ✅ Editar tareas existentes
- ✅ Eliminar tareas con confirmación
- ✅ Marcar tareas como completadas/pendientes
- ✅ Persistencia en localStorage
- ✅ Modo claro/oscuro
- ✅ Diseño responsive minimalista (blanco/negro con acentos de color solo para acciones específicas)

---

## Análisis de Requerimientos

### Requerimientos Funcionales

#### RF-01: Crear Tarea
- **Descripción**: El usuario puede crear una nueva tarea
- **Campos obligatorios**: Título
- **Campos opcionales**: Descripción, Fecha de vencimiento
- **Campos automáticos**: ID único, Fecha de creación, Estado (por defecto: pending)
- **Validaciones**:
  - Título no vacío (mín. 3 caracteres, máx. 200)
  - Descripción máximo 1000 caracteres
  - Fecha de vencimiento debe ser futura

#### RF-02: Visualizar Tareas
- **Descripción**: El usuario ve una lista de todas sus tareas
- **Estadísticas**: Tarjetas con contadores de Total, Pending, Completed, Overdue
- **Filtros de estado**:
  - All: Todas las tareas
  - Pending: Solo tareas pendientes
  - Completed: Solo tareas completadas
  - Overdue: Tareas pendientes con fecha vencida
- **Filtros de fecha**:
  - Today: Tareas para hoy
  - This Week: Tareas de esta semana
  - This Month: Tareas de este mes
  - No Date: Tareas sin fecha de vencimiento
  - Custom: Rango de fechas personalizado
- **Búsqueda**: Búsqueda en tiempo real por título y descripción
- **Ordenamiento**: Por fecha de creación (más recientes primero)
- **Estados visuales**:
  - Normal: Tarea pendiente sin vencer (blanco/negro)
  - Completed: Tarea marcada como completada (opacidad reducida, checkbox verde)
  - Overdue: Tarea pendiente con fecha vencida (borde izquierdo rojo)

#### RF-03: Editar Tarea
- **Descripción**: El usuario puede modificar cualquier campo de una tarea
- **Restricciones**:
  - No se puede editar ID ni fecha de creación
  - Fecha de resolución se actualiza automáticamente al cambiar estado a completed

#### RF-04: Eliminar Tarea
- **Descripción**: El usuario puede eliminar permanentemente una tarea
- **Confirmación**: Requiere confirmación del usuario
- **Efecto**: Eliminación permanente del localStorage

#### RF-05: Cambiar Estado
- **Descripción**: El usuario puede marcar una tarea como completada o pendiente
- **Interacción**: Click en checkbox
- **Efecto automático**:
  - Al completar: Se registra fecha de resolución
  - Al desmarcar: Se elimina fecha de resolución

### Requerimientos No Funcionales

#### RNF-01: Performance
- La lista debe renderizar hasta 1000 tareas sin lag perceptible
- Las operaciones CRUD deben completarse en <100ms
- Uso de virtualización si hay >100 tareas visibles

#### RNF-02: Accesibilidad
- Cumplir con WCAG 2.1 nivel AA
- Navegación completa por teclado
- Lectores de pantalla compatibles
- Contraste mínimo 4.5:1

#### RNF-03: Responsive
- Mobile-first design
- Breakpoints: 640px (sm), 768px (md), 1024px (lg)
- Touch-friendly (botones mínimo 44x44px en mobile)

#### RNF-04: Persistencia
- Uso de localStorage
- Sincronización automática en cada operación
- Manejo de errores de cuota excedida

#### RNF-05: Diseño Visual
- **Filosofía**: Minimalismo extremo - blanco/negro principalmente
- **Uso de color**: Solo para acciones específicas con significado semántico
  - Verde: Solo para tareas completadas (checkbox, badge)
  - Rojo: Solo para overdue (borde izquierdo) y delete (hover)
  - Negro/Blanco: Todo lo demás
- **Tipografía**: Lato (cuerpo) y Gloock (títulos)
- **Iconos**: lucide-react para consistencia
- **Animaciones**: Sutiles y con propósito (hover, transitions)

---

## Arquitectura y Diseño

### Estructura de Directorios

```
src/
├── features/
│   └── task-management/
│       ├── domain/
│       │   ├── Task.ts                    # Entidad Task
│       │   ├── TaskStatus.ts              # Value Object para estados
│       │   ├── TaskRepository.interface.ts # Interface del repositorio
│       │   └── TaskValidation.ts          # Reglas de validación
│       ├── infrastructure/
│       │   ├── repositories/
│       │   │   ├── LocalStorageTaskRepository.ts
│       │   │   └── TaskRepositoryFactory.ts
│       │   └── components/
│       │       ├── TaskList.tsx
│       │       ├── TaskList.module.css
│       │       ├── TaskCard.tsx
│       │       ├── TaskCard.module.css
│       │       ├── TaskForm.tsx
│       │       ├── TaskForm.module.css
│       │       ├── TaskFilters.tsx
│       │       ├── TaskFilters.module.css
│       │       ├── TaskStats.tsx
│       │       ├── TaskStats.module.css
│       │       ├── TaskSearch.tsx
│       │       ├── TaskSearch.module.css
│       │       ├── DateFilters.tsx
│       │       └── DateFilters.module.css
│       ├── application/
│       │   ├── hooks/
│       │   │   ├── useTasks.ts
│       │   │   ├── useTaskFilters.ts
│       │   │   ├── useTaskStats.ts
│       │   │   ├── useTaskSearch.ts
│       │   │   ├── useDateFilters.ts
│       │   │   └── useTaskForm.ts
│       │   └── TaskContext.tsx
│       └── TaskManagementPage.tsx
test/
├── features/
│   └── task-management/
│       ├── domain/
│       │   ├── Task.test.ts
│       │   └── TaskValidation.test.ts
│       ├── infrastructure/
│       │   ├── repositories/
│       │   │   └── LocalStorageTaskRepository.test.ts
│       │   └── components/
│       │       ├── TaskList.test.tsx
│       │       ├── TaskCard.test.tsx
│       │       ├── TaskForm.test.tsx
│       │       └── TaskFilters.test.tsx
│       ├── application/
│       │   └── hooks/
│       │       ├── useTasks.test.ts
│       │       └── useTaskForm.test.ts
│       └── integration/
│           └── TaskManagement.integration.test.tsx
└── e2e/
    └── features/
        └── task-management/
            └── TaskManagement.cy.tsx
```

### Principios SOLID Aplicados

#### Single Responsibility Principle (SRP)
- Cada componente tiene una única responsabilidad
- `TaskCard`: Solo muestra una tarea
- `TaskForm`: Solo maneja el formulario
- `TaskFilters`: Solo maneja los filtros
- `LocalStorageTaskRepository`: Solo maneja persistencia

#### Open/Closed Principle (OCP)
- Uso de interfaces permite extensión sin modificación
- `TaskRepository` interface permite múltiples implementaciones
- Factory pattern para crear repositorios

#### Liskov Substitution Principle (LSP)
- Cualquier implementación de `TaskRepository` es intercambiable
- Los componentes no dependen de implementaciones concretas

#### Interface Segregation Principle (ISP)
- Interfaces específicas y focalizadas
- No se fuerza a implementar métodos no necesarios

#### Dependency Inversion Principle (DIP)
- Componentes dependen de abstracciones (interfaces)
- Inyección de dependencias vía props y contexto
- Factory crea las dependencias concretas

---

## Modelo de Datos

### Entidad Task

```typescript
// src/features/task-management/domain/Task.ts

export interface Task {
  id: string;                    // UUID v4
  title: string;                 // 3-200 caracteres
  description?: string;          // 0-1000 caracteres
  status: TaskStatus;            // 'pending' | 'completed'
  createdAt: Date;              // ISO 8601 string
  resolvedAt?: Date;            // ISO 8601 string
  dueDate?: Date;               // ISO 8601 string
}

export type TaskStatus = 'pending' | 'completed';

export enum TaskFilterType {
  ALL = 'all',
  PENDING = 'pending',
  COMPLETED = 'completed',
  OVERDUE = 'overdue'
}
```

### Validaciones

```typescript
// src/features/task-management/domain/TaskValidation.ts

export class TaskValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = 'TaskValidationError';
  }
}

export class TaskValidation {
  private static readonly TITLE_MIN_LENGTH = 3;
  private static readonly TITLE_MAX_LENGTH = 200;
  private static readonly DESCRIPTION_MAX_LENGTH = 1000;

  static validateTitle(title: string): void {
    if (!title || title.trim().length < this.TITLE_MIN_LENGTH) {
      throw new TaskValidationError(
        'title',
        `Title must be at least ${this.TITLE_MIN_LENGTH} characters`
      );
    }
    if (title.length > this.TITLE_MAX_LENGTH) {
      throw new TaskValidationError(
        'title',
        `Title must not exceed ${this.TITLE_MAX_LENGTH} characters`
      );
    }
  }

  static validateDescription(description?: string): void {
    if (description && description.length > this.DESCRIPTION_MAX_LENGTH) {
      throw new TaskValidationError(
        'description',
        `Description must not exceed ${this.DESCRIPTION_MAX_LENGTH} characters`
      );
    }
  }

  static validateDueDate(dueDate?: Date): void {
    if (dueDate && dueDate < new Date()) {
      throw new TaskValidationError(
        'dueDate',
        'Due date must be in the future'
      );
    }
  }

  static validateTask(task: Partial<Task>): void {
    if (task.title !== undefined) {
      this.validateTitle(task.title);
    }
    if (task.description !== undefined) {
      this.validateDescription(task.description);
    }
    if (task.dueDate !== undefined) {
      this.validateDueDate(task.dueDate);
    }
  }
}
```

---

## Componentes

### 1. TaskManagementPage (Página Principal)

**Responsabilidad**: Contenedor principal que provee contexto

```typescript
// src/features/task-management/TaskManagementPage.tsx

import { TaskProvider } from './application/TaskContext';
import { TaskRepositoryFactory } from './infrastructure/repositories/TaskRepositoryFactory';
import { TaskList } from './infrastructure/components/TaskList';

export function TaskManagementPage(): React.ReactElement {
  const taskRepository = TaskRepositoryFactory.create();

  return (
    <TaskProvider repository={taskRepository}>
      <div className="task-management-page">
        <TaskList />
      </div>
    </TaskProvider>
  );
}
```

### 2. TaskList (Lista de Tareas)

**Responsabilidad**: Orquestador principal de la UI

**Hooks utilizados**:
- `useTasks()`: Obtener y manipular tareas
- `useTaskFilters()`: Manejar filtrado de estado
- `useDateFilters()`: Manejar filtrado de fechas
- `useTaskSearch()`: Manejar búsqueda
- `useTaskStats()`: Calcular estadísticas
- `useState()`: Modal de formulario

**Subcomponentes**:
- `TaskStats`: Tarjetas de estadísticas
- `TaskSearch`: Búsqueda
- `TaskFilters`: Barra de filtros de estado
- `DateFilters`: Filtros de fecha
- `TaskCard`: Card individual
- `TaskForm`: Modal de creación/edición

**Iconos de lucide-react**:
- `Plus`: Botón de nueva tarea
- `Sun`/`Moon`: Toggle de tema
- `Search`: Búsqueda
- `Edit`: Editar tarea
- `Trash2`: Eliminar tarea

```typescript
// src/features/task-management/infrastructure/components/TaskList.tsx

import { Plus, Sun, Moon } from 'lucide-react';
import { TaskStats } from './TaskStats';
import { TaskSearch } from './TaskSearch';
import { TaskFilters } from './TaskFilters';
import { DateFilters } from './DateFilters';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';

export function TaskList(): React.ReactElement {
  const { tasks, isLoading, deleteTask, toggleTaskStatus } = useTasks();
  const { stats } = useTaskStats(tasks);
  const { searchQuery, setSearchQuery, searchedTasks } = useTaskSearch(tasks);
  const { currentFilter, setFilter, filteredTasks } = useTaskFilters(searchedTasks);
  const { dateFilter, setDateFilter, dateFilteredTasks } = useDateFilters(filteredTasks);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDelete = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  return (
    <div className={styles.taskList}>
      <header className={styles.taskList__header}>
        <h1>Task Management</h1>
        <ThemeToggle />
      </header>

      <button
        className={styles.taskList__newButton}
        onClick={() => setIsFormOpen(true)}
      >
        + New Task
      </button>

      <TaskFilters
        currentFilter={currentFilter}
        onFilterChange={setFilter}
      />

      {isLoading ? (
        <TaskListSkeleton />
      ) : (
        <div className={styles.taskList__cards}>
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={toggleTaskStatus}
            />
          ))}
        </div>
      )}

      <div className={styles.taskList__count}>
        Showing {filteredTasks.length} of {tasks.length} tasks
      </div>

      {isFormOpen && (
        <TaskForm
          task={editingTask}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}
```

### 3. TaskCard (Tarjeta de Tarea)

**Responsabilidad**: Mostrar una tarea individual

**Props**:
```typescript
interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleStatus: (taskId: string) => void;
}
```

**Estados visuales**:
- Normal
- Completed (con opacidad reducida)
- Overdue (con borde rojo)

### 4. TaskForm (Formulario de Tarea)

**Responsabilidad**: Crear/editar tareas

**Hooks utilizados**:
- `useTaskForm()`: Lógica del formulario
- `useTasks()`: Crear/actualizar tarea

**Campos**:
- Title (Input obligatorio)
- Description (Textarea opcional)
- Due Date (DatePicker opcional)
- Status (Radio buttons, solo en edición)

**Validación**:
- En tiempo real
- Mostrar errores bajo cada campo
- Deshabilitar submit si hay errores

### 5. TaskFilters (Filtros)

**Responsabilidad**: Permitir filtrar tareas

**Opciones**:
- All
- Pending
- Completed
- Overdue

**Diseño**:
- Desktop: Tabs horizontales
- Mobile: Select dropdown

---

## Repositorios y Servicios

### TaskRepository Interface

```typescript
// src/features/task-management/domain/TaskRepository.interface.ts

export interface TaskRepository {
  save(task: Task): Promise<void>;
  update(task: Task): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Task | null>;
  findAll(): Promise<Task[]>;
}
```

### LocalStorageTaskRepository

```typescript
// src/features/task-management/infrastructure/repositories/LocalStorageTaskRepository.ts

export class LocalStorageTaskRepository implements TaskRepository {
  private readonly STORAGE_KEY = 'tasks';

  async save(task: Task): Promise<void> {
    TaskValidation.validateTask(task);

    const tasks = await this.findAll();
    const exists = tasks.some(t => t.id === task.id);

    if (exists) {
      throw new Error(`Task with id ${task.id} already exists`);
    }

    const newTasks = [...tasks, task];
    this.saveTasks(newTasks);
  }

  async update(task: Task): Promise<void> {
    TaskValidation.validateTask(task);

    const tasks = await this.findAll();
    const index = tasks.findIndex(t => t.id === task.id);

    if (index === -1) {
      throw new Error(`Task with id ${task.id} not found`);
    }

    tasks[index] = task;
    this.saveTasks(tasks);
  }

  async delete(id: string): Promise<void> {
    const tasks = await this.findAll();
    const filtered = tasks.filter(t => t.id !== id);
    this.saveTasks(filtered);
  }

  async findById(id: string): Promise<Task | null> {
    const tasks = await this.findAll();
    return tasks.find(t => t.id === id) ?? null;
  }

  async findAll(): Promise<Task[]> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];

      const tasks = JSON.parse(data) as Task[];

      // Convertir strings a Date objects
      return tasks.map(task => ({
        ...task,
        createdAt: new Date(task.createdAt),
        resolvedAt: task.resolvedAt ? new Date(task.resolvedAt) : undefined,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      }));
    } catch (error) {
      console.error('Error reading tasks from localStorage:', error);
      return [];
    }
  }

  private saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please delete some tasks.');
      }
      throw error;
    }
  }
}
```

### Custom Hooks

#### useTasks

```typescript
// src/features/task-management/application/hooks/useTasks.ts

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
}

// En TaskContext.tsx
export function TaskProvider({
  children,
  repository
}: TaskProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const loadedTasks = await repository.findAll();
      setTasks(loadedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [repository]);

  const createTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      status: taskData.status || 'pending'
    };

    await repository.save(newTask);
    await loadTasks();
  }, [repository, loadTasks]);

  const updateTask = useCallback(async (task: Task) => {
    await repository.update(task);
    await loadTasks();
  }, [repository, loadTasks]);

  const deleteTask = useCallback(async (id: string) => {
    await repository.delete(id);
    await loadTasks();
  }, [repository, loadTasks]);

  const toggleTaskStatus = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updatedTask: Task = {
      ...task,
      status: task.status === 'pending' ? 'completed' : 'pending',
      resolvedAt: task.status === 'pending' ? new Date() : undefined
    };

    await updateTask(updatedTask);
  }, [tasks, updateTask]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return (
    <TaskContext.Provider value={{
      tasks,
      isLoading,
      createTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      reloadTasks: loadTasks
    }}>
      {children}
    </TaskContext.Provider>
  );
}
```

#### useTaskFilters

```typescript
// src/features/task-management/application/hooks/useTaskFilters.ts

export function useTaskFilters(tasks: Task[]) {
  const [currentFilter, setCurrentFilter] = useState<TaskFilterType>(TaskFilterType.ALL);

  const filteredTasks = useMemo(() => {
    const now = new Date();

    switch (currentFilter) {
      case TaskFilterType.ALL:
        return tasks;

      case TaskFilterType.PENDING:
        return tasks.filter(task => task.status === 'pending');

      case TaskFilterType.COMPLETED:
        return tasks.filter(task => task.status === 'completed');

      case TaskFilterType.OVERDUE:
        return tasks.filter(task =>
          task.status === 'pending' &&
          task.dueDate &&
          task.dueDate < now
        );

      default:
        return tasks;
    }
  }, [tasks, currentFilter]);

  return {
    currentFilter,
    setFilter: setCurrentFilter,
    filteredTasks
  };
}
```

---

## Plan de Testing

### Cobertura Objetivo: 80% mínimo

### Tests Unitarios

#### 1. Domain Layer Tests

**Task.test.ts**
- ✅ Crear tarea válida
- ✅ Validar título obligatorio
- ✅ Validar longitud mínima de título
- ✅ Validar longitud máxima de título
- ✅ Validar longitud máxima de descripción
- ✅ Validar fecha de vencimiento futura
- ✅ Generar ID único automáticamente
- ✅ Establecer fecha de creación automáticamente
- ✅ Estado por defecto es 'pending'

**TaskValidation.test.ts**
- ✅ validateTitle: título válido
- ✅ validateTitle: título vacío lanza error
- ✅ validateTitle: título corto lanza error
- ✅ validateTitle: título largo lanza error
- ✅ validateDescription: descripción válida
- ✅ validateDescription: descripción larga lanza error
- ✅ validateDueDate: fecha futura válida
- ✅ validateDueDate: fecha pasada lanza error
- ✅ validateTask: tarea completa válida

#### 2. Infrastructure Tests

**LocalStorageTaskRepository.test.ts**
- ✅ save: guardar tarea nueva correctamente
- ✅ save: no permitir duplicados por ID
- ✅ save: validar tarea antes de guardar
- ✅ update: actualizar tarea existente
- ✅ update: lanzar error si tarea no existe
- ✅ delete: eliminar tarea existente
- ✅ delete: no lanzar error si tarea no existe
- ✅ findById: encontrar tarea por ID
- ✅ findById: retornar null si no existe
- ✅ findAll: retornar array vacío inicialmente
- ✅ findAll: retornar todas las tareas
- ✅ findAll: convertir strings a Date objects
- ✅ saveTasks: manejar QuotaExceededError

#### 3. Component Tests

**TaskCard.test.tsx**
- ✅ Renderizar título correctamente
- ✅ Renderizar descripción si existe
- ✅ No renderizar descripción si no existe
- ✅ Mostrar fecha de creación formateada
- ✅ Mostrar fecha de vencimiento si existe
- ✅ Mostrar badge de completado si está completado
- ✅ Mostrar badge de overdue si está vencido
- ✅ Aplicar estilo completado si está completado
- ✅ Aplicar estilo overdue si está vencido
- ✅ Llamar onToggleStatus al hacer click en checkbox
- ✅ Llamar onEdit al hacer click en botón edit
- ✅ Llamar onDelete al hacer click en botón delete
- ✅ Checkbox marcado si tarea completada
- ✅ Checkbox desmarcado si tarea pendiente

**TaskForm.test.tsx**
- ✅ Renderizar formulario vacío en modo creación
- ✅ Renderizar formulario con datos en modo edición
- ✅ Mostrar error si título vacío
- ✅ Mostrar error si título muy corto
- ✅ Mostrar error si título muy largo
- ✅ Mostrar error si descripción muy larga
- ✅ Mostrar error si fecha de vencimiento en pasado
- ✅ Deshabilitar submit si hay errores
- ✅ Llamar onSave con datos correctos
- ✅ Llamar onClose al hacer click en cancel
- ✅ Llamar onClose al hacer click en X
- ✅ Validar en tiempo real al escribir
- ✅ Mostrar radio de estado solo en edición

**TaskFilters.test.tsx**
- ✅ Renderizar todos los filtros
- ✅ Marcar filtro activo visualmente
- ✅ Llamar onFilterChange con filtro correcto
- ✅ Renderizar como tabs en desktop
- ✅ Renderizar como select en mobile

**TaskList.test.tsx**
- ✅ Renderizar loading skeleton inicialmente
- ✅ Renderizar lista de tareas después de cargar
- ✅ Renderizar mensaje si no hay tareas
- ✅ Mostrar contador de tareas correcto
- ✅ Abrir modal al hacer click en New Task
- ✅ Pasar tarea correcta al editar
- ✅ Mostrar confirmación al eliminar
- ✅ Filtrar tareas según filtro activo
- ✅ Actualizar lista después de crear tarea
- ✅ Actualizar lista después de editar tarea
- ✅ Actualizar lista después de eliminar tarea

#### 4. Hook Tests

**useTasks.test.ts**
- ✅ Cargar tareas al montar
- ✅ createTask: agregar nueva tarea
- ✅ updateTask: actualizar tarea existente
- ✅ deleteTask: eliminar tarea
- ✅ toggleTaskStatus: cambiar estado a completed
- ✅ toggleTaskStatus: cambiar estado a pending
- ✅ toggleTaskStatus: agregar resolvedAt al completar
- ✅ toggleTaskStatus: remover resolvedAt al descompletar
- ✅ Manejar errores de carga
- ✅ Manejar errores de creación
- ✅ Manejar errores de actualización
- ✅ Manejar errores de eliminación

**useTaskFilters.test.ts**
- ✅ Filtro ALL: mostrar todas las tareas
- ✅ Filtro PENDING: mostrar solo pendientes
- ✅ Filtro COMPLETED: mostrar solo completadas
- ✅ Filtro OVERDUE: mostrar solo vencidas pendientes
- ✅ Actualizar filteredTasks al cambiar filtro
- ✅ Actualizar filteredTasks al cambiar tareas

### Tests de Integración

**TaskManagement.integration.test.tsx**
- ✅ Flujo completo: crear → visualizar → editar → completar → eliminar
- ✅ Persistencia: datos persisten después de reload
- ✅ Filtrado: aplicar múltiples filtros correctamente
- ✅ Validación: formulario muestra errores y previene submit
- ✅ Estado overdue: detectar tareas vencidas correctamente
- ✅ Múltiples tareas: manejar lista grande (100+ tareas)

### Tests E2E (Cypress)

**TaskManagement.cy.tsx**
- ✅ Usuario puede crear una tarea nueva
- ✅ Usuario puede ver lista de tareas
- ✅ Usuario puede editar una tarea
- ✅ Usuario puede eliminar una tarea con confirmación
- ✅ Usuario puede marcar tarea como completada
- ✅ Usuario puede desmarcar tarea completada
- ✅ Usuario puede filtrar por pending
- ✅ Usuario puede filtrar por completed
- ✅ Usuario puede filtrar por overdue
- ✅ Validación: no permite crear tarea con título vacío
- ✅ Validación: no permite fecha de vencimiento en pasado
- ✅ Responsive: funciona correctamente en mobile
- ✅ Persistencia: tareas persisten después de refresh
- ✅ Dark mode: toggle funciona correctamente

### Comandos de Testing

```bash
# Tests unitarios en watch mode
npm test

# Tests unitarios con coverage
npm run test:run -- --coverage

# Tests E2E con Cypress UI
npm run test:e2e

# Tests E2E headless
npm run test:e2e:headless

# Todos los tests
npm run test:all
```

---

## Plan de Implementación

### Fase 1: Setup y Domain Layer (2-3 horas)

**Tareas:**
1. ✅ Crear estructura de directorios
2. ✅ Definir entidad Task
3. ✅ Implementar TaskValidation con tests
4. ✅ Definir TaskRepository interface
5. ✅ Implementar LocalStorageTaskRepository con tests

**Complejidad:** Baja
**Tests:** 22 tests unitarios (Domain + Repository)

### Fase 2: Application Layer (4-5 horas)

**Tareas:**
1. ✅ Implementar TaskContext con provider
2. ✅ Implementar useTasks hook con tests
3. ✅ Implementar useTaskFilters hook con tests
4. ✅ Implementar useTaskStats hook con tests
5. ✅ Implementar useTaskSearch hook con tests
6. ✅ Implementar useDateFilters hook con tests
7. ✅ Implementar useTaskForm hook con tests
8. ✅ Crear TaskRepositoryFactory

**Complejidad:** Media
**Tests:** 40 tests unitarios (Hooks)

### Fase 3: UI Components - Parte 1 (5-6 horas)

**Tareas:**
1. ✅ Instalar lucide-react para iconos
2. ✅ Implementar TaskStats component con tests
3. ✅ Implementar TaskStats.module.css (diseño minimalista blanco/negro)
4. ✅ Implementar TaskCard component con tests (iconos de lucide-react)
5. ✅ Implementar TaskCard.module.css (colores solo para completed/overdue)
6. ✅ Implementar TaskFilters component con tests
7. ✅ Implementar TaskFilters.module.css (tabs minimalistas)
8. ✅ Implementar DateFilters component con tests
9. ✅ Implementar DateFilters.module.css
10. ✅ Implementar TaskSearch component con tests
11. ✅ Implementar TaskSearch.module.css
12. ✅ Verificar diseño responsive

**Complejidad:** Media-Alta
**Tests:** 45 tests (TaskStats + TaskCard + TaskFilters + DateFilters + TaskSearch)

### Fase 4: UI Components - Parte 2 (5-6 horas)

**Tareas:**
1. ✅ Instalar date-picker si es necesario
2. ✅ Implementar TaskForm component con tests
3. ✅ Implementar TaskForm.module.css
4. ✅ Implementar validación en tiempo real
5. ✅ Verificar diseño modal

**Complejidad:** Alta
**Tests:** 13 tests (TaskForm)

### Fase 5: Main Container (3-4 horas)

**Tareas:**
1. ✅ Implementar TaskList component con tests
2. ✅ Implementar TaskList.module.css
3. ✅ Implementar TaskListSkeleton loading state
4. ✅ Integrar todos los subcomponentes
5. ✅ Implementar confirmación de eliminación

**Complejidad:** Media
**Tests:** 11 tests (TaskList)

### Fase 6: Page y Routing (1-2 horas)

**Tareas:**
1. ✅ Implementar TaskManagementPage
2. ✅ Integrar con App routing
3. ✅ Configurar Factory en página

**Complejidad:** Baja
**Tests:** Incluidos en integration tests

### Fase 7: Integration Tests (3-4 horas)

**Tareas:**
1. ✅ Implementar 6 tests de integración
2. ✅ Verificar flujos completos
3. ✅ Verificar persistencia
4. ✅ Verificar performance con 100+ tareas

**Complejidad:** Media
**Tests:** 6 tests de integración

### Fase 8: E2E Tests (4-5 horas)

**Tareas:**
1. ✅ Configurar Cypress (si no está)
2. ✅ Implementar 14 tests E2E
3. ✅ Verificar en diferentes viewports
4. ✅ Verificar dark mode

**Complejidad:** Media
**Tests:** 14 tests E2E

### Fase 9: Polish y Optimización (2-3 horas)

**Tareas:**
1. ✅ Implementar animaciones según diseño
2. ✅ Optimizar performance
3. ✅ Verificar accesibilidad
4. ✅ Verificar responsive en dispositivos reales
5. ✅ Code review y refactoring

**Complejidad:** Baja-Media
**Tests:** Revisar coverage (debe ser >80%)

### Fase 10: Documentación y Deploy (1-2 horas)

**Tareas:**
1. ✅ Actualizar README si es necesario
2. ✅ Documentar decisiones en /claude_documents
3. ✅ Build de producción
4. ✅ Deploy (si aplica)

**Complejidad:** Baja

---

## Resumen de Tiempos

| Fase | Duración Estimada | Complejidad |
|------|-------------------|-------------|
| 1. Setup y Domain | 2-3 horas | Baja |
| 2. Application Layer | 4-5 horas | Media |
| 3. UI Components Parte 1 | 5-6 horas | Media-Alta |
| 4. UI Components Parte 2 | 5-6 horas | Alta |
| 5. Main Container | 3-4 horas | Media |
| 6. Page y Routing | 1-2 horas | Baja |
| 7. Integration Tests | 3-4 horas | Media |
| 8. E2E Tests | 4-5 horas | Media |
| 9. Polish y Optimización | 2-3 horas | Baja-Media |
| 10. Documentación | 1-2 horas | Baja |
| **TOTAL** | **30-40 horas** | **Media** |

**Nota**: El tiempo aumentó debido a componentes adicionales (TaskStats, TaskSearch, DateFilters) y hooks adicionales (useTaskStats, useTaskSearch, useDateFilters)

---

## Dependencias

### Dependencias Nuevas Requeridas

#### 1. Date Picker Component

**Opción 1: Shadcn UI Calendar + Popover (Recomendado)**
```bash
npx shadcn@latest add calendar
npx shadcn@latest add popover
```
- **Ventaja**: Ya está integrado con el sistema de diseño
- **Desventaja**: Requiere react-day-picker

**Dependencias peer**:
```bash
npm install react-day-picker date-fns
```

**Opción 2: Native HTML5 Date Input**
- **Ventaja**: Sin dependencias extra
- **Desventaja**: Menos control sobre estilos

**Decisión**: Usar Shadcn UI Calendar para consistencia de diseño

#### 2. Generación de UUIDs

**Ya disponible**: `crypto.randomUUID()` en navegadores modernos
**Polyfill**: No necesario si solo soportamos navegadores modernos

#### 3. Iconos - lucide-react (REQUERIDO)

**Instalación**:
```bash
npm install lucide-react
```

**Iconos utilizados**:
- `Plus`: Botón "New Task"
- `Sun` / `Moon`: Toggle de tema
- `Search`: Campo de búsqueda
- `Edit` / `Pencil`: Editar tarea
- `Trash2`: Eliminar tarea
- `Check`: Checkbox completado
- `Calendar`: Fechas
- `Clock`: Timestamps
- `X`: Cerrar modal

#### 4. Componentes Shadcn UI Adicionales

Ya instalados según CLAUDE.md:
- ✅ Button
- ✅ Card
- ✅ Input
- ✅ Checkbox

Falta instalar:
```bash
npx shadcn@latest add dialog      # Para modal de TaskForm
npx shadcn@latest add textarea    # Para descripción
npx shadcn@latest add label       # Para labels de formulario
npx shadcn@latest add radio-group # Para selector de estado
npx shadcn@latest add tabs        # Para filtros (desktop)
npx shadcn@latest add select      # Para filtros (mobile)
npx shadcn@latest add badge       # Para badges de estado
```

### Dependencias de Desarrollo

#### Testing
Ya instaladas según package.json:
- ✅ vitest
- ✅ @testing-library/react
- ✅ @testing-library/jest-dom
- ✅ jsdom

Falta instalar:
```bash
npm install -D @testing-library/user-event  # Para interacciones de usuario
```

#### Cypress (E2E)
Si no está instalado:
```bash
npm install -D cypress @testing-library/cypress
```

### Resumen de Instalaciones

```bash
# Iconos (REQUERIDO)
npm install lucide-react

# UI Components
npx shadcn@latest add calendar
npx shadcn@latest add popover
npx shadcn@latest add dialog
npx shadcn@latest add textarea
npx shadcn@latest add label
npx shadcn@latest add radio-group
npx shadcn@latest add tabs
npx shadcn@latest add select
npx shadcn@latest add badge

# Peer dependencies
npm install react-day-picker date-fns

# Testing
npm install -D @testing-library/user-event

# E2E (si no está instalado)
npm install -D cypress @testing-library/cypress
```

---

## Notas Técnicas Adicionales

### Performance Considerations

1. **Virtualización**: Implementar si >100 tareas visibles
   - Usar `react-window` o `@tanstack/react-virtual`
   - Solo si el testing revela problemas de performance

2. **Memoización**: React Compiler ya optimiza automáticamente
   - No agregar `useMemo`/`useCallback` manualmente
   - Confiar en el compilador

3. **LocalStorage**: Debounce writes si es necesario
   - Actualmente escribe en cada operación
   - Monitorear performance en testing

### Accesibilidad Checklist

- ✅ Todos los inputs tienen labels
- ✅ Focus visible en todos los interactivos
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ ARIA labels donde sea necesario
- ✅ Contraste mínimo 4.5:1
- ✅ Textos alternativos en iconos
- ✅ Lectores de pantalla anuncian cambios

### Responsive Breakpoints

```css
/* Mobile first */
.component { }

@media (min-width: 640px) {
  /* Small tablets */
}

@media (min-width: 768px) {
  /* Tablets */
}

@media (min-width: 1024px) {
  /* Desktop */
}
```

### Dark Mode Implementation

Usar variables CSS con escala de grises (blanco/negro):
```css
:root {
  /* Black & White Minimal Palette */
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --muted: 0 0% 96.1%;
  --muted-foreground: 0 0% 45.1%;
  --border: 0 0% 89.8%;

  /* Colors only for specific actions */
  --primary: 0 0% 9%;          /* Black */
  --destructive: 0 84.2% 60.2%; /* Red (overdue/delete) */
  --success: 142.1 76.2% 36.3%; /* Green (completed) */
}

[data-theme="dark"] {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  --muted: 0 0% 14.9%;
  --muted-foreground: 0 0% 63.9%;
  --border: 0 0% 14.9%;
  --primary: 0 0% 98%;         /* White */
}
```

Leer preferencia del sistema y localStorage en `ThemeContext`.

### Filosofía de Color

**Regla de oro**: Solo usar color donde tiene significado semántico específico

✅ **Verde** (--success):
- Checkbox de tarea completada
- Badge "Completed"
- Número en estadística "Completed"

✅ **Rojo** (--destructive):
- Borde izquierdo de tarea overdue
- Badge "Overdue"
- Botón delete en hover
- Número en estadística "Overdue"

❌ **TODO LO DEMÁS**: Blanco/Negro/Grises
- Botones primarios: Negro/Blanco según tema
- Tabs activos: Negro sólido
- Texto: Negro/Blanco según tema
- Bordes: Gris sutil
- Sin gradientes, sin azules, sin amarillos

---

## Decisiones de Diseño

### ¿Por qué LocalStorage?

- ✅ Simple y suficiente para MVP
- ✅ Sin necesidad de backend
- ✅ Funciona offline
- ❌ Límite de ~5MB
- ❌ No compartido entre dispositivos

**Futura migración**: Preparado para cambiar a API REST via interface

### ¿Por qué Shadcn UI?

- ✅ Ya está configurado en el proyecto
- ✅ Componentes accesibles por defecto
- ✅ Fácil de customizar
- ✅ No agrega peso innecesario (tree-shakeable)

### ¿Por qué CSS Modules?

- ✅ Scoped styles
- ✅ Type-safe en TypeScript
- ✅ No requiere runtime (vs CSS-in-JS)
- ✅ Compatible con server-side rendering

### ¿Por qué lucide-react?

- ✅ Iconos consistentes y profesionales
- ✅ Tree-shakeable (solo importa los iconos que usas)
- ✅ Ligero (muy poco peso)
- ✅ Fácil de estilizar (props de color y tamaño)
- ✅ Compatible con React 19
- ✅ Diseño minimalista que encaja con la filosofía del proyecto

**Iconos principales**:
```typescript
import { Plus, Sun, Moon, Search, Edit, Trash2, Check, Calendar, Clock, X } from 'lucide-react';
```

---

## Referencias de Diseño

Ver documento en: `docs/designer/task-management.md`

Mockups HTML disponibles en: `docs/designer/images/generate-mockups.html`

Para generar screenshots:
1. Abrir `generate-mockups.html` en navegador
2. Usar herramienta de screenshot (CMD+SHIFT+4 en Mac)
3. Guardar como PNG en `docs/designer/images/`

---

**Autor**: Claude Code AI
**Fecha**: 2025-10-24
**Versión**: 1.1
**Estado**: Pendiente de implementación
**Última actualización**: Diseño minimalista blanco/negro + lucide-react iconos
