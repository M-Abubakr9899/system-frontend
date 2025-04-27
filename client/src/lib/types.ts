export interface Task {
  id: number;
  title: string;
  description?: string;
  duration?: string;
  points: number;
  isCompleted: boolean;
  isDefault?: boolean;
  createdAt: string | Date;
}

export interface Skill {
  id: number;
  name: string;
  level: number;
  experience: number;
  maxExperience: number;
}

export interface Rule {
  id: number;
  description: string;
  type: "follow" | "avoid";
  isDefault?: boolean;
}

export interface Event {
  id: number;
  title: string;
  startTime: string | Date;
  endTime: string | Date;
  category: "work" | "study" | "break" | "skills";
  description?: string;
}

export interface User {
  id: number;
  username: string;
  level: number;
  experience: number;
  points: number;
  streak: number;
}

export interface WeekDay {
  name: string;
  date: number;
  percentage: number;
  isToday: boolean;
}
