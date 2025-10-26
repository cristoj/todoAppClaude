// src/features/task-management/application/hooks/useTasks.ts

import { useContext } from 'react';
import { TaskContext, type TaskContextValue } from '@/features/task-management/application/TaskContext';

export function useTasks(): TaskContextValue {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
}
