import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, PlusCircle, Trash, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ScheduleItem {
  time: string;
  activity: string;
  completed: boolean;
  id: number;
}

const TimeTable: React.FC = () => {
  const [events, setEvents] = useState<ScheduleItem[]>([
    { id: 1, time: "4:00", activity: "Wake up", completed: false },
    { id: 2, time: "", activity: "Take Wash", completed: false },
    { id: 3, time: "", activity: "Tahajjud + Amals", completed: false },
    { id: 4, time: "", activity: "Fajar + Amals", completed: false },
    { id: 5, time: "", activity: "Cardio Exercise in Sunlight", completed: false },
    { id: 6, time: "", activity: "Morning Meal", completed: false },
    { id: 7, time: "", activity: "Brush + Go To Collage", completed: false },
    { id: 8, time: "", activity: "Zohar + Amals", completed: false },
    { id: 9, time: "", activity: "Lunch", completed: false },
    { id: 10, time: "3:00", activity: "Qailulah", completed: false },
    { id: 11, time: "", activity: "Collage Work", completed: false },
    { id: 12, time: "", activity: "Asar + Amals", completed: false },
    { id: 13, time: "", activity: "Exercise + Protine Shake", completed: false },
    { id: 14, time: "", activity: "Maghrib + Amals", completed: false },
    { id: 15, time: "", activity: "LP Work (Typing Speed / Arabic Lecture)", completed: false },
    { id: 16, time: "", activity: "Isha + Amals", completed: false },
    { id: 17, time: "", activity: "Lite Dinner", completed: false },
    { id: 18, time: "", activity: "Brush + Sleep", completed: false }
  ]);
  
  // Dialog state for adding new events
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ time: '', activity: '' });
  
  const toggleCompletion = (id: number) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, completed: !event.completed } : event
    ));
  };
  
  const deleteEvent = (id: number) => {
    setEvents(events.filter(event => event.id !== id));
  };
  
  const moveEventUp = (id: number) => {
    const index = events.findIndex(event => event.id === id);
    if (index <= 0) return; // Already at the top
    
    const newEvents = [...events];
    const temp = newEvents[index];
    newEvents[index] = newEvents[index - 1];
    newEvents[index - 1] = temp;
    
    setEvents(newEvents);
  };
  
  const moveEventDown = (id: number) => {
    const index = events.findIndex(event => event.id === id);
    if (index === -1 || index === events.length - 1) return; // Already at the bottom
    
    const newEvents = [...events];
    const temp = newEvents[index];
    newEvents[index] = newEvents[index + 1];
    newEvents[index + 1] = temp;
    
    setEvents(newEvents);
  };
  
  const addEvent = () => {
    if (!newEvent.activity.trim()) return;
    
    const newId = Math.max(0, ...events.map(e => e.id)) + 1;
    
    setEvents([
      ...events,
      {
        id: newId,
        time: newEvent.time,
        activity: newEvent.activity,
        completed: false
      }
    ]);
    
    // Reset form and close dialog
    setNewEvent({ time: '', activity: '' });
    setIsAddEventOpen(false);
  };
  
  return (
    <Layout title="Time Table" subtitle="Daily Schedule">
      <Card className="bg-card border border-gray-800 hover:border-primary transition-colors duration-300">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Daily Schedule
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-2 py-1 bg-secondary text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
              onClick={() => setIsAddEventOpen(true)}
            >
              + Add Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Your optimized daily routine for maximum productivity and discipline.
          </p>
          
          <div className="space-y-1">
            {events.map((item) => (
              <div 
                key={item.id} 
                className={cn(
                  "flex items-center p-3 rounded-lg border border-transparent hover:border-gray-700 transition-colors mb-3",
                  item.completed 
                    ? "bg-secondary/50 opacity-70" 
                    : "bg-secondary"
                )}
              >
                <div className="w-10 text-primary font-medium text-sm mr-3">
                  {item.time}
                </div>
                <div 
                  className={cn(
                    "flex-1 relative",
                    item.completed && "text-muted-foreground"
                  )}
                  onClick={() => toggleCompletion(item.id)}
                >
                  {item.completed && (
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-500 transform -translate-y-1/2"></div>
                  )}
                  {item.activity}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className={cn(
                      "w-5 h-5 rounded-full flex-shrink-0 transition-colors",
                      item.completed 
                        ? "bg-primary/70" 
                        : "border-2 border-primary hover:bg-primary/20"
                    )}
                    onClick={() => toggleCompletion(item.id)}
                  />
                  
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-muted-foreground hover:text-primary"
                      onClick={() => moveEventUp(item.id)}
                      disabled={events.indexOf(item) === 0}
                    >
                      <ArrowUp size={12} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-muted-foreground hover:text-primary"
                      onClick={() => moveEventDown(item.id)}
                      disabled={events.indexOf(item) === events.length - 1}
                    >
                      <ArrowDown size={12} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteEvent(item.id)}
                    >
                      <Trash size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-time" className="text-right">Time</Label>
              <Input 
                id="event-time" 
                value={newEvent.time}
                onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                className="col-span-3"
                placeholder="e.g. 4:00"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-activity" className="text-right">Activity</Label>
              <Input 
                id="event-activity" 
                value={newEvent.activity}
                onChange={(e) => setNewEvent({...newEvent, activity: e.target.value})}
                className="col-span-3"
                placeholder="Activity description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddEventOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={addEvent}>
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default TimeTable;
