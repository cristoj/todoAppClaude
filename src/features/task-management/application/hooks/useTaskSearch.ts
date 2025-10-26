// src/features/task-management/application/hooks/useTaskSearch.ts

import { useMemo, useState } from 'react';
import type { Task } from '@/features/task-management/domain/Task';

export function useTaskSearch(tasks: Task[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const searchedTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;

    const query = searchQuery.toLowerCase().trim();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query)
    );
  }, [tasks, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    searchedTasks
  };
}
