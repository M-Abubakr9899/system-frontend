import React from 'react';
import { Link, useLocation } from 'wouter';
import { LayoutDashboard, Calendar, Shield, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProgressBar from './ProgressBar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { User } from '@/lib/types';

interface SideNavigationProps {
  className?: string;
}

const SideNavigation: React.FC<SideNavigationProps> = ({ className }) => {
  const [location] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/user']
  });
  
  const { mutate: resetSystem, isPending: isResetting } = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/user/reset', {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: "System Reset",
        description: "Your progress has been reset successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Reset failed",
        description: String(error),
        variant: "destructive",
      });
    }
  });

  const handleReset = () => {
    if (confirm('Are you sure you want to reset your progress? This will reset all player stats and task completions but keep your skills, rules and daily tasks.')) {
      resetSystem();
    }
  };

  return (
    <aside className={cn(
      "fixed h-screen w-64 bg-sidebar border-r border-gray-800 z-20",
      className
    )}>
      <div className="p-4 border-b border-gray-800">
        <h1 className="font-bold text-2xl text-primary glow-text">SYSTEM</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-Life Enhancement</p>
      </div>
      
      <div className="mt-6 px-4">
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full overflow-hidden glow-subtle bg-primary/20">
              <span className="flex items-center justify-center h-full text-primary font-semibold">
                {!isLoading && user ? user.level : "?"}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-foreground">Hunter</h3>
              <p className="text-xs text-muted-foreground">Level <span>{!isLoading && user ? user.level : "?"}</span></p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-1">Experience</p>
            {!isLoading && user ? (
              <>
                <ProgressBar 
                  value={user.experience} 
                  max={user.level * 100} 
                />
                <p className="text-xs text-right mt-1 text-muted-foreground">
                  {user.experience} / {user.level * 100}
                </p>
              </>
            ) : (
              <div className="animate-pulse">
                <div className="w-full bg-secondary h-2 rounded-full"></div>
                <p className="text-xs text-right mt-1 text-muted-foreground">Loading...</p>
              </div>
            )}
          </div>
        </div>
        
        <nav className="mt-8">
          <ul className="space-y-1">
            <li>
              <Link href="/">
                <div className={cn(
                  "w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors",
                  location === "/"
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-secondary"
                )}>
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/timetable">
                <div className={cn(
                  "w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors",
                  location === "/timetable"
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-secondary"
                )}>
                  <Calendar className="h-5 w-5" />
                  <span>Time Table</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/rules">
                <div className={cn(
                  "w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors",
                  location === "/rules"
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-secondary"
                )}>
                  <Shield className="h-5 w-5" />
                  <span>Rules</span>
                </div>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
        <Button 
          className="w-full bg-sidebar-accent text-primary border border-primary rounded-lg py-2 hover:bg-primary hover:text-white transition-colors flex items-center justify-center space-x-2 glow-subtle"
          onClick={handleReset}
          disabled={isResetting}
        >
          <Repeat className="h-5 w-5" />
          <span>Reset System</span>
        </Button>
      </div>
    </aside>
  );
};

export default SideNavigation;
