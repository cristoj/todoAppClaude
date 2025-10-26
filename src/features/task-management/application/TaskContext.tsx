// src/features/task-management/application/TaskContext.tsx

import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { Task } from '@/features/task-management/domain/Task';
import type { TaskRepository } from '@/features/task-management/domain/TaskRepository.interface';

export interface TaskContextValue {
  tasks: Task[];
  isLoading: boolean;
  createTask: (taskData: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  reloadTasks: () => Promise<void>;
}

export const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export interface TaskProviderProps {
  children: React.ReactNode;
  repository: TaskRepository;
}

export function TaskProvider({
  children,
  repository
}: TaskProviderProps): React.ReactElement {
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

  const contextValue = useMemo(
    () => ({
      tasks,
      isLoading,
      createTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      reloadTasks: loadTasks
    }),
    [tasks, isLoading, createTask, updateTask, deleteTask, toggleTaskStatus, loadTasks]
  );

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
}
