// src/features/task-management/infrastructure/components/TaskFilters.tsx

import { Tabs, TabsList, TabsTrigger } from '@/_shared/infrastructure/components/ui/tabs';
import { TaskFilterType } from '@/features/task-management/domain/Task';
// @ts-ignore - CSS modules are handled by Vite
import styles from './TaskFilters.module.css';

export interface TaskFiltersProps {
  currentFilter: TaskFilterType;
  onFilterChange: (filter: TaskFilterType) => void;
}

export function TaskFilters({ currentFilter, onFilterChange }: TaskFiltersProps): React.ReactElement {
  return (
    <div className={styles.taskFilters}>
      <div className={styles.taskFilters__label}>Filter by Status</div>
      <Tabs value={currentFilter} onValueChange={(value) => onFilterChange(value as TaskFilterType)}>
        <TabsList className={styles.taskFilters__list}>
          <TabsTrigger value={TaskFilterType.ALL} className={styles.taskFilters__trigger}>
            All
          </TabsTrigger>
          <TabsTrigger value={TaskFilterType.PENDING} className={styles.taskFilters__trigger}>
            Pending
          </TabsTrigger>
          <TabsTrigger value={TaskFilterType.COMPLETED} className={styles.taskFilters__trigger}>
            Completed
          </TabsTrigger>
          <TabsTrigger value={TaskFilterType.OVERDUE} className={styles.taskFilters__trigger}>
            Overdue
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
