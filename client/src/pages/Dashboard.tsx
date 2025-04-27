import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Task, Skill, User } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StatusCard, StatItem } from '@/components/StatusCard';
import TaskItem from '@/components/TaskItem';
import SkillItem from '@/components/SkillItem';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap, 
  LightbulbIcon, 
  ClipboardList
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', duration: '', points: 10 });
  const [newSkill, setNewSkill] = useState({ name: '', level: 1, experience: 0, maxExperience: 100 });
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: user, isLoading: isUserLoading } = useQuery<User>({
    queryKey: ['/api/user'],
  });
  
  const { data: tasks, isLoading: isTasksLoading } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
  });
  
  const { data: skills, isLoading: isSkillsLoading } = useQuery<Skill[]>({
    queryKey: ['/api/skills'],
  });
  
  const { mutate: addTask, isPending: isAddingTask } = useMutation({
    mutationFn: async (taskData: typeof newTask) => {
      const res = await apiRequest('POST', '/api/tasks', taskData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      setIsAddTaskOpen(false);
      setNewTask({ title: '', description: '', duration: '', points: 10 });
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
  
  const { mutate: addSkill, isPending: isAddingSkill } = useMutation({
    mutationFn: async (skillData: typeof newSkill) => {
      const res = await apiRequest('POST', '/api/skills', skillData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/skills'] });
      setIsAddSkillOpen(false);
      setNewSkill({ name: '', level: 1, experience: 0, maxExperience: 100 });
      toast({
        title: "Skill added",
        description: "New skill has been added successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding skill",
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
  
  const handleAddSkill = () => {
    if (!newSkill.name) {
      toast({
        title: "Missing information",
        description: "Please provide a skill name",
        variant: "destructive",
      });
      return;
    }
    addSkill(newSkill);
  };
  
  const completedTasks = tasks?.filter(task => task.isCompleted)?.length || 0;
  const totalTasks = tasks?.length || 0;
  
  return (
    <Layout title="Dashboard" subtitle="Hunter Status">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Hunter Status Card */}
        <StatusCard title="Hunter Status" icon={Zap}>
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
                max={10} 
              />
              
              <StatItem 
                label="Points" 
                value={user?.points || 0} 
                showProgress={false} 
              />
              <div className="rounded-md bg-secondary p-2 text-center text-sm">
                Next reward at <span className="text-primary">{((user?.points || 0) + 100) - ((user?.points || 0) % 100)}</span> points
              </div>
              
              <StatItem 
                label="Tasks Completed" 
                value={`${completedTasks} / ${totalTasks}`} 
                max={totalTasks} 
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
        
        {/* Skills Card */}
        <StatusCard title="Skills" icon={LightbulbIcon}>
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs px-2 py-1 bg-secondary text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
              onClick={() => setIsAddSkillOpen(true)}
            >
              + Add Skill
            </Button>
          </div>
          
          {isSkillsLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-secondary rounded"></div>
              <div className="h-2 bg-secondary rounded"></div>
              <div className="h-4 bg-secondary rounded"></div>
              <div className="h-2 bg-secondary rounded"></div>
            </div>
          ) : skills && skills.length > 0 ? (
            <div className="space-y-4">
              {skills.map(skill => (
                <SkillItem key={skill.id} skill={skill} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              No skills found. Add a new skill to get started.
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
        ) : tasks && tasks.length > 0 ? (
          <div className="space-y-0">
            {tasks.map(task => (
              <TaskItem key={task.id} task={task} />
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
              <Label htmlFor="task-points" className="text-right">Points</Label>
              <Input 
                id="task-points" 
                type="number"
                value={newTask.points}
                onChange={(e) => setNewTask({...newTask, points: parseInt(e.target.value) || 0})}
                className="col-span-3"
                min={1}
                max={100}
              />
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
      
      {/* Add Skill Dialog */}
      <Dialog open={isAddSkillOpen} onOpenChange={setIsAddSkillOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Skill</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skill-name" className="text-right">Name</Label>
              <Input 
                id="skill-name" 
                value={newSkill.name}
                onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                className="col-span-3"
                placeholder="Skill name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skill-level" className="text-right">Level</Label>
              <Input 
                id="skill-level" 
                type="number"
                value={newSkill.level}
                onChange={(e) => setNewSkill({...newSkill, level: parseInt(e.target.value) || 1})}
                className="col-span-3"
                min={1}
                max={99}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddSkillOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddSkill}
              disabled={isAddingSkill}
            >
              Add Skill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Dashboard;
