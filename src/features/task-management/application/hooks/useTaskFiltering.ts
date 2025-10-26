// src/features/task-management/application/hooks/useTaskFiltering.ts

import { useMemo, useState } from 'react';
import { TaskFilterType, DateFilterType, type Task } from '@/features/task-management/domain/Task';

export interface UseTaskFilteringResult {
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Status filter
  statusFilter: TaskFilterType;
  setStatusFilter: (filter: TaskFilterType) => void;

  // Date filter
  dateFilter: DateFilterType;
  setDateFilter: (filter: DateFilterType) => void;
  customRange: { start?: Date; end?: Date };
  setCustomRange: (range: { start?: Date; end?: Date }) => void;

  // Filtered results
  filteredTasks: Task[];
}

/**
 * Composite hook that combines search, status, and date filtering for tasks.
 * Applies filters in cascade: search → status → date
 *
 * @param tasks - Array of tasks to filter
 * @returns Object containing filter states, setters, and filtered tasks
 *
 * @example
 * const { searchQuery, setSearchQuery, filteredTasks } = useTaskFiltering(tasks);
 */
export function useTaskFiltering(tasks: Task[]): UseTaskFilteringResult {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Status filter state
  const [statusFilter, setStatusFilter] = useState<TaskFilterType>(TaskFilterType.ALL);

  // Date filter state
  const [dateFilter, setDateFilter] = useState<DateFilterType>(DateFilterType.ALL);
  const [customRange, setCustomRange] = useState<{ start?: Date; end?: Date }>({});

  // Step 1: Apply search filter
  const searchedTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;

    const query = searchQuery.toLowerCase().trim();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query)
    );
  }, [tasks, searchQuery]);

  // Step 2: Apply status filter
  const statusFilteredTasks = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    switch (statusFilter) {
      case TaskFilterType.ALL:
        return searchedTasks;

      case TaskFilterType.PENDING:
        return searchedTasks.filter(task => task.status === 'pending');

      case TaskFilterType.COMPLETED:
        return searchedTasks.filter(task => task.status === 'completed');

      case TaskFilterType.OVERDUE:
        return searchedTasks.filter(task => {
          if (task.status !== 'pending' || !task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate < now;
        });

      default:
        return searchedTasks;
    }
  }, [searchedTasks, statusFilter]);

  // Step 3: Apply date filter
  const dateFilteredTasks = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    switch (dateFilter) {
      case DateFilterType.ALL:
        return statusFilteredTasks;

      case DateFilterType.TODAY:
        return statusFilteredTasks.filter(task => {
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

        return statusFilteredTasks.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate >= weekStart && dueDate <= weekEnd;
        });
      }

      case DateFilterType.THIS_MONTH: {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        return statusFilteredTasks.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate >= monthStart && dueDate <= monthEnd;
        });
      }

      case DateFilterType.NO_DATE:
        return statusFilteredTasks.filter(task => !task.dueDate);

      case DateFilterType.CUSTOM: {
        if (!customRange.start && !customRange.end) return statusFilteredTasks;

        return statusFilteredTasks.filter(task => {
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
        return statusFilteredTasks;
    }
  }, [statusFilteredTasks, dateFilter, customRange]);

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    customRange,
    setCustomRange,
    filteredTasks: dateFilteredTasks
  };
}
