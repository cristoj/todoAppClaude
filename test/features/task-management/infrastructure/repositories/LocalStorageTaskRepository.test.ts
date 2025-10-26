// test/features/task-management/infrastructure/repositories/LocalStorageTaskRepository.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LocalStorageTaskRepository } from '@/features/task-management/infrastructure/repositories/LocalStorageTaskRepository';
import type { Task } from '@/features/task-management/domain/Task';
import { isTaskValidationError } from '@/features/task-management/domain/TaskValidation';

describe('LocalStorageTaskRepository', () => {
  let repository: LocalStorageTaskRepository;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    repository = new LocalStorageTaskRepository();
  });

  const createMockTask = (overrides?: Partial<Task>): Task => ({
    id: crypto.randomUUID(),
    title: 'Test task',
    description: 'Test description',
    status: 'pending',
    createdAt: new Date(),
    ...overrides,
  });

  describe('save', () => {
    it('should save a new task successfully', async () => {
      const task = createMockTask();
      await repository.save(task);

      const tasks = await repository.findAll();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].id).toBe(task.id);
      expect(tasks[0].title).toBe(task.title);
    });

    it('should not allow duplicate task IDs', async () => {
      const task = createMockTask();
      await repository.save(task);

      await expect(repository.save(task)).rejects.toThrow(`Task with id ${task.id} already exists`);
    });

    it('should validate task before saving', async () => {
      const invalidTask = createMockTask({ title: 'ab' }); // too short
      try {
        await repository.save(invalidTask);
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(isTaskValidationError(error)).toBe(true);
      }
    });

    it('should save multiple tasks', async () => {
      const task1 = createMockTask({ title: 'Task 1' });
      const task2 = createMockTask({ title: 'Task 2' });

      await repository.save(task1);
      await repository.save(task2);

      const tasks = await repository.findAll();
      expect(tasks).toHaveLength(2);
    });

    it('should save task with all optional fields', async () => {
      const dueDate = new Date(Date.now() + 86400000);
      const task = createMockTask({
        description: 'Detailed description',
        dueDate,
      });

      await repository.save(task);
      const tasks = await repository.findAll();

      expect(tasks[0].description).toBe('Detailed description');
      expect(tasks[0].dueDate).toEqual(dueDate);
    });
  });

  describe('update', () => {
    it('should update an existing task', async () => {
      const task = createMockTask({ title: 'Original title' });
      await repository.save(task);

      const updatedTask = { ...task, title: 'Updated title' };
      await repository.update(updatedTask);

      const found = await repository.findById(task.id);
      expect(found?.title).toBe('Updated title');
    });

    it('should throw error when updating non-existent task', async () => {
      const task = createMockTask();
      await expect(repository.update(task)).rejects.toThrow(`Task with id ${task.id} not found`);
    });

    it('should validate task before updating', async () => {
      const task = createMockTask();
      await repository.save(task);

      const invalidTask = { ...task, title: 'ab' }; // too short
      try {
        await repository.update(invalidTask);
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(isTaskValidationError(error)).toBe(true);
      }
    });

    it('should update task status and resolvedAt', async () => {
      const task = createMockTask();
      await repository.save(task);

      const resolvedAt = new Date();
      const updatedTask: Task = {
        ...task,
        status: 'completed',
        resolvedAt,
      };

      await repository.update(updatedTask);
      const found = await repository.findById(task.id);

      expect(found?.status).toBe('completed');
      expect(found?.resolvedAt).toEqual(resolvedAt);
    });
  });

  describe('delete', () => {
    it('should delete an existing task', async () => {
      const task = createMockTask();
      await repository.save(task);

      await repository.delete(task.id);
      const tasks = await repository.findAll();

      expect(tasks).toHaveLength(0);
    });

    it('should not throw error when deleting non-existent task', async () => {
      await expect(repository.delete('non-existent-id')).resolves.not.toThrow();
    });

    it('should only delete the specified task', async () => {
      const task1 = createMockTask({ title: 'Task 1' });
      const task2 = createMockTask({ title: 'Task 2' });

      await repository.save(task1);
      await repository.save(task2);

      await repository.delete(task1.id);
      const tasks = await repository.findAll();

      expect(tasks).toHaveLength(1);
      expect(tasks[0].id).toBe(task2.id);
    });
  });

  describe('findById', () => {
    it('should find task by ID', async () => {
      const task = createMockTask();
      await repository.save(task);

      const found = await repository.findById(task.id);
      expect(found).not.toBeNull();
      expect(found?.id).toBe(task.id);
      expect(found?.title).toBe(task.title);
    });

    it('should return null for non-existent task', async () => {
      const found = await repository.findById('non-existent-id');
      expect(found).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return empty array when no tasks exist', async () => {
      const tasks = await repository.findAll();
      expect(tasks).toEqual([]);
    });

    it('should return all tasks', async () => {
      const task1 = createMockTask({ title: 'Task 1' });
      const task2 = createMockTask({ title: 'Task 2' });
      const task3 = createMockTask({ title: 'Task 3' });

      await repository.save(task1);
      await repository.save(task2);
      await repository.save(task3);

      const tasks = await repository.findAll();
      expect(tasks).toHaveLength(3);
    });

    it('should convert date strings to Date objects', async () => {
      const task = createMockTask({
        createdAt: new Date('2025-01-01'),
        dueDate: new Date('2025-12-31'),
      });

      await repository.save(task);
      const tasks = await repository.findAll();

      expect(tasks[0].createdAt).toBeInstanceOf(Date);
      expect(tasks[0].dueDate).toBeInstanceOf(Date);
      expect(tasks[0].createdAt.getFullYear()).toBe(2025);
    });

    it('should handle tasks without optional dates', async () => {
      const task = createMockTask({
        description: undefined,
        dueDate: undefined,
        resolvedAt: undefined,
      });

      await repository.save(task);
      const tasks = await repository.findAll();

      expect(tasks[0].description).toBeUndefined();
      expect(tasks[0].dueDate).toBeUndefined();
      expect(tasks[0].resolvedAt).toBeUndefined();
    });

    it('should return empty array on JSON parse error', async () => {
      localStorage.setItem('tasks', 'invalid json');
      const tasks = await repository.findAll();
      expect(tasks).toEqual([]);
    });
  });

  describe('saveTasks (error handling)', () => {
    it('should throw error when storage quota is exceeded', async () => {
      // Mock localStorage.setItem to throw QuotaExceededError
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        const error = new DOMException('Quota exceeded', 'QuotaExceededError');
        throw error;
      });

      const task = createMockTask();

      await expect(repository.save(task)).rejects.toThrow('Storage quota exceeded. Please delete some tasks.');

      // Restore original method
      Storage.prototype.setItem = originalSetItem;
    });

    it('should re-throw other storage errors', async () => {
      // Mock localStorage.setItem to throw generic error
      const originalSetItem = Storage.prototype.setItem;
      const customError = new Error('Generic storage error');
      Storage.prototype.setItem = vi.fn(() => {
        throw customError;
      });

      const task = createMockTask();

      await expect(repository.save(task)).rejects.toThrow('Generic storage error');

      // Restore original method
      Storage.prototype.setItem = originalSetItem;
    });
  });
});
