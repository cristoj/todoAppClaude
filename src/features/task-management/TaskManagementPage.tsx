// src/features/task-management/TaskManagementPage.tsx

import { TaskProvider } from '@/features/task-management/application/TaskContext';
import { TaskRepositoryFactory } from '@/features/task-management/infrastructure/repositories/TaskRepositoryFactory';
import { TaskList } from '@/features/task-management/infrastructure/components/TaskList';

const taskRepository = TaskRepositoryFactory.create();

export function TaskManagementPage(): React.ReactElement {
  return (
    <TaskProvider repository={taskRepository}>
      <TaskList />
    </TaskProvider>
  );
}
