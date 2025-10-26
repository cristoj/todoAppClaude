// test/features/task-management/domain/TaskValidation.test.ts

import { describe, it, expect } from 'vitest';
import { TaskValidation, isTaskValidationError } from '@/features/task-management/domain/TaskValidation';
import type { Task } from '@/features/task-management/domain/Task';

describe('TaskValidation', () => {
  describe('validateTitle', () => {
    it('should accept valid title', () => {
      expect(() => TaskValidation.validateTitle('Valid title')).not.toThrow();
    });

    it('should throw error for empty title', () => {
      expect(() => TaskValidation.validateTitle('')).toThrow();
    });

    it('should throw error for whitespace-only title', () => {
      expect(() => TaskValidation.validateTitle('   ')).toThrow();
    });

    it('should throw error for title shorter than 3 characters', () => {
      expect(() => TaskValidation.validateTitle('ab')).toThrow();
    });

    it('should throw error for title longer than 200 characters', () => {
      const longTitle = 'a'.repeat(201);
      expect(() => TaskValidation.validateTitle(longTitle)).toThrow();
    });

    it('should accept title with exactly 3 characters', () => {
      expect(() => TaskValidation.validateTitle('abc')).not.toThrow();
    });

    it('should accept title with exactly 200 characters', () => {
      const maxTitle = 'a'.repeat(200);
      expect(() => TaskValidation.validateTitle(maxTitle)).not.toThrow();
    });
  });

  describe('validateDescription', () => {
    it('should accept valid description', () => {
      expect(() => TaskValidation.validateDescription('This is a valid description')).not.toThrow();
    });

    it('should accept undefined description', () => {
      expect(() => TaskValidation.validateDescription(undefined)).not.toThrow();
    });

    it('should accept empty string description', () => {
      expect(() => TaskValidation.validateDescription('')).not.toThrow();
    });

    it('should throw error for description longer than 1000 characters', () => {
      const longDescription = 'a'.repeat(1001);
      expect(() => TaskValidation.validateDescription(longDescription)).toThrow();
    });

    it('should accept description with exactly 1000 characters', () => {
      const maxDescription = 'a'.repeat(1000);
      expect(() => TaskValidation.validateDescription(maxDescription)).not.toThrow();
    });
  });

  describe('validateDueDate', () => {
    it('should accept future date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(() => TaskValidation.validateDueDate(tomorrow)).not.toThrow();
    });

    it('should accept today\'s date', () => {
      const today = new Date();
      expect(() => TaskValidation.validateDueDate(today)).not.toThrow();
    });

    it('should accept undefined date', () => {
      expect(() => TaskValidation.validateDueDate(undefined)).not.toThrow();
    });

    it('should throw error for past date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(() => TaskValidation.validateDueDate(yesterday)).toThrow();
    });
  });

  describe('validateTask', () => {
    it('should validate complete task successfully', () => {
      const task: Partial<Task> = {
        title: 'Valid task title',
        description: 'Valid description',
        dueDate: new Date(Date.now() + 86400000), // tomorrow
      };

      expect(() => TaskValidation.validateTask(task)).not.toThrow();
    });

    it('should validate task with only title', () => {
      const task: Partial<Task> = {
        title: 'Valid task title',
      };

      expect(() => TaskValidation.validateTask(task)).not.toThrow();
    });

    it('should throw error if title is invalid', () => {
      const task: Partial<Task> = {
        title: 'ab',
        description: 'Valid description',
      };

      expect(() => TaskValidation.validateTask(task)).toThrow();
    });

    it('should throw error if description is invalid', () => {
      const task: Partial<Task> = {
        title: 'Valid task title',
        description: 'a'.repeat(1001),
      };

      expect(() => TaskValidation.validateTask(task)).toThrow();
    });

    it('should throw error if dueDate is invalid', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const task: Partial<Task> = {
        title: 'Valid task title',
        dueDate: yesterday,
      };

      expect(() => TaskValidation.validateTask(task)).toThrow();
    });

    it('should not validate undefined fields', () => {
      const task: Partial<Task> = {};
      expect(() => TaskValidation.validateTask(task)).not.toThrow();
    });
  });

  describe('isTaskValidationError', () => {
    it('should identify validation errors correctly', () => {
      try {
        TaskValidation.validateTitle('ab');
      } catch (error) {
        expect(isTaskValidationError(error)).toBe(true);
      }
    });

    it('should return false for regular errors', () => {
      const error = new Error('Regular error');
      expect(isTaskValidationError(error)).toBe(false);
    });
  });
});
