import React from 'react';
import { Rule } from '@/lib/types';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface RuleItemProps {
  rule: Rule;
  showDelete?: boolean;
}

const RuleItem: React.FC<RuleItemProps> = ({ rule, showDelete = false }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { mutate: deleteRule, isPending } = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('DELETE', `/api/rules/${rule.id}`, undefined);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rules'] });
      toast({
        title: "Rule removed",
        description: `"${rule.description}" has been deleted`,
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error removing rule",
        description: String(error),
        variant: "destructive",
      });
    }
  });

  const handleDelete = () => {
    if (confirm(`Are you sure you want to remove this rule?`)) {
      deleteRule();
    }
  };

  return (
    <div className="flex items-center p-3 bg-secondary rounded-lg border border-transparent hover:border-gray-700 transition-colors mb-3">
      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mr-3">
        {rule.type === 'follow' ? (
          <CheckCircle className="h-3 w-3 text-primary" />
        ) : (
          <XCircle className="h-3 w-3 text-primary" />
        )}
      </div>
      <span className={cn(
        "flex-1",
        { "text-muted-foreground": rule.type === 'avoid' }
      )}>{rule.description}</span>
      
      {showDelete && !rule.isDefault && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={handleDelete}
          disabled={isPending}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default RuleItem;
