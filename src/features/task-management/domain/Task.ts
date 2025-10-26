// src/features/task-management/domain/Task.ts

export type TaskStatus = 'pending' | 'completed';

export const TaskFilterType = {
  ALL: 'all',
  PENDING: 'pending',
  COMPLETED: 'completed',
  OVERDUE: 'overdue'
} as const;

export type TaskFilterType = typeof TaskFilterType[keyof typeof TaskFilterType];

export const DateFilterType = {
  ALL: 'all',
  TODAY: 'today',
  THIS_WEEK: 'this_week',
  THIS_MONTH: 'this_month',
  NO_DATE: 'no_date',
  CUSTOM: 'custom'
} as const;

export type DateFilterType = typeof DateFilterType[keyof typeof DateFilterType];

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: Date;
  resolvedAt?: Date;
  dueDate?: Date;
}

export interface TaskStats {
  total: number;
  pending: number;
  completed: number;
  overdue: number;
}
