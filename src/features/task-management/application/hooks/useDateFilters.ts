// src/features/task-management/application/hooks/useDateFilters.ts

import { useMemo, useState } from 'react';
import { DateFilterType, type Task } from '@/features/task-management/domain/Task';

export function useDateFilters(tasks: Task[]) {
  const [dateFilter, setDateFilter] = useState<DateFilterType>(DateFilterType.ALL);
  const [customRange, setCustomRange] = useState<{ start?: Date; end?: Date }>({});

  const dateFilteredTasks = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    switch (dateFilter) {
      case DateFilterType.ALL:
        return tasks;

      case DateFilterType.TODAY:
        return tasks.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === now.getTime();
        });

      case DateFilterType.THIS_WEEK: {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        return tasks.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate >= weekStart && dueDate <= weekEnd;
        });
      }

      case DateFilterType.THIS_MONTH: {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        return tasks.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate >= monthStart && dueDate <= monthEnd;
        });
      }

      case DateFilterType.NO_DATE:
        return tasks.filter(task => !task.dueDate);

      case DateFilterType.CUSTOM: {
        if (!customRange.start && !customRange.end) return tasks;

        return tasks.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);

          if (customRange.start && customRange.end) {
            return dueDate >= customRange.start && dueDate <= customRange.end;
          } else if (customRange.start) {
            return dueDate >= customRange.start;
          } else if (customRange.end) {
            return dueDate <= customRange.end;
          }
          return true;
        });
      }

      default:
        return tasks;
    }
  }, [tasks, dateFilter, customRange]);

  return {
    dateFilter,
    setDateFilter,
    customRange,
    setCustomRange,
    dateFilteredTasks
  };
}
