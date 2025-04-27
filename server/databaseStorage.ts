import { db } from './db';
import { 
  users, type User, type InsertUser,
  tasks, type Task, type InsertTask,
  skills, type Skill, type InsertSkill,
  rules, type Rule, type InsertRule,
  events, type Event, type InsertEvent
} from "@shared/schema";
import { eq, and } from 'drizzle-orm';
import { IStorage } from './storage';

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserExperience(userId: number, amount: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    let newExperience = user.experience + amount;
    let newLevel = user.level;

    // Check if user should level up
    const requiredExp = user.level * 100;
    if (newExperience >= requiredExp) {
      newLevel += 1;
      newExperience = newExperience - requiredExp;
    }
    
    // If experience goes negative after task unmarking, reset to 0
    if (newExperience < 0) {
      newExperience = 0;
    }
    
    const [updatedUser] = await db
      .update(users)
      .set({ 
        experience: newExperience,
        level: newLevel 
      })
      .where(eq(users.id, userId))
      .returning();

    return updatedUser;
  }

  async updateUserLevel(userId: number, level: number): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ level })
      .where(eq(users.id, userId))
      .returning();

    return updatedUser;
  }

  async updateUserPoints(userId: number, amount: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const points = user.points + amount;
    
    const [updatedUser] = await db
      .update(users)
      .set({ points })
      .where(eq(users.id, userId))
      .returning();

    return updatedUser;
  }

  async updateUserStreak(userId: number, streak: number): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ streak })
      .where(eq(users.id, userId))
      .returning();

    return updatedUser;
  }

  async resetUserProgress(userId: number): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({
        level: 1,
        experience: 0,
        points: 0,
        streak: 0
      })
      .where(eq(users.id, userId))
      .returning();

    return updatedUser;
  }

  // Task operations
  async getTasks(userId: number): Promise<Task[]> {
    return db.select().from(tasks).where(eq(tasks.userId, userId));
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async createTask(task: InsertTask & { userId: number }): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async updateTaskCompletion(id: number, isCompleted: boolean): Promise<Task | undefined> {
    const [updatedTask] = await db
      .update(tasks)
      .set({ isCompleted })
      .where(eq(tasks.id, id))
      .returning();

    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    await db.delete(tasks).where(eq(tasks.id, id));
    return true;
  }

  async resetTaskCompletions(userId: number): Promise<boolean> {
    const result = await db
      .update(tasks)
      .set({ isCompleted: false })
      .where(eq(tasks.userId, userId))
      .returning();
      
    return result.length > 0;
  }

  // Skill operations
  async getSkills(userId: number): Promise<Skill[]> {
    return db.select().from(skills).where(eq(skills.userId, userId));
  }

  async getSkill(id: number): Promise<Skill | undefined> {
    const [skill] = await db.select().from(skills).where(eq(skills.id, id));
    return skill;
  }

  async createSkill(skill: InsertSkill & { userId: number }): Promise<Skill> {
    const [newSkill] = await db.insert(skills).values(skill).returning();
    return newSkill;
  }

  async updateSkillLevel(id: number, level: number, experience: number): Promise<Skill | undefined> {
    const skill = await this.getSkill(id);
    if (!skill) return undefined;
    
    let newExperience = experience;
    let newLevel = level;
    let newMaxExperience = skill.maxExperience;
    
    // Check if skill should level up
    if (newExperience >= skill.maxExperience) {
      newLevel += 1;
      newExperience = newExperience - skill.maxExperience;
      // Increase max experience for next level
      newMaxExperience = Math.floor(skill.maxExperience * 1.2);
    }
    
    const [updatedSkill] = await db
      .update(skills)
      .set({ 
        level: newLevel,
        experience: newExperience,
        maxExperience: newMaxExperience
      })
      .where(eq(skills.id, id))
      .returning();

    return updatedSkill;
  }

  async deleteSkill(id: number): Promise<boolean> {
    await db.delete(skills).where(eq(skills.id, id));
    return true;
  }

  // Rule operations
  async getRules(userId: number): Promise<Rule[]> {
    return db.select().from(rules).where(eq(rules.userId, userId));
  }

  async getRule(id: number): Promise<Rule | undefined> {
    const [rule] = await db.select().from(rules).where(eq(rules.id, id));
    return rule;
  }

  async createRule(rule: InsertRule & { userId: number }): Promise<Rule> {
    const [newRule] = await db.insert(rules).values(rule).returning();
    return newRule;
  }

  async deleteRule(id: number): Promise<boolean> {
    await db.delete(rules).where(eq(rules.id, id));
    return true;
  }

  // Event operations
  async getEvents(userId: number): Promise<Event[]> {
    return db.select().from(events).where(eq(events.userId, userId));
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(event: InsertEvent & { userId: number }): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async deleteEvent(id: number): Promise<boolean> {
    await db.delete(events).where(eq(events.id, id));
    return true;
  }
}