// src/features/task-management/application/hooks/useTaskStats.ts

import { useMemo } from 'react';
import type { Task, TaskStats } from '@/features/task-management/domain/Task';

export function useTaskStats(tasks: Task[]): { stats: TaskStats } {
  const stats = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const pending = tasks.filter(t => t.status === 'pending').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const overdue = tasks.filter(t => {
      if (t.status !== 'pending' || !t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < now;
    }).length;

    return {
      total: tasks.length,
      pending,
      completed,
      overdue
    };
  }, [tasks]);

  return { stats };
}
