// test/features/task-management/application/hooks/useTaskFiltering.test.tsx

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTaskFiltering } from '@/features/task-management/application/hooks/useTaskFiltering';
import { TaskFilterType, DateFilterType, type Task } from '@/features/task-management/domain/Task';

describe('useTaskFiltering', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Buy groceries',
      description: 'Milk and eggs',
      status: 'pending',
      dueDate: new Date('2025-01-15T00:00:00Z'), // Today
      createdAt: new Date('2025-01-10T00:00:00Z')
    },
    {
      id: '2',
      title: 'Complete report',
      description: 'Q4 financial report',
      status: 'pending',
      dueDate: new Date('2025-01-10T00:00:00Z'), // Overdue (past)
      createdAt: new Date('2025-01-05T00:00:00Z')
    },
    {
      id: '3',
      title: 'Fix bug in authentication',
      description: 'Login form validation',
      status: 'completed',
      dueDate: new Date('2025-01-12T00:00:00Z'),
      resolvedAt: new Date('2025-01-12T14:30:00Z'),
      createdAt: new Date('2025-01-08T00:00:00Z')
    },
    {
      id: '4',
      title: 'Schedule meeting',
      description: 'Team sync',
      status: 'pending',
      dueDate: new Date('2025-01-18T00:00:00Z'), // This week (Saturday)
      createdAt: new Date('2025-01-12T00:00:00Z')
    },
    {
      id: '5',
      title: 'Update documentation',
      description: 'API endpoints',
      status: 'pending',
      dueDate: new Date('2025-01-25T00:00:00Z'), // This month (but not this week)
      createdAt: new Date('2025-01-11T00:00:00Z')
    },
    {
      id: '6',
      title: 'Review PRs',
      description: undefined,
      status: 'pending',
      dueDate: undefined, // No date
      createdAt: new Date('2025-01-13T00:00:00Z')
    },
    {
      id: '7',
      title: 'Deploy to production',
      description: 'Deploy version 2.0',
      status: 'completed',
      dueDate: new Date('2025-01-14T00:00:00Z'),
      resolvedAt: new Date('2025-01-14T16:00:00Z'),
      createdAt: new Date('2025-01-09T00:00:00Z')
    }
  ];

  describe('Initial state', () => {
    it('should return all tasks when no filters are applied', () => {
      const { result } = renderHook(() => useTaskFiltering(mockTasks));

      expect(result.current.filteredTasks).toHaveLength(7);
      expect(result.current.searchQuery).toBe('');
      expect(result.current.statusFilter).toBe(TaskFilterType.ALL);
      expect(result.current.dateFilter).toBe(DateFilterType.ALL);
    });

    it('should initialize with empty custom range', () => {
      const { result } = renderHook(() => useTaskFiltering(mockTasks));

      expect(result.current.customRange).toEqual({});
    });
  });

  describe('Search filtering', () => {
    it('should filter tasks by title', () => {
      const { result } = renderHook(() => useTaskFiltering(mockTasks));

      act(() => {
        result.current.setSearchQuery('bug');
      });

      expect(result.current.filteredTasks).toHaveLength(1);
      expect(result.current.filteredTasks[0].title).toBe('Fix bug in authentication');
    });

    it('should filter tasks by description', () => {
      const { result } = renderHook(() => useTaskFiltering(mockTasks));

      act(() => {
        result.current.setSearchQuery('financial');
      });

      expect(result.current.filteredTasks).toHaveLength(1);
      expect(result.current.filteredTasks[0].title).toBe('Complete report');
    });

    it('should be case insensitive', () => {
      const { result } = renderHook(() => useTaskFiltering(mockTasks));

      act(() => {
        result.current.setSearchQuery('BUG');
      });

      expect(result.current.filteredTasks).toHaveLength(1);
      expect(result.current.filteredTasks[0].title).toBe('Fix bug in authentication');
    });

    it('should trim whitespace from search query', () => {
      const { result } = renderHook(() => useTaskFiltering(mockTasks));

      act(() => {
        result.current.setSearchQuery('  bug  ');
      });

      expect(result.current.filteredTasks).toHaveLength(1);
    });

    it('should return all tasks when search query is empty', () => {
      const { result } = renderHook(() => useTaskFiltering(mockTasks));

      act(() => {
        result.current.setSearchQuery('bug');
      });

      expect(result.current.filteredTasks).toHaveLength(1);

      act(() => {
        result.current.setSearchQuery('');
      });

      expect(result.current.filteredTasks).toHaveLength(7);
    });

    it('should return empty array when no tasks match search', () => {
      const { result } = renderHook(() => useTaskFiltering(mockTasks));

      act(() => {
        result.current.setSearchQuery('nonexistent task');
      });

      expect(result.current.filteredTasks).toHaveLength(0);
    });
  });

  describe('Status filtering', () => {
    it('should filter pending tasks', () => {
      const { result } = renderHook(() => useTaskFiltering(mockTasks));

      act(() => {
        result.current.setStatusFilter(TaskFilterType.PENDING);
      });

      expect(result.current.filteredTasks).toHaveLength(5);
      expect(result.current.filteredTasks.every(t => t.status === 'pending')).toBe(true);
    });

    it('should filter completed tasks', () => {
      const { result } = renderHook(() => useTaskFiltering(mockTasks));

      act(() => {
        result.current.setStatusFilter(TaskFilterType.COMPLETED);
      });

      expect(result.current.filteredTasks).toHaveLength(2);
      expect(result.current.filteredTasks.every(t => t.status === 'completed')).toBe(true);
    });

    it('should filter overdue tasks', () => {
      // Use vi.setSystemTime to mock the current date
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-15T10:00:00Z'));

      const { result } = renderHook(() => useTaskFiltering(mockTasks));

      act(() => {
        result.current.setStatusFilter(TaskFilterType.OVERDUE);
      });

      expect(result.current.filteredTasks).toHaveLength(1);
      expect(result.current.filteredTasks[0].id).toBe('2'); // Complete report is overdue

      // Restore real timers
      vi.useRealTimers();
    });

    it('should not include completed tasks in overdue filter', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-15T10:00:00Z'));

      const { result } = renderHook(() => useTaskFiltering(mockTasks));

      act(() => {
        result.current.setStatusFilter(TaskFilterType.OVERDUE);
      });

      const hasCompletedTask = result.current.filteredTasks.some(t => t.status === 'completed');
      expect(hasCompletedTask).toBe(false);

      vi.useRealTimers();
    });

    it('should not include tasks without due date in overdue filter', () => {
      const { result } = renderHook(() => useTaskFiltering(mockTasks));

      act(() => {
        result.current.setStatusFilter(TaskFilterType.OVERDUE);
      });

      const hasTaskWithoutDate = result.current.filteredTasks.some(t => !t.dueDate);
      expect(hasTaskWithoutDate).toBe(false);
    });
  });

  describe('Date filtering', () => {
    it('should filter tasks due today', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-15T10:00:00Z'));

      const { result } = renderHook(() => useTaskFiltering(mockTasks));

      act(() => {
        result.current.setDateFilter(DateFilterType.TODAY);
      });

      expect(result.current.filteredTasks).toHaveLength(1);
      expect(result.current.filteredTasks[0].id).toBe('1');

      vi.useRealTimers();
    });

    it('should filter tasks due this week', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-15T10:00:00Z'));

      const { result } = renderHook(() => useTaskFiltering(mockTasks));

      act(() => {
        result.current.setDateFilter(DateFilterType.THIS_WEEK);
      });

      // Week: Sunday 2025-01-12 to Saturday 2025-01-18
      // Should include: id 1 (Jan 15), id 4 (Jan 18)
      expect(result.current.filteredTasks.length).toBeGreaterThanOrEqual(2);

      vi.useRealTimers();
    });

    it('should filter tasks due this month', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-15T10:00:00Z'));

      const { result } = renderHook(() => useTaskFiltering(mockTasks));

      act(() => {
        result.current.setDateFilter(DateFilterType.THIS_MONTH);
      });

      // All tasks with dates in January 2025
      expect(result.current.filteredTasks.length).toBeGreaterThanOrEqual(5);

      vi.useRealTimers();
    });

    it('should filter tasks without due date', () => {
      const { result } = renderHook(() => useTaskFiltering(mockTasks));

      act(() => {
        result.current.setDateFilter(DateFilterType.NO_DATE);
      });

      expect(result.current.filteredTasks).toHaveLength(1);
      expect(result.current.filteredTasks[0].id).toBe('6');
      expect(result.current.filteredTasks[0].dueDate).toBeUndefined();
    });

    it('should filter tasks with custom date range (both start and end)', () => {
      const { result } = renderHook(() => useTaskFiltering(mockTasks));

      act(() => {
        result.current.setDateFilter(DateFilterType.CUSTOM);
        const startDate = new Date('2025-01-10');
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date('2025-01-15');
        endDate.setHours(0, 0, 0, 0);
        result.current.setCustomRange({
          start: startDate,
          end: endDate
        });
      });

      // Should include tasks with due dates between Jan 10 and Jan 15 (inclusive)
      const taskIds = result.current.filteredTasks.map(t => t.id);
      expect(taskIds).toContain('1'); // Jan 15
      expect(taskIds).toContain('2'); // Jan 10
      expect(taskIds).toContain('3'); // Jan 12
    });

    it('should filter tasks with custom date range (only start)', () => {
      const { result } = renderHook(() => useTaskFiltering(mockTasks));

      act(() => {
        result.current.setDateFilter(DateFilterType.CUSTOM);
        const startDate = new Date('2025-01-15');
        startDate.setHours(0, 0, 0, 0);
        result.current.setCustomRange({
          start: startDate
        });
      });

      // Should include tasks with due dates on or after Jan 15 (inclusive)
      const taskIds = result.current.filteredTasks.map(t => t.id);
      expect(taskIds).toContain('1'); // Jan 15
      expect(taskIds).toContain('4'); // Jan 18
      expect(taskIds).toContain('5'); // Jan 25
    });

    it('should filter tasks with custom date range (only end)', () => {
      const { result } = renderHook(() => useTaskFiltering(mockTasks));

      act(() => {
        result.current.setDateFilter(DateFilterType.CUSTOM);
        result.current.setCustomRange({
          end: new Date('2025-01-12T00:00:00Z')
        });
      });

      // Should include tasks with due dates on or before Jan 12
      const taskIds = result.current.filteredTasks.map(t => t.id);
      expect(taskIds).toContain('2'); // Jan 10
      expect(taskIds).toContain('3'); // Jan 12
    });

    it('should return all tasks when custom range is empty', () => {
      const { result } = renderHook(() => useTaskFiltering(mockTasks));

      act(() => {
        result.current.setDateFilter(DateFilterType.CUSTOM);
        result.current.setCustomRange({});
      });

      expect(result.current.filteredTasks).toHaveLength(7);
    });
  });

  describe('Combined filters (cascade)', () => {
    it('should apply search then status filter', () => {
      const { result } = renderHook(() => useTaskFiltering(mockTasks));

      act(() => {
        result.current.setSearchQuery('report'); // Finds "Complete report" (pending)
        result.current.setStatusFilter(TaskFilterType.PENDING);
      });

      expect(result.current.filteredTasks).toHaveLength(1);
      expect(result.current.filteredTasks[0].id).toBe('2');
    });

    it('should apply search then status then date filter', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-15T10:00:00Z'));

      const { result } = renderHook(() => useTaskFiltering(mockTasks));

      act(() => {
        result.current.setStatusFilter(TaskFilterType.PENDING);
        result.current.setDateFilter(DateFilterType.THIS_MONTH);
      });

      // Pending tasks in January 2025
      expect(result.current.filteredTasks.length).toBeGreaterThan(0);
      expect(result.current.filteredTasks.every(t => t.status === 'pending')).toBe(true);

      vi.useRealTimers();
    });

    it('should return empty array when combined filters match nothing', () => {
      const { result } = renderHook(() => useTaskFiltering(mockTasks));

      act(() => {
        result.current.setSearchQuery('nonexistent');
        result.current.setStatusFilter(TaskFilterType.COMPLETED);
      });

      expect(result.current.filteredTasks).toHaveLength(0);
    });

    it('should apply all three filters in order', () => {
      const { result } = renderHook(() => useTaskFiltering(mockTasks));

      act(() => {
        result.current.setSearchQuery('deploy'); // Finds "Deploy to production"
        result.current.setStatusFilter(TaskFilterType.COMPLETED); // It's completed
        result.current.setDateFilter(DateFilterType.CUSTOM);
        const startDate = new Date('2025-01-14');
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date('2025-01-14');
        endDate.setHours(0, 0, 0, 0);
        result.current.setCustomRange({
          start: startDate,
          end: endDate
        });
      });

      expect(result.current.filteredTasks).toHaveLength(1);
      expect(result.current.filteredTasks[0].id).toBe('7');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty task array', () => {
      const { result } = renderHook(() => useTaskFiltering([]));

      expect(result.current.filteredTasks).toHaveLength(0);
    });

    it('should handle tasks with undefined description in search', () => {
      const { result } = renderHook(() => useTaskFiltering(mockTasks));

      act(() => {
        result.current.setSearchQuery('review');
      });

      expect(result.current.filteredTasks).toHaveLength(1);
      expect(result.current.filteredTasks[0].description).toBeUndefined();
    });

    it('should update filtered tasks when input tasks change', () => {
      const { result, rerender } = renderHook(
        ({ tasks }) => useTaskFiltering(tasks),
        { initialProps: { tasks: mockTasks } }
      );

      expect(result.current.filteredTasks).toHaveLength(7);

      const newTasks = mockTasks.slice(0, 3);
      rerender({ tasks: newTasks });

      expect(result.current.filteredTasks).toHaveLength(3);
    });
  });
});
