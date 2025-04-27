import { 
  users, type User, type InsertUser,
  tasks, type Task, type InsertTask,
  skills, type Skill, type InsertSkill,
  rules, type Rule, type InsertRule,
  events, type Event, type InsertEvent
} from "@shared/schema";

// Interface for storage methods
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserExperience(userId: number, amount: number): Promise<User | undefined>;
  updateUserLevel(userId: number, level: number): Promise<User | undefined>;
  updateUserPoints(userId: number, amount: number): Promise<User | undefined>;
  updateUserStreak(userId: number, streak: number): Promise<User | undefined>;
  resetUserProgress(userId: number): Promise<User | undefined>;

  // Task operations
  getTasks(userId: number): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask & { userId: number }): Promise<Task>;
  updateTaskCompletion(id: number, isCompleted: boolean): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  resetTaskCompletions(userId: number): Promise<boolean>;

  // Skill operations
  getSkills(userId: number): Promise<Skill[]>;
  getSkill(id: number): Promise<Skill | undefined>;
  createSkill(skill: InsertSkill & { userId: number }): Promise<Skill>;
  updateSkillLevel(id: number, level: number, experience: number): Promise<Skill | undefined>;
  deleteSkill(id: number): Promise<boolean>;

  // Rule operations
  getRules(userId: number): Promise<Rule[]>;
  getRule(id: number): Promise<Rule | undefined>;
  createRule(rule: InsertRule & { userId: number }): Promise<Rule>;
  deleteRule(id: number): Promise<boolean>;

  // Event operations
  getEvents(userId: number): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent & { userId: number }): Promise<Event>;
  deleteEvent(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tasks: Map<number, Task>;
  private skills: Map<number, Skill>;
  private rules: Map<number, Rule>;
  private events: Map<number, Event>;
  
  private userId: number;
  private taskId: number;
  private skillId: number;
  private ruleId: number;
  private eventId: number;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.skills = new Map();
    this.rules = new Map();
    this.events = new Map();
    
    this.userId = 1;
    this.taskId = 1;
    this.skillId = 1;
    this.ruleId = 1;
    this.eventId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { 
      ...insertUser, 
      id, 
      level: 1, 
      experience: 0,
      points: 0,
      streak: 0
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserExperience(userId: number, amount: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    user.experience += amount;
    this.users.set(userId, user);
    return user;
  }

  async updateUserLevel(userId: number, level: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    user.level = level;
    this.users.set(userId, user);
    return user;
  }

  async updateUserPoints(userId: number, amount: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    user.points += amount;
    this.users.set(userId, user);
    return user;
  }

  async updateUserStreak(userId: number, streak: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    user.streak = streak;
    this.users.set(userId, user);
    return user;
  }

  async resetUserProgress(userId: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    user.level = 1;
    user.experience = 0;
    user.points = 0;
    user.streak = 0;
    
    this.users.set(userId, user);
    return user;
  }

  // Task operations
  async getTasks(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.userId === userId
    );
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(task: InsertTask & { userId: number }): Promise<Task> {
    const id = this.taskId++;
    const newTask: Task = {
      ...task,
      id,
      isCompleted: false,
      createdAt: new Date()
    };
    this.tasks.set(id, newTask);
    return newTask;
  }

  async updateTaskCompletion(id: number, isCompleted: boolean): Promise<Task | undefined> {
    const task = await this.getTask(id);
    if (!task) return undefined;
    
    task.isCompleted = isCompleted;
    this.tasks.set(id, task);
    return task;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async resetTaskCompletions(userId: number): Promise<boolean> {
    const userTasks = await this.getTasks(userId);
    
    userTasks.forEach(task => {
      task.isCompleted = false;
      this.tasks.set(task.id, task);
    });
    
    return true;
  }

  // Skill operations
  async getSkills(userId: number): Promise<Skill[]> {
    return Array.from(this.skills.values()).filter(
      (skill) => skill.userId === userId
    );
  }

  async getSkill(id: number): Promise<Skill | undefined> {
    return this.skills.get(id);
  }

  async createSkill(skill: InsertSkill & { userId: number }): Promise<Skill> {
    const id = this.skillId++;
    const newSkill: Skill = {
      ...skill,
      id
    };
    this.skills.set(id, newSkill);
    return newSkill;
  }

  async updateSkillLevel(id: number, level: number, experience: number): Promise<Skill | undefined> {
    const skill = await this.getSkill(id);
    if (!skill) return undefined;
    
    skill.level = level;
    skill.experience = experience;
    this.skills.set(id, skill);
    return skill;
  }

  async deleteSkill(id: number): Promise<boolean> {
    return this.skills.delete(id);
  }

  // Rule operations
  async getRules(userId: number): Promise<Rule[]> {
    return Array.from(this.rules.values()).filter(
      (rule) => rule.userId === userId
    );
  }

  async getRule(id: number): Promise<Rule | undefined> {
    return this.rules.get(id);
  }

  async createRule(rule: InsertRule & { userId: number }): Promise<Rule> {
    const id = this.ruleId++;
    const newRule: Rule = {
      ...rule,
      id
    };
    this.rules.set(id, newRule);
    return newRule;
  }

  async deleteRule(id: number): Promise<boolean> {
    return this.rules.delete(id);
  }

  // Event operations
  async getEvents(userId: number): Promise<Event[]> {
    return Array.from(this.events.values()).filter(
      (event) => event.userId === userId
    );
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(event: InsertEvent & { userId: number }): Promise<Event> {
    const id = this.eventId++;
    const newEvent: Event = {
      ...event,
      id
    };
    this.events.set(id, newEvent);
    return newEvent;
  }

  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }
}

export const storage = new MemStorage();
