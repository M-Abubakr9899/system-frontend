import React from 'react';
import { Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { mutate: toggleCompletion, isPending } = useMutation({
    mutationFn: async (isCompleted: boolean) => {
      const res = await apiRequest('PATCH', `/api/tasks/${task.id}/complete`, { isCompleted });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      toast({
        title: task.isCompleted ? "Task unmarked" : "Task completed",
        description: `${task.points} points ${task.isCompleted ? 'removed' : 'added'}`,
        variant: task.isCompleted ? "default" : "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating task",
        description: String(error),
        variant: "destructive",
      });
    }
  });

  const handleToggleComplete = () => {
    toggleCompletion(!task.isCompleted);
  };

  return (
    <div 
      className={cn(
        "task-transition bg-secondary rounded-lg p-4 border border-transparent hover:border-gray-700 mb-4",
        { "completed": task.isCompleted }
      )}
    >
      <div className="flex justify-between">
        <div className="flex items-start space-x-3">
          <button 
            className={cn(
              "mt-1 w-5 h-5 rounded-full border-2 border-primary flex-shrink-0 hover:bg-primary/20 transition-colors",
              { "bg-primary": task.isCompleted }
            )}
            onClick={handleToggleComplete}
            disabled={isPending}
            aria-label={task.isCompleted ? "Mark incomplete" : "Mark complete"}
          />
          <div>
            <h4 className="font-medium">{task.title}</h4>
            <p className="text-sm text-muted-foreground">
              {task.duration && `${task.duration} • `}+{task.points} points
            </p>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
            )}
          </div>
        </div>
        <div className="text-xs text-muted-foreground bg-background px-2 py-1 rounded">
          Daily
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
