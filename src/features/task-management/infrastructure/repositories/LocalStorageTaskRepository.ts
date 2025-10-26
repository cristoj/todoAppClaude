// src/features/task-management/infrastructure/repositories/LocalStorageTaskRepository.ts

import type { Task } from '@/features/task-management/domain/Task';
import type { TaskRepository } from '@/features/task-management/domain/TaskRepository.interface';
import { TaskValidation } from '@/features/task-management/domain/TaskValidation';

export class LocalStorageTaskRepository implements TaskRepository {
  private readonly STORAGE_KEY = 'tasks';

  async save(task: Task): Promise<void> {
    TaskValidation.validateTask(task);

    const tasks = await this.findAll();
    const exists = tasks.some(t => t.id === task.id);

    if (exists) {
      throw new Error(`Task with id ${task.id} already exists`);
    }

    const newTasks = [...tasks, task];
    this.saveTasks(newTasks);
  }

  async update(task: Task): Promise<void> {
    TaskValidation.validateTask(task);

    const tasks = await this.findAll();
    const index = tasks.findIndex(t => t.id === task.id);

    if (index === -1) {
      throw new Error(`Task with id ${task.id} not found`);
    }

    tasks[index] = task;
    this.saveTasks(tasks);
  }

  async delete(id: string): Promise<void> {
    const tasks = await this.findAll();
    const filtered = tasks.filter(t => t.id !== id);
    this.saveTasks(filtered);
  }

  async findById(id: string): Promise<Task | null> {
    const tasks = await this.findAll();
    return tasks.find(t => t.id === id) ?? null;
  }

  async findAll(): Promise<Task[]> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];

      const tasks = JSON.parse(data) as Task[];

      // Convert strings to Date objects
      return tasks.map(task => ({
        ...task,
        createdAt: new Date(task.createdAt),
        resolvedAt: task.resolvedAt ? new Date(task.resolvedAt) : undefined,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      }));
    } catch (error) {
      console.error('Error reading tasks from localStorage:', error);
      return [];
    }
  }

  private saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please delete some tasks.');
      }
      throw error;
    }
  }
}
