import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle } from 'lucide-react';

const TimeTable: React.FC = () => {
  // Daily schedule items based on user's request
  const dailySchedule = [
    { time: "4:00", activity: "Wake up" },
    { time: "", activity: "Take Wash" },
    { time: "", activity: "Tahajjud + Amals" },
    { time: "", activity: "Fajar + Amals" },
    { time: "", activity: "Cardio Exercise in Sunlight" },
    { time: "", activity: "Morning Meal" },
    { time: "", activity: "Brush + Go To Collage" },
    { time: "", activity: "Zohar + Amals" },
    { time: "", activity: "Lunch" },
    { time: "3:00", activity: "Qailulah" },
    { time: "", activity: "Collage Work" },
    { time: "", activity: "Asar + Amals" },
    { time: "", activity: "Exercise + Protine Shake" },
    { time: "", activity: "Maghrib + Amals" },
    { time: "", activity: "LP Work (Typing Speed / Arabic Lecture)" },
    { time: "", activity: "Isha + Amals" },
    { time: "", activity: "Lite Dinner" },
    { time: "", activity: "Brush + Sleep" }
  ];
  
  return (
    <Layout title="Time Table" subtitle="Daily Schedule">
      <Card className="bg-card border border-gray-800 hover:border-primary transition-colors duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold flex items-center">
            <Clock className="h-5 w-5 mr-2 text-primary" />
            Daily Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Your optimized daily routine for maximum productivity and discipline.
          </p>
          
          <div className="space-y-1">
            {dailySchedule.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center p-3 bg-secondary rounded-lg border border-transparent hover:border-gray-700 transition-colors mb-3"
              >
                <div className="w-10 text-primary font-medium text-sm mr-3">
                  {item.time && item.time}
                </div>
                <div className="flex-1">
                  {item.activity}
                </div>
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-primary/70" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default TimeTable;
