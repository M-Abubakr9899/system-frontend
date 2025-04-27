import React from 'react';
import { Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

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
        variant: task.isCompleted ? "default" : "default",
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

  const { mutate: deleteTask, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('DELETE', `/api/tasks/${task.id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: "Task deleted",
        description: "The task has been successfully removed",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting task",
        description: String(error),
        variant: "destructive",
      });
    }
  });

  const handleToggleComplete = () => {
    toggleCompletion(!task.isCompleted);
  };

  const handleDelete = () => {
    deleteTask();
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
            disabled={isPending || isDeleting}
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
        <div className="flex items-center space-x-2">
          <div className="text-xs text-muted-foreground bg-background px-2 py-1 rounded">
            Daily
          </div>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-500/10 transition-colors"
            aria-label="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
