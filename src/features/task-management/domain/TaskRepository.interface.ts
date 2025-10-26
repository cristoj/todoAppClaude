// src/features/task-management/domain/TaskRepository.interface.ts

import type { Task } from './Task';

export interface TaskRepository {
  save(task: Task): Promise<void>;
  update(task: Task): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Task | null>;
  findAll(): Promise<Task[]>;
}
