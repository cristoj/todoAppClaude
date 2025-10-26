import type { TaskStats as TaskStatsType } from '@/features/task-management/domain/Task';
// @ts-ignore - CSS modules are handled by Vite
import styles from './TaskStats.module.css';

export interface TaskStatsProps {
  stats: TaskStatsType;
}

export function TaskStats({ stats }: TaskStatsProps): React.ReactElement {
  return (
    <div className={styles['stats-grid']}>
      <div className={styles['stat-card']}>
        <div className={styles['stat-card__label']}>Total</div>
        <div className={styles['stat-card__value']}>{stats.total}</div>
        <div className={styles['stat-card__trend']}>All tasks</div>
      </div>

      <div className={styles['stat-card']}>
        <div className={styles['stat-card__label']}>Pending</div>
        <div className={styles['stat-card__value']}>{stats.pending}</div>
        <div className={styles['stat-card__trend']}>In progress</div>
      </div>

      <div className={`${styles['stat-card']} ${styles['stat-card--completed']}`}>
        <div className={styles['stat-card__label']}>Completed</div>
        <div className={styles['stat-card__value']}>{stats.completed}</div>
        <div className={styles['stat-card__trend']}>
          {stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}% rate` : '0% rate'}
        </div>
      </div>

      <div className={`${styles['stat-card']} ${styles['stat-card--overdue']}`}>
        <div className={styles['stat-card__label']}>Overdue</div>
        <div className={styles['stat-card__value']}>{stats.overdue}</div>
        <div className={styles['stat-card__trend']}>
          {stats.overdue > 0 ? 'Needs attention' : 'All on track'}
        </div>
      </div>
    </div>
  );
}
