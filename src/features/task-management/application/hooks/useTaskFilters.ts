// src/features/task-management/application/hooks/useTaskFilters.ts

import { useMemo, useState } from 'react';
import { TaskFilterType, type Task } from '@/features/task-management/domain/Task';

export function useTaskFilters(tasks: Task[]) {
  const [currentFilter, setCurrentFilter] = useState<TaskFilterType>(TaskFilterType.ALL);

  const filteredTasks = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    switch (currentFilter) {
      case TaskFilterType.ALL:
        return tasks;

      case TaskFilterType.PENDING:
        return tasks.filter(task => task.status === 'pending');

      case TaskFilterType.COMPLETED:
        return tasks.filter(task => task.status === 'completed');

      case TaskFilterType.OVERDUE:
        return tasks.filter(task => {
          if (task.status !== 'pending' || !task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate < now;
        });

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
