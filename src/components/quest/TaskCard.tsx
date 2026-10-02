import React from 'react';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TaskCardData {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  status?: 'completed' | 'in_progress' | 'pending';
}

interface TaskCardProps {
  task: TaskCardData;
  className?: string;
}

export function TaskCard({ task, className }: TaskCardProps) {
  const isCompleted = task.completed || task.status === 'completed';

  return (
    <div
      className={cn(
        'group relative rounded-2xl border bg-card p-6 shadow-sm transition-colors',
        'hover:shadow-md',
        isCompleted ? 'border-emerald-200 bg-emerald-50/40' : 'border-border bg-card',
        className
      )}
    >
      <div className="absolute left-0 top-6 bottom-6 w-1 rounded-full bg-primary" />
      <div className="flex items-start gap-4 pl-2">
        <div
          className={cn(
            'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border',
            isCompleted
              ? 'border-emerald-600 bg-emerald-600 text-white'
              : 'border-muted-foreground/40 text-muted-foreground'
          )}
          aria-hidden
        >
          {isCompleted ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h4 className="text-[15px] font-semibold leading-snug text-foreground">
              {task.title}
            </h4>
            <span
              className={cn(
                'shrink-0 rounded-full px-2.5 py-1 text-xs font-medium',
                isCompleted
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {isCompleted ? 'Completed' : task.status === 'in_progress' ? 'In progress' : 'Pending'}
            </span>
          </div>
          {task.description && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {task.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
