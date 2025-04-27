import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const Exercise: React.FC = () => {
  const exercisePlan = [
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
  ];

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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-6 p-4 bg-secondary rounded-lg border border-gray-800">
            <h3 className="text-lg font-medium mb-2 text-primary">Training Guidelines</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Always warm up for 5-10 minutes before starting your workout</li>
              <li>• Use proper form to avoid injuries</li>
              <li>• Start with lighter weights and increase gradually</li>
              <li>• Aim for 3 sets of 8-12 reps for most exercises</li>
              <li>• Drink water throughout your workout</li>
              <li>• Cool down and stretch after training</li>
              <li>• Rest at least 48 hours before training the same muscle group</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Exercise;