import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getDefaultEvents } from '@/lib/defaultData';
import { format } from 'date-fns';

const TimeTable: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    startTime: format(new Date().setHours(9, 0, 0), "yyyy-MM-dd'T'HH:mm"),
    endTime: format(new Date().setHours(10, 0, 0), "yyyy-MM-dd'T'HH:mm"),
    category: 'work',
    description: ''
  });
  
  // Mock events data
  const events = getDefaultEvents();
  
  // Set up hour ranges for visualization
  const hours = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM to 9 PM
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work': return 'border-primary';
      case 'break': return 'border-[#FFD700]';
      case 'study': return 'border-[#1E90FF]';
      case 'skills': return 'border-[#32CD32]';
      default: return 'border-primary';
    }
  };
  
  const formatDateDisplay = (date: Date) => {
    return format(date, "EEEE, MMMM d");
  };
  
  const handlePrevDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    setDate(newDate);
  };
  
  const handleNextDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    setDate(newDate);
  };
  
  const handleToday = () => {
    setDate(new Date());
  };
  
  const handleAddEvent = () => {
    console.log('Adding event:', newEvent);
    setIsAddEventOpen(false);
    // This would normally submit to the API
  };
  
  return (
    <Layout title="Time Table" subtitle="Daily Schedule">
      <Card className="bg-card border border-gray-800 hover:border-primary transition-colors duration-300">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-2">
              <Button 
                variant={date.toDateString() === new Date().toDateString() ? "default" : "outline"}
                onClick={handleToday}
              >
                Today
              </Button>
              <Button variant="outline" onClick={() => {}}>Tomorrow</Button>
              <Button variant="outline" onClick={() => {}}>Week</Button>
            </div>
            
            <div className="flex space-x-2 items-center">
              <Button variant="ghost" size="icon" onClick={handlePrevDay}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <span className="text-sm font-medium">{formatDateDisplay(date)}</span>
              <Button variant="ghost" size="icon" onClick={handleNextDay}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="relative min-h-[400px]">
            {/* Time indicators */}
            <div className="absolute top-0 left-0 bottom-0 w-16 border-r border-gray-800 flex flex-col">
              {hours.map(hour => (
                <div 
                  key={hour} 
                  className="flex-1 text-xs text-muted-foreground p-1 text-right pr-2 border-b border-gray-800"
                >
                  {hour % 12 || 12}:00 {hour < 12 ? 'AM' : 'PM'}
                </div>
              ))}
            </div>
            
            {/* Schedule content */}
            <div className="ml-16 relative">
              {/* Current time indicator */}
              <div className="absolute top-[30%] left-0 right-0 flex items-center z-10">
                <div className="w-2 h-2 rounded-full bg-primary glow-subtle"></div>
                <div className="h-px flex-1 bg-primary"></div>
                <div className="px-2 py-1 bg-primary text-xs text-white rounded">
                  {format(new Date(), "h:mm a")}
                </div>
              </div>
              
              {/* Schedule items */}
              <div className="absolute top-[5%] left-[2%] w-[30%] h-[20%] bg-secondary border-l-4 border-primary rounded p-2">
                <h4 className="text-sm font-medium">Morning Routine</h4>
                <p className="text-xs text-muted-foreground">6:00 AM - 7:00 AM</p>
              </div>
              
              <div className="absolute top-[28%] left-[2%] w-[40%] h-[22%] bg-secondary border-l-4 border-primary rounded p-2">
                <h4 className="text-sm font-medium">College Work</h4>
                <p className="text-xs text-muted-foreground">8:00 AM - 11:00 AM</p>
              </div>
              
              <div className="absolute top-[52%] left-[2%] w-[25%] h-[15%] bg-secondary border-l-4 border-[#FFD700] rounded p-2">
                <h4 className="text-sm font-medium">Lunch</h4>
                <p className="text-xs text-muted-foreground">12:00 PM - 1:00 PM</p>
              </div>
              
              <div className="absolute top-[28%] left-[50%] w-[30%] h-[18%] bg-secondary border-l-4 border-[#1E90FF] rounded p-2">
                <h4 className="text-sm font-medium">Arabic & Quran</h4>
                <p className="text-xs text-muted-foreground">9:00 AM - 10:00 AM</p>
              </div>
              
              <div className="absolute top-[50%] left-[50%] w-[35%] h-[25%] bg-secondary border-l-4 border-[#32CD32] rounded p-2">
                <h4 className="text-sm font-medium">Python Practice</h4>
                <p className="text-xs text-muted-foreground">12:00 PM - 1:00 PM</p>
              </div>
            </div>
          </div>
          
          <div className="flex mt-8 justify-between">
            <Button 
              variant="outline"
              className="px-4 py-2 bg-secondary text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
              onClick={() => setIsAddEventOpen(true)}
            >
              + Add Event
            </Button>
            
            <div className="flex space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                <span className="text-xs text-muted-foreground">Work</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#FFD700] mr-2"></div>
                <span className="text-xs text-muted-foreground">Break</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#1E90FF] mr-2"></div>
                <span className="text-xs text-muted-foreground">Study</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#32CD32] mr-2"></div>
                <span className="text-xs text-muted-foreground">Skills</span>
              </div>
            </div>
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
              <Label htmlFor="event-title" className="text-right">Title</Label>
              <Input 
                id="event-title" 
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                className="col-span-3"
                placeholder="Event title"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-start" className="text-right">Start Time</Label>
              <Input 
                id="event-start" 
                type="datetime-local"
                value={newEvent.startTime}
                onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-end" className="text-right">End Time</Label>
              <Input 
                id="event-end" 
                type="datetime-local"
                value={newEvent.endTime}
                onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-category" className="text-right">Category</Label>
              <Select 
                value={newEvent.category} 
                onValueChange={(value) => setNewEvent({...newEvent, category: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="break">Break</SelectItem>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="skills">Skills</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-description" className="text-right">Description</Label>
              <Textarea 
                id="event-description" 
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                className="col-span-3"
                placeholder="Optional description"
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
            <Button onClick={handleAddEvent}>
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default TimeTable;
