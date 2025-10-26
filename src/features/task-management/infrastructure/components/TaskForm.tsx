// src/features/task-management/infrastructure/components/TaskForm.tsx

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/_shared/infrastructure/components/ui/dialog';
import { Input } from '@/_shared/infrastructure/components/ui/input';
import { Textarea } from '@/_shared/infrastructure/components/ui/textarea';
import { Label } from '@/_shared/infrastructure/components/ui/label';
import { Button } from '@/_shared/infrastructure/components/ui/button';
import { useTasks } from '@/features/task-management/application/hooks/useTasks';
import { TaskValidation, isTaskValidationError } from '@/features/task-management/domain/TaskValidation';
import type { Task } from '@/features/task-management/domain/Task';
// @ts-ignore - CSS modules are handled by Vite
import styles from './TaskForm.module.css';

export interface TaskFormProps {
  task?: Task | null;
  onClose: () => void;
}

interface FormErrors {
  title?: string;
  description?: string;
  dueDate?: string;
}

export function TaskForm({ task, onClose }: TaskFormProps): React.ReactElement {
  const { createTask, updateTask } = useTasks();
  const isEditMode = !!task;

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  );
  const [status, setStatus] = useState<'pending' | 'completed'>(task?.status || 'pending');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Validate on change
    const newErrors: FormErrors = {};

    try {
      TaskValidation.validateTitle(title);
    } catch (error) {
      if (isTaskValidationError(error)) {
        newErrors.title = error.message;
      }
    }

    try {
      TaskValidation.validateDescription(description || undefined);
    } catch (error) {
      if (isTaskValidationError(error)) {
        newErrors.description = error.message;
      }
    }

    if (dueDate) {
      try {
        const dueDateObj = new Date(dueDate);
        TaskValidation.validateDueDate(dueDateObj);
      } catch (error) {
        if (isTaskValidationError(error)) {
          newErrors.dueDate = error.message;
        }
      }
    }

    setErrors(newErrors);
  }, [title, description, dueDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0 || !title.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const taskData = {
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        status,
      };

      if (isEditMode && task) {
        await updateTask({
          ...task,
          ...taskData,
          resolvedAt: status === 'completed' && task.status === 'pending'
            ? new Date()
            : status === 'pending' && task.status === 'completed'
            ? undefined
            : task.resolvedAt,
        });
      } else {
        await createTask(taskData);
      }

      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = title.trim().length >= 3 && Object.keys(errors).length === 0;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className={styles.taskForm}>
        <DialogHeader>
          <DialogTitle className={styles.taskForm__title}>
            {isEditMode ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className={styles.taskForm__closeButton}
            aria-label="Close"
          >
            <X size={20} />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className={styles.taskForm__form}>
          <div className={styles.taskForm__field}>
            <Label htmlFor="title" className={styles.taskForm__label}>
              Title *
            </Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              aria-required="true"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
              className={errors.title ? styles['taskForm__input--error'] : ''}
            />
            {errors.title && (
              <p id="title-error" className={styles.taskForm__error}>
                {errors.title}
              </p>
            )}
          </div>

          <div className={styles.taskForm__field}>
            <Label htmlFor="description" className={styles.taskForm__label}>
              Description (optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this task..."
              rows={4}
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'description-error' : undefined}
              className={errors.description ? styles['taskForm__input--error'] : ''}
            />
            {errors.description && (
              <p id="description-error" className={styles.taskForm__error}>
                {errors.description}
              </p>
            )}
          </div>

          <div className={styles.taskForm__field}>
            <Label htmlFor="dueDate" className={styles.taskForm__label}>
              Due Date (optional)
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              aria-invalid={!!errors.dueDate}
              aria-describedby={errors.dueDate ? 'dueDate-error' : undefined}
              className={errors.dueDate ? styles['taskForm__input--error'] : ''}
            />
            {errors.dueDate && (
              <p id="dueDate-error" className={styles.taskForm__error}>
                {errors.dueDate}
              </p>
            )}
          </div>

          {isEditMode && (
            <div className={styles.taskForm__field}>
              <Label className={styles.taskForm__label}>Status</Label>
              <div className={styles.taskForm__radioGroup}>
                <label className={styles.taskForm__radioLabel}>
                  <input
                    type="radio"
                    name="status"
                    value="pending"
                    checked={status === 'pending'}
                    onChange={(e) => setStatus(e.target.value as 'pending' | 'completed')}
                  />
                  <span>Pending</span>
                </label>
                <label className={styles.taskForm__radioLabel}>
                  <input
                    type="radio"
                    name="status"
                    value="completed"
                    checked={status === 'completed'}
                    onChange={(e) => setStatus(e.target.value as 'pending' | 'completed')}
                  />
                  <span>Completed</span>
                </label>
              </div>
            </div>
          )}

          <div className={styles.taskForm__actions}>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
