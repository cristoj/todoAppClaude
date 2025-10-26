// src/features/task-management/infrastructure/components/TaskList.tsx

import { lazy, Suspense, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/_shared/infrastructure/components/ui/button';
import { useTasks } from '@/features/task-management/application/hooks/useTasks';
import { useTaskStats } from '@/features/task-management/application/hooks/useTaskStats';
import { useTaskFiltering } from '@/features/task-management/application/hooks/useTaskFiltering';
import { TaskCard } from '@/features/task-management/infrastructure/components/TaskCard';
import { TaskFilters } from '@/features/task-management/infrastructure/components/TaskFilters';
import { DateFilters } from '@/features/task-management/infrastructure/components/DateFilters';
import { TaskStats } from '@/features/task-management/infrastructure/components/TaskStats';
import { TaskSearch } from '@/features/task-management/infrastructure/components/TaskSearch';
import type { Task } from '@/features/task-management/domain/Task';
// @ts-ignore - CSS modules are handled by Vite
import styles from './TaskList.module.css';

// Lazy load TaskForm component to reduce initial bundle size
const TaskForm = lazy(() =>
  import('./TaskForm').then(m => ({ default: m.TaskForm }))
);

export function TaskList(): React.ReactElement {
  const { tasks, isLoading, deleteTask, toggleTaskStatus } = useTasks();
  const { stats } = useTaskStats(tasks);
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    filteredTasks
  } = useTaskFiltering(tasks);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDelete = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      await deleteTask(taskId);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className={styles.taskList}>
        <div className={styles.taskList__loading}>Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className={styles.taskList}>
      <header className={styles.taskList__header}>
        <h1 className={styles.taskList__title}>Task Management</h1>
        <Button
          onClick={handleNewTask}
          className={styles.taskList__newButton}
          aria-label="Create new task"
        >
          <Plus size={20} />
          <span>New Task</span>
        </Button>
      </header>

      <TaskStats stats={stats} />

      <TaskSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className={styles.taskList__filters}>
        <div className={styles.taskList__filtersSection + ' ' + styles['taskList__filtersSection--status']}>
          <TaskFilters
            currentFilter={statusFilter}
            onFilterChange={setStatusFilter}
          />
        </div>
        <div className={styles.taskList__filtersSection + ' ' + styles['taskList__filtersSection--date']}>
          <DateFilters
            currentFilter={dateFilter}
            onFilterChange={setDateFilter}
          />
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className={styles.taskList__empty}>
          <p className={styles.taskList__emptyText}>
            {tasks.length === 0
              ? 'No tasks yet. Create your first task to get started!'
              : 'No tasks match the current filter.'}
          </p>
        </div>
      ) : (
        <>
          <div className={styles.taskList__grid}>
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

          <div className={styles.taskList__footer}>
            <p className={styles.taskList__count}>
              Showing {filteredTasks.length} of {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            </p>
          </div>
        </>
      )}

      {isFormOpen && (
        <Suspense fallback={
          <div className={styles.taskList__loading}>Loading form...</div>
        }>
          <TaskForm
            task={editingTask}
            onClose={handleFormClose}
          />
        </Suspense>
      )}
    </div>
  );
}
