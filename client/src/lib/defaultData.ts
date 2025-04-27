import { Task, Skill, Rule, Event } from './types';

export const defaultTasks: Omit<Task, 'id' | 'createdAt'>[] = [
  {
    title: "Complete College Work",
    description: "Focus on assignments and studies",
    duration: "3 Hours",
    points: 30,
    isCompleted: false,
    isDefault: true
  },
  {
    title: "Learn Arabic, Quran",
    description: "Study and practice",
    duration: "1 Hour",
    points: 15,
    isCompleted: false,
    isDefault: true
  },
  {
    title: "Write one Hades Everyday",
    description: "Daily writing exercise",
    duration: "",
    points: 10,
    isCompleted: false,
    isDefault: true
  },
  {
    title: "Typing Speed to 50 WPM",
    description: "Practice typing",
    duration: "30 Min",
    points: 10,
    isCompleted: false,
    isDefault: true
  },
  {
    title: "Facebook Management Course",
    description: "Study social media management",
    duration: "1 Hour",
    points: 15,
    isCompleted: false,
    isDefault: true
  },
  {
    title: "Python",
    description: "Programming practice",
    duration: "1 Hour",
    points: 20,
    isCompleted: false,
    isDefault: true
  }
];

export const defaultSkills: Omit<Skill, 'id'>[] = [
  {
    name: "Intelligence",
    level: 8,
    experience: 80,
    maxExperience: 100
  },
  {
    name: "Stamina",
    level: 5,
    experience: 50,
    maxExperience: 100
  },
  {
    name: "Focus",
    level: 6,
    experience: 60,
    maxExperience: 100
  },
  {
    name: "Discipline",
    level: 7,
    experience: 70,
    maxExperience: 100
  }
];

export const defaultRules: Omit<Rule, 'id'>[] = [];

export const getDefaultWeekData = (): { name: string; percentage: number; isToday: boolean }[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().getDay() || 7; // 0 is Sunday, but we want Monday as 1
  
  return days.map((day, index) => ({
    name: day,
    percentage: Math.floor(Math.random() * 100),
    isToday: index + 1 === today
  }));
};

export const getDefaultEvents = (): Omit<Event, 'id'>[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return [
    {
      title: "Morning Routine",
      startTime: new Date(today.getTime() + 6 * 3600000), // 6 AM
      endTime: new Date(today.getTime() + 7 * 3600000), // 7 AM
      category: "work",
      description: "Start the day right"
    },
    {
      title: "College Work",
      startTime: new Date(today.getTime() + 8 * 3600000), // 8 AM
      endTime: new Date(today.getTime() + 11 * 3600000), // 11 AM
      category: "work",
      description: "Focus on assignments"
    },
    {
      title: "Lunch",
      startTime: new Date(today.getTime() + 12 * 3600000), // 12 PM
      endTime: new Date(today.getTime() + 13 * 3600000), // 1 PM
      category: "break",
      description: "Healthy meal time"
    },
    {
      title: "Arabic & Quran",
      startTime: new Date(today.getTime() + 9 * 3600000), // 9 AM
      endTime: new Date(today.getTime() + 10 * 3600000), // 10 AM
      category: "study",
      description: "Daily learning"
    },
    {
      title: "Python Practice",
      startTime: new Date(today.getTime() + 12 * 3600000), // 12 PM
      endTime: new Date(today.getTime() + 13 * 3600000), // 1 PM
      category: "skills",
      description: "Coding practice"
    }
  ];
};
