import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RuleItem from '@/components/RuleItem';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Rule } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const Rules: React.FC = () => {
  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false);
  const [newRule, setNewRule] = useState({
    description: '',
    type: 'follow'
  });
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: rules, isLoading } = useQuery<Rule[]>({
    queryKey: ['/api/rules'],
  });
  
  const { mutate: addRule, isPending } = useMutation({
    mutationFn: async (ruleData: typeof newRule) => {
      const res = await apiRequest('POST', '/api/rules', ruleData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rules'] });
      setIsAddRuleOpen(false);
      setNewRule({ description: '', type: 'follow' });
      toast({
        title: "Rule added",
        description: "New rule has been added successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding rule",
        description: String(error),
        variant: "destructive",
      });
    }
  });
  
  const handleAddRule = () => {
    if (!newRule.description) {
      toast({
        title: "Missing information",
        description: "Please provide a rule description",
        variant: "destructive",
      });
      return;
    }
    addRule(newRule);
  };
  
  return (
    <Layout title="Rules" subtitle="Personal Guidelines">
      <Card className="bg-card border border-gray-800 hover:border-primary transition-colors duration-300">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              System Rules
            </CardTitle>
            <Button 
              variant="outline"
              className="text-xs px-2 py-1 bg-secondary text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
              onClick={() => setIsAddRuleOpen(true)}
            >
              + Add Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Rules define your boundaries and help maintain discipline. Breaking rules will result in penalty points.
          </p>
          
          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-12 bg-secondary rounded"></div>
              <div className="h-12 bg-secondary rounded"></div>
              <div className="h-12 bg-secondary rounded"></div>
            </div>
          ) : rules && rules.length > 0 ? (
            <div className="space-y-0">
              {rules.map(rule => (
                <RuleItem key={rule.id} rule={rule} showDelete={true} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              No rules found. Add a new rule to get started.
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Rule Dialog */}
      <Dialog open={isAddRuleOpen} onOpenChange={setIsAddRuleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Rule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rule-description" className="text-right">Description</Label>
              <Input 
                id="rule-description" 
                value={newRule.description}
                onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                className="col-span-3"
                placeholder="Rule description"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rule-type" className="text-right">Type</Label>
              <Select 
                value={newRule.type} 
                onValueChange={(value: 'follow' | 'avoid') => setNewRule({...newRule, type: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="follow">Follow (Do this)</SelectItem>
                  <SelectItem value="avoid">Avoid (Don't do this)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddRuleOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddRule}
              disabled={isPending}
            >
              Add Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Rules;
