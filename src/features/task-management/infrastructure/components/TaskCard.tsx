// src/features/task-management/infrastructure/components/TaskCard.tsx

import { Pencil, CheckCheck, Trash2, Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/_shared/infrastructure/components/ui/card';
import { Badge } from '@/_shared/infrastructure/components/ui/badge';
import { Button } from '@/_shared/infrastructure/components/ui/button';
import type { Task } from '@/features/task-management/domain/Task';
// @ts-ignore - CSS modules are handled by Vite
import styles from './TaskCard.module.css';

export interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleStatus: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onDelete, onToggleStatus }: TaskCardProps): React.ReactElement {
  const isOverdue = task.status === 'pending' && task.dueDate && new Date(task.dueDate) < new Date();
  const isCompleted = task.status === 'completed';

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  return (
    <Card
      className={`${styles.taskCard} ${isCompleted ? styles['taskCard--completed'] : ''} ${isOverdue ? styles['taskCard--overdue'] : ''}`}
      data-testid="task-card"
    >
      <CardHeader className={styles.taskCard__header}>
        <div className={styles.taskCard__titleRow}>
          <h3 className={`${styles.taskCard__title} ${isCompleted ? styles['taskCard__title--completed'] : ''}`}>
            {task.title}
          </h3>
        </div>
        {(isCompleted || isOverdue) && (
          <div className={styles.taskCard__badges}>
            {isCompleted && (
              <Badge variant="default" className={styles['taskCard__badge--completed']}>
                ✓ Completed
              </Badge>
            )}
            {isOverdue && (
              <Badge variant="destructive" className={styles['taskCard__badge--overdue']}>
                OVERDUE
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      {task.description && (
        <CardContent className={styles.taskCard__content}>
          <p className={styles.taskCard__description}>{task.description}</p>
        </CardContent>
      )}

      <CardFooter className={styles.taskCard__footer}>
        <div className={styles.taskCard__dates}>
          {task.dueDate && (
            <div className={styles.taskCard__date} title="Due date">
              <Calendar size={14} />
              <span>Due: {formatDate(task.dueDate)}</span>
            </div>
          )}
          <div className={styles.taskCard__date} title="Created date">
            <Clock size={14} />
            <span>Created: {formatDate(task.createdAt)}</span>
          </div>
          {task.resolvedAt && (
            <div className={styles.taskCard__date} title="Resolved date">
              <Clock size={14} />
              <span>Resolved: {formatDate(task.resolvedAt)}</span>
            </div>
          )}
        </div>

        <div className={styles.taskCard__actions}>
          <Button
            variant="ghost"
            onClick={() => { onToggleStatus(task.id), isCompleted }}
            aria-label={`Mark task ${task.title} as ${isCompleted ? 'pending' : 'completed'}`}
            className={isCompleted ? styles['taskCard__checkbox--completed'] : ''}
          >
            <CheckCheck size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            aria-label={`Edit task ${task.title}`}
            className={styles.taskCard__actionButton}
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            aria-label={`Delete task ${task.title}`}
            className={`${styles.taskCard__actionButton} ${styles['taskCard__actionButton--delete']}`}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
