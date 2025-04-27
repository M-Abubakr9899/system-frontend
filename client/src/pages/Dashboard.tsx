import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Task, User } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StatusCard, StatItem } from '@/components/StatusCard';
import { Progress } from '@/components/ui/progress';
import TaskItem from '@/components/TaskItem';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap, 
  ClipboardList
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', duration: '' });
  const [dayPointsProgress, setDayPointsProgress] = useState(0);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: user, isLoading: isUserLoading } = useQuery<User>({
    queryKey: ['/api/user'],
  });
  
  const { data: tasks, isLoading: isTasksLoading } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
  });
  
  // Use state to manage ordered tasks
  const [orderedTasks, setOrderedTasks] = React.useState<Task[]>([]);
  
  // Update orderedTasks when tasks change
  React.useEffect(() => {
    if (tasks) {
      setOrderedTasks([...tasks]);
    }
  }, [tasks]);
  
  // Functions for task reordering
  const moveTaskUp = (id: number) => {
    if (!orderedTasks.length) return;
    const taskIndex = orderedTasks.findIndex(t => t.id === id);
    if (taskIndex <= 0) return;
    
    const updatedTasks = [...orderedTasks];
    const temp = updatedTasks[taskIndex];
    updatedTasks[taskIndex] = updatedTasks[taskIndex - 1];
    updatedTasks[taskIndex - 1] = temp;
    
    // Update the local state for reordering
    setOrderedTasks(updatedTasks);
    
    // We would need backend support to persist this order
    // For now, update the local state for UI demonstration
    queryClient.setQueryData(['/api/tasks'], updatedTasks);
  };
  
  const moveTaskDown = (id: number) => {
    if (!orderedTasks.length) return;
    const taskIndex = orderedTasks.findIndex(t => t.id === id);
    if (taskIndex === -1 || taskIndex === orderedTasks.length - 1) return;
    
    const updatedTasks = [...orderedTasks];
    const temp = updatedTasks[taskIndex];
    updatedTasks[taskIndex] = updatedTasks[taskIndex + 1];
    updatedTasks[taskIndex + 1] = temp;
    
    // Update the local state for reordering
    setOrderedTasks(updatedTasks);
    
    // We would need backend support to persist this order
    // For now, update the local state for UI demonstration
    queryClient.setQueryData(['/api/tasks'], updatedTasks);
  };
  
  // Calculate daily points (based on today's completed tasks)
  const dayPoints = tasks ? tasks.filter(task => task.isCompleted).length * 10 : 0;
  
  // Update the progress bar for daily points
  useEffect(() => {
    // Set max to 100 (for level up) or higher if they've earned more
    const maxPoints = Math.max(100, dayPoints);
    setDayPointsProgress((dayPoints / maxPoints) * 100);
  }, [dayPoints]);
  
  // Setup auto reset of tasks at midnight
  useEffect(() => {
    // Check if we need to reset tasks when component first mounts
    const checkInitialReset = () => {
      // Get last reset date from local storage
      const lastResetDate = localStorage.getItem('lastTaskReset');
      const now = new Date();
      const today = now.toDateString();
      
      // If we haven't reset today, do it
      if (lastResetDate !== today) {
        resetAllTasks();
        localStorage.setItem('lastTaskReset', today);
      }
    };
    
    checkInitialReset();
    
    // Also set up the interval check for midnight
    const checkTime = () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        // It's midnight - reset tasks
        resetAllTasks();
        localStorage.setItem('lastTaskReset', now.toDateString());
      }
    };
    
    const minuteTimer = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(minuteTimer);
  }, []);
  
  const resetAllTasks = async () => {
    try {
      await apiRequest('POST', '/api/tasks/reset', {});
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: "Tasks Reset",
        description: "Daily tasks have been reset for the new day",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to reset tasks:", error);
    }
  };
  
  const { mutate: addTask, isPending: isAddingTask } = useMutation({
    mutationFn: async (taskData: typeof newTask) => {
      // Always set points to 10
      const taskWithPoints = { ...taskData, points: 10 };
      const res = await apiRequest('POST', '/api/tasks', taskWithPoints);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      setIsAddTaskOpen(false);
      setNewTask({ title: '', description: '', duration: '' });
      toast({
        title: "Task added",
        description: "New task has been added successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding task",
        description: String(error),
        variant: "destructive",
      });
    }
  });
  
  const handleAddTask = () => {
    if (!newTask.title) {
      toast({
        title: "Missing information",
        description: "Please provide a task title",
        variant: "destructive",
      });
      return;
    }
    addTask(newTask);
  };
  
  const completedTasks = tasks?.filter(task => task.isCompleted)?.length || 0;
  const totalTasks = tasks?.length || 0;
  
  // Calculate completion percentage for StatItem
  const taskCompletionPercentage = totalTasks > 0 ? completedTasks : 0;
  
  return (
    <Layout title="Dashboard" subtitle="Player Status">
      <div className="mb-8">
        {/* Status Card */}
        <StatusCard title="Status" icon={Zap}>
          {isUserLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-secondary rounded"></div>
              <div className="h-4 bg-secondary rounded w-3/4"></div>
              <div className="h-4 bg-secondary rounded"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <StatItem 
                label="Level" 
                value={user?.level || 1} 
                max={100} 
              />
              
              <div className="space-y-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Daily Points</span>
                  <span className="text-sm font-medium text-primary">{dayPoints} points</span>
                </div>
                <Progress value={dayPointsProgress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">
                  Points earned today
                </p>
              </div>
              
              <StatItem 
                label="Tasks Completed" 
                value={`${completedTasks} / ${totalTasks}`} 
                max={totalTasks > 0 ? totalTasks : 1} 
                showProgress={true}
              />
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Daily Streak</span>
                  <span className="text-sm font-medium text-primary">{user?.streak || 0} days</span>
                </div>
                <div className="flex space-x-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div 
                      key={i}
                      className={`flex-1 h-1 rounded-full ${i < (user?.streak || 0) ? 'bg-primary glow-subtle' : 'bg-background'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </StatusCard>
      </div>
      
      {/* Daily Tasks Section */}
      <StatusCard title="Daily Tasks" icon={ClipboardList}>
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="outline"
            className="text-xs px-2 py-1 bg-secondary text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
            onClick={() => setIsAddTaskOpen(true)}
          >
            + Add Task
          </Button>
        </div>
        
        {isTasksLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-16 bg-secondary rounded"></div>
            <div className="h-16 bg-secondary rounded"></div>
            <div className="h-16 bg-secondary rounded"></div>
          </div>
        ) : orderedTasks && orderedTasks.length > 0 ? (
          <div className="space-y-0">
            {orderedTasks.map((task, index) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onMoveUp={index > 0 ? moveTaskUp : undefined}
                onMoveDown={index < orderedTasks.length - 1 ? moveTaskDown : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-4">
            No tasks found. Add a new task to get started.
          </div>
        )}
      </StatusCard>
      
      {/* Add Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-title" className="text-right">Title</Label>
              <Input 
                id="task-title" 
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="col-span-3"
                placeholder="Task title"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-description" className="text-right">Description</Label>
              <Textarea 
                id="task-description" 
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                className="col-span-3"
                placeholder="Optional description"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-duration" className="text-right">Duration</Label>
              <Input 
                id="task-duration" 
                value={newTask.duration}
                onChange={(e) => setNewTask({...newTask, duration: e.target.value})}
                className="col-span-3"
                placeholder="e.g. 30 Min, 1 Hour"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Points</Label>
              <div className="col-span-3 text-muted-foreground">
                Each task is worth 10 points
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddTaskOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddTask}
              disabled={isAddingTask}
            >
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Dashboard;
