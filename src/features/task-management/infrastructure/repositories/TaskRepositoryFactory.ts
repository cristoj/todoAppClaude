// src/features/task-management/infrastructure/repositories/TaskRepositoryFactory.ts

import type { TaskRepository } from '@/features/task-management/domain/TaskRepository.interface';
import { LocalStorageTaskRepository } from '@/features/task-management/infrastructure/repositories/LocalStorageTaskRepository';

export class TaskRepositoryFactory {
  static create(): TaskRepository {
    return new LocalStorageTaskRepository();
  }
}
