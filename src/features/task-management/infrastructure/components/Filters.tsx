// src/features/task-management/infrastructure/components/Filters.tsx

import { TaskFilters } from '@/features/task-management/infrastructure/components/TaskFilters';
import { DateFilters } from '@/features/task-management/infrastructure/components/DateFilters';
import type { TaskFilterType, DateFilterType } from '@/features/task-management/domain/Task';
// @ts-ignore - CSS modules are handled by Vite
import styles from './Filters.module.css';

export interface FiltersProps {
  statusFilter: TaskFilterType;
  onStatusFilterChange: (filter: TaskFilterType) => void;
  dateFilter: DateFilterType;
  onDateFilterChange: (filter: DateFilterType) => void;
}

export function Filters({
  statusFilter,
  onStatusFilterChange,
  dateFilter,
  onDateFilterChange
}: FiltersProps): React.ReactElement {
  return (
    <div className={styles.filters}>
      <div className={styles.filters__section + ' ' + styles['filters__section--status']}>
        <TaskFilters
          currentFilter={statusFilter}
          onFilterChange={onStatusFilterChange}
        />
      </div>
      <div className={styles.filters__section + ' ' + styles['filters__section--date']}>
        <DateFilters
          currentFilter={dateFilter}
          onFilterChange={onDateFilterChange}
        />
      </div>
    </div>
  );
}
