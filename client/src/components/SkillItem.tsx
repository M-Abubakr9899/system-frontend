import React from 'react';
import { Skill } from '@/lib/types';
import ProgressBar from './ProgressBar';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface SkillItemProps {
  skill: Skill;
  showDelete?: boolean;
}

const SkillItem: React.FC<SkillItemProps> = ({ skill, showDelete = false }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { mutate: deleteSkill, isPending } = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('DELETE', `/api/skills/${skill.id}`, undefined);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/skills'] });
      toast({
        title: "Skill removed",
        description: `${skill.name} has been deleted`,
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error removing skill",
        description: String(error),
        variant: "destructive",
      });
    }
  });

  const handleDelete = () => {
    if (confirm(`Are you sure you want to remove the ${skill.name} skill?`)) {
      deleteSkill();
    }
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm">{skill.name}</span>
        <div className="flex items-center">
          <span className="text-sm font-medium text-primary mr-2">Lv. {skill.level}</span>
          {showDelete && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-muted-foreground hover:text-destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <ProgressBar 
        value={skill.experience} 
        max={skill.maxExperience} 
      />
    </div>
  );
};

export default SkillItem;
