// src/features/task-management/domain/TaskValidation.ts

import type { Task } from './Task';

export interface TaskValidationError extends Error {
  field: string;
}

export function createTaskValidationError(field: string, message: string): TaskValidationError {
  const error = new Error(message) as TaskValidationError;
  error.name = 'TaskValidationError';
  error.field = field;
  return error;
}

export function isTaskValidationError(error: unknown): error is TaskValidationError {
  return error instanceof Error && error.name === 'TaskValidationError' && 'field' in error;
}

export class TaskValidation {
  private static readonly TITLE_MIN_LENGTH = 3;
  private static readonly TITLE_MAX_LENGTH = 200;
  private static readonly DESCRIPTION_MAX_LENGTH = 1000;

  static validateTitle(title: string): void {
    if (!title || title.trim().length < this.TITLE_MIN_LENGTH) {
      throw createTaskValidationError(
        'title',
        `Title must be at least ${this.TITLE_MIN_LENGTH} characters`
      );
    }
    if (title.length > this.TITLE_MAX_LENGTH) {
      throw createTaskValidationError(
        'title',
        `Title must not exceed ${this.TITLE_MAX_LENGTH} characters`
      );
    }
  }

  static validateDescription(description?: string): void {
    if (description && description.length > this.DESCRIPTION_MAX_LENGTH) {
      throw createTaskValidationError(
        'description',
        `Description must not exceed ${this.DESCRIPTION_MAX_LENGTH} characters`
      );
    }
  }

  static validateDueDate(dueDate?: Date): void {
    if (dueDate) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const dueDateOnly = new Date(dueDate);
      dueDateOnly.setHours(0, 0, 0, 0);

      if (dueDateOnly < now) {
        throw createTaskValidationError(
          'dueDate',
          'Due date must be today or in the future'
        );
      }
    }
  }

  static validateTask(task: Partial<Task>): void {
    if (task.title !== undefined) {
      this.validateTitle(task.title);
    }
    if (task.description !== undefined) {
      this.validateDescription(task.description);
    }
    if (task.dueDate !== undefined) {
      this.validateDueDate(task.dueDate);
    }
  }
}
