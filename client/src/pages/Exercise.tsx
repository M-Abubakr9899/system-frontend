import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Edit, Check, X, ArrowUp, ArrowDown } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const Exercise: React.FC = () => {
  const [exercisePlan, setExercisePlan] = useState([
    {
      day: "Monday",
      organ: "Chest",
      training: "Push",
      exercises: ["Push-ups", "Bench press", "Chest fly"]
    },
    {
      day: "Tuesday",
      organ: "Back",
      training: "Pull",
      exercises: ["Pull-ups", "Rows", "Lat pulldowns"]
    },
    {
      day: "Wednesday",
      organ: "Legs",
      training: "Lower",
      exercises: ["Squats", "Lunges", "Leg press"]
    },
    {
      day: "Thursday",
      organ: "Shoulders",
      training: "Push",
      exercises: ["Shoulder press", "Lateral raises", "Front raises"]
    },
    {
      day: "Friday",
      organ: "Arms",
      training: "Pull",
      exercises: ["Bicep curls", "Tricep extensions", "Hammer curls"]
    },
    {
      day: "Saturday",
      organ: "Core",
      training: "Abs",
      exercises: ["Crunches", "Planks", "Russian twists"]
    },
    {
      day: "Sunday",
      organ: "Rest",
      training: "Recovery",
      exercises: ["Light walking", "Stretching", "Foam rolling"]
    }
  ]);
  
  // Guidelines
  const [guidelines, setGuidelines] = useState([
    "Always warm up for 5-10 minutes before starting your workout",
    "Use proper form to avoid injuries",
    "Start with lighter weights and increase gradually",
    "Aim for 3 sets of 8-12 reps for most exercises",
    "Drink water throughout your workout",
    "Cool down and stretch after training",
    "Rest at least 48 hours before training the same muscle group"
  ]);
  
  // Editing states
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editItem, setEditItem] = useState({
    day: "",
    organ: "",
    training: "",
    exercises: ""
  });
  
  // Guidelines editing
  const [isEditingGuidelines, setIsEditingGuidelines] = useState(false);
  const [editedGuidelines, setEditedGuidelines] = useState("");
  
  // Edit exercise plan item
  const handleEdit = (index: number) => {
    const item = exercisePlan[index];
    setEditItem({
      day: item.day,
      organ: item.organ,
      training: item.training,
      exercises: item.exercises.join(", ")
    });
    setEditingIndex(index);
  };
  
  // Save exercise plan changes
  const handleSave = () => {
    if (editingIndex === null) return;
    
    const updatedPlan = [...exercisePlan];
    updatedPlan[editingIndex] = {
      ...updatedPlan[editingIndex],
      day: editItem.day,
      organ: editItem.organ,
      training: editItem.training,
      exercises: editItem.exercises.split(",").map(ex => ex.trim())
    };
    
    setExercisePlan(updatedPlan);
    setEditingIndex(null);
  };
  
  // Cancel editing
  const handleCancel = () => {
    setEditingIndex(null);
  };
  
  // Move exercise plan item up
  const moveUp = (index: number) => {
    if (index === 0) return;
    const updatedPlan = [...exercisePlan];
    [updatedPlan[index], updatedPlan[index - 1]] = [updatedPlan[index - 1], updatedPlan[index]];
    setExercisePlan(updatedPlan);
  };
  
  // Move exercise plan item down
  const moveDown = (index: number) => {
    if (index === exercisePlan.length - 1) return;
    const updatedPlan = [...exercisePlan];
    [updatedPlan[index], updatedPlan[index + 1]] = [updatedPlan[index + 1], updatedPlan[index]];
    setExercisePlan(updatedPlan);
  };
  
  // Edit guidelines
  const handleEditGuidelines = () => {
    setEditedGuidelines(guidelines.join("\n"));
    setIsEditingGuidelines(true);
  };
  
  // Save guidelines
  const handleSaveGuidelines = () => {
    const newGuidelines = editedGuidelines
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    setGuidelines(newGuidelines);
    setIsEditingGuidelines(false);
  };

  return (
    <Layout title="Exercise Plan" subtitle="Training Schedule">
      <Card className="bg-card border border-gray-800 hover:border-primary transition-colors duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold flex items-center">
            <Dumbbell className="h-5 w-5 mr-2 text-primary" />
            Weekly Training
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Follow this weekly exercise routine to build strength and endurance. Adjust weights and reps as needed.
          </p>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary hover:bg-secondary">
                  <TableHead className="font-medium">Day</TableHead>
                  <TableHead className="font-medium">Organ</TableHead>
                  <TableHead className="font-medium">Training</TableHead>
                  <TableHead className="font-medium">Exercises</TableHead>
                  <TableHead className="font-medium w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exercisePlan.map((plan, index) => (
                  <TableRow 
                    key={index}
                    className={index % 2 === 0 ? "bg-card" : "bg-secondary/50"}
                  >
                    <TableCell className="font-medium text-primary">
                      {plan.day}
                    </TableCell>
                    <TableCell>{plan.organ}</TableCell>
                    <TableCell>{plan.training}</TableCell>
                    <TableCell>
                      <ul className="list-disc pl-4">
                        {plan.exercises.map((exercise, i) => (
                          <li key={i} className="text-sm">{exercise}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => handleEdit(index)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                        >
                          <ArrowUp size={14} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => moveDown(index)}
                          disabled={index === exercisePlan.length - 1}
                        >
                          <ArrowDown size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-6 p-4 bg-secondary rounded-lg border border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-primary">Training Guidelines</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleEditGuidelines}
                className="h-7 px-2 py-1 text-xs"
              >
                <Edit size={12} className="mr-1" /> Edit
              </Button>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {guidelines.map((guideline, index) => (
                <li key={index}>• {guideline}</li>
              ))}
            </ul>
          </div>

          {/* Edit Dialog for Exercise Plan */}
          <Dialog open={editingIndex !== null} onOpenChange={(open) => !open && setEditingIndex(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Training Day</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="day" className="text-right">Day</Label>
                  <Input 
                    id="day" 
                    value={editItem.day}
                    onChange={(e) => setEditItem({...editItem, day: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="organ" className="text-right">Organ</Label>
                  <Input 
                    id="organ" 
                    value={editItem.organ}
                    onChange={(e) => setEditItem({...editItem, organ: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="training" className="text-right">Training</Label>
                  <Input 
                    id="training" 
                    value={editItem.training}
                    onChange={(e) => setEditItem({...editItem, training: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="exercises" className="text-right">Exercises</Label>
                  <Textarea 
                    id="exercises" 
                    value={editItem.exercises}
                    onChange={(e) => setEditItem({...editItem, exercises: e.target.value})}
                    className="col-span-3"
                    placeholder="Separate exercises with commas"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog for Guidelines */}
          <Dialog open={isEditingGuidelines} onOpenChange={setIsEditingGuidelines}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Training Guidelines</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="guidelines">Guidelines (one per line)</Label>
                  <Textarea 
                    id="guidelines" 
                    value={editedGuidelines}
                    onChange={(e) => setEditedGuidelines(e.target.value)}
                    className="mt-2"
                    rows={8}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditingGuidelines(false)}>Cancel</Button>
                <Button onClick={handleSaveGuidelines}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Exercise;