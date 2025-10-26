// src/features/task-management/infrastructure/components/DateFilters.tsx

import { Calendar } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/_shared/infrastructure/components/ui/tabs';
import { DateFilterType } from '@/features/task-management/domain/Task';
// @ts-ignore - CSS modules are handled by Vite
import styles from './DateFilters.module.css';

export interface DateFiltersProps {
  currentFilter: DateFilterType;
  onFilterChange: (filter: DateFilterType) => void;
}

export function DateFilters({ currentFilter, onFilterChange }: DateFiltersProps): React.ReactElement {
  return (
    <div className={styles.dateFilters}>
      <div className={styles.dateFilters__label}>
        <Calendar size={16} />
        <span>Filter by Date</span>
      </div>
      <Tabs value={currentFilter} onValueChange={(value) => onFilterChange(value as DateFilterType)}>
        <TabsList className={styles.dateFilters__list}>
          <TabsTrigger value={DateFilterType.ALL} className={styles.dateFilters__trigger}>
            All Dates
          </TabsTrigger>
          <TabsTrigger value={DateFilterType.TODAY} className={styles.dateFilters__trigger}>
            Today
          </TabsTrigger>
          <TabsTrigger value={DateFilterType.THIS_WEEK} className={styles.dateFilters__trigger}>
            This Week
          </TabsTrigger>
          <TabsTrigger value={DateFilterType.THIS_MONTH} className={styles.dateFilters__trigger}>
            This Month
          </TabsTrigger>
          <TabsTrigger value={DateFilterType.NO_DATE} className={styles.dateFilters__trigger}>
            No Date
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
