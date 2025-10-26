// src/features/task-management/infrastructure/components/TaskSearch.tsx

import { Search, X } from 'lucide-react';
import { Input } from '@/_shared/infrastructure/components/ui/input';
import { Button } from '@/_shared/infrastructure/components/ui/button';
// @ts-ignore - CSS modules are handled by Vite
import styles from './TaskSearch.module.css';

export interface TaskSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function TaskSearch({ searchQuery, onSearchChange }: TaskSearchProps): React.ReactElement {
  return (
    <div className={styles.taskSearch}>
      <div className={styles.taskSearch__wrapper}>
        <Search size={18} className={styles.taskSearch__icon} />
        <Input
          type="text"
          placeholder="Search tasks by title or description..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.taskSearch__input}
          aria-label="Search tasks"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSearchChange('')}
            className={styles.taskSearch__clear}
            aria-label="Clear search"
          >
            <X size={16} />
          </Button>
        )}
      </div>
      {searchQuery && (
        <div className={styles.taskSearch__info}>
          Searching for: <strong>{searchQuery}</strong>
        </div>
      )}
    </div>
  );
}
