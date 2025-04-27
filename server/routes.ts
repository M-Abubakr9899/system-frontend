import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertTaskSchema, insertSkillSchema, insertRuleSchema, insertEventSchema } from "@shared/schema";

// Helper function to check if authenticated 
const checkAuth = (req: any, res: any, next: any) => {
  // For this demo we'll use a mock user ID
  req.userId = 1;
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a demo user if it doesn't exist
  const existingUser = await storage.getUserByUsername("demo");
  if (!existingUser) {
    const user = await storage.createUser({
      username: "demo",
      password: "demo123"
    });

    // Create default tasks
    const defaultTasks = [
      { title: "Complete College Work", description: "Focus on assignments and studies", duration: "3 Hours", points: 30, isDefault: true },
      { title: "Learn Arabic, Quran", description: "Study and practice", duration: "1 Hour", points: 15, isDefault: true },
      { title: "Write one Hades Everyday", description: "Daily writing exercise", duration: "", points: 10, isDefault: true },
      { title: "Typing Speed to 50 WPM", description: "Practice typing", duration: "30 Min", points: 10, isDefault: true },
      { title: "Facebook Management Course", description: "Study social media management", duration: "1 Hour", points: 15, isDefault: true },
      { title: "Python", description: "Programming practice", duration: "1 Hour", points: 20, isDefault: true }
    ];

    for (const task of defaultTasks) {
      await storage.createTask({ ...task, userId: user.id });
    }

    // Create default skills
    const defaultSkills = [
      { name: "Intelligence", level: 1, experience: 0, maxExperience: 100 },
      { name: "Stamina", level: 1, experience: 0, maxExperience: 100 },
      { name: "Focus", level: 1, experience: 0, maxExperience: 100 },
      { name: "Discipline", level: 1, experience: 0, maxExperience: 100 }
    ];

    for (const skill of defaultSkills) {
      await storage.createSkill({ ...skill, userId: user.id });
    }

    // Create default rules
    const defaultRules = [
      { description: "Follow Time Table", type: "follow", isDefault: true },
      { description: "No Songs", type: "avoid", isDefault: true },
      { description: "No Animes", type: "avoid", isDefault: true },
      { description: "No Reels", type: "avoid", isDefault: true },
      { description: "Sunnah and Time Sleeping (with Blanket)", type: "follow", isDefault: true },
      { description: "No staying up unnecessarily", type: "avoid", isDefault: true },
      { description: "Reduce the frequency of bad habits", type: "follow", isDefault: true },
      { description: "No Junk or Fast Food", type: "avoid", isDefault: true },
      { description: "Chew food properly", type: "follow", isDefault: true },
      { description: "Less talk, with low voice pitch", type: "follow", isDefault: true }
    ];

    for (const rule of defaultRules) {
      await storage.createRule({ ...rule, userId: user.id });
    }
  }

  // User routes
  app.get("/api/user", checkAuth, async (req: any, res) => {
    const user = await storage.getUser(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Don't send password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  app.post("/api/user/reset", checkAuth, async (req: any, res) => {
    const user = await storage.resetUserProgress(req.userId);
    await storage.resetTaskCompletions(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't send password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // Task routes
  app.get("/api/tasks", checkAuth, async (req: any, res) => {
    const tasks = await storage.getTasks(req.userId);
    res.json(tasks);
  });

  app.post("/api/tasks", checkAuth, async (req: any, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask({ ...taskData, userId: req.userId });
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data", error });
    }
  });

  app.patch("/api/tasks/:id/complete", checkAuth, async (req: any, res) => {
    const taskId = parseInt(req.params.id);
    const isCompleted = z.boolean().parse(req.body.isCompleted);
    
    const task = await storage.getTask(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    if (task.userId !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    const updatedTask = await storage.updateTaskCompletion(taskId, isCompleted);
    
    // If marking as completed, add points to user
    if (isCompleted && !task.isCompleted) {
      await storage.updateUserPoints(req.userId, task.points);
      await storage.updateUserExperience(req.userId, task.points);
      
      // Update skills
      const skills = await storage.getSkills(req.userId);
      if (skills.length > 0) {
        // Update a random skill
        const randomSkill = skills[Math.floor(Math.random() * skills.length)];
        await storage.updateSkillLevel(
          randomSkill.id, 
          randomSkill.level, 
          randomSkill.experience + Math.floor(task.points / 2)
        );
      }
    }
    // If unmarking as completed, remove points from user
    else if (!isCompleted && task.isCompleted) {
      await storage.updateUserPoints(req.userId, -task.points);
      await storage.updateUserExperience(req.userId, -task.points);
    }
    
    res.json(updatedTask);
  });

  app.delete("/api/tasks/:id", checkAuth, async (req: any, res) => {
    const taskId = parseInt(req.params.id);
    
    const task = await storage.getTask(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    if (task.userId !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    const success = await storage.deleteTask(taskId);
    res.json({ success });
  });

  // Skill routes
  app.get("/api/skills", checkAuth, async (req: any, res) => {
    const skills = await storage.getSkills(req.userId);
    res.json(skills);
  });

  app.post("/api/skills", checkAuth, async (req: any, res) => {
    try {
      const skillData = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill({ ...skillData, userId: req.userId });
      res.status(201).json(skill);
    } catch (error) {
      res.status(400).json({ message: "Invalid skill data", error });
    }
  });

  app.patch("/api/skills/:id", checkAuth, async (req: any, res) => {
    const skillId = parseInt(req.params.id);
    const { level, experience } = req.body;
    
    const skill = await storage.getSkill(skillId);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }
    
    if (skill.userId !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    const updatedSkill = await storage.updateSkillLevel(
      skillId, 
      level || skill.level, 
      experience !== undefined ? experience : skill.experience
    );
    
    res.json(updatedSkill);
  });

  app.delete("/api/skills/:id", checkAuth, async (req: any, res) => {
    const skillId = parseInt(req.params.id);
    
    const skill = await storage.getSkill(skillId);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }
    
    if (skill.userId !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    const success = await storage.deleteSkill(skillId);
    res.json({ success });
  });

  // Rule routes
  app.get("/api/rules", checkAuth, async (req: any, res) => {
    const rules = await storage.getRules(req.userId);
    res.json(rules);
  });

  app.post("/api/rules", checkAuth, async (req: any, res) => {
    try {
      const ruleData = insertRuleSchema.parse(req.body);
      const rule = await storage.createRule({ ...ruleData, userId: req.userId });
      res.status(201).json(rule);
    } catch (error) {
      res.status(400).json({ message: "Invalid rule data", error });
    }
  });

  app.delete("/api/rules/:id", checkAuth, async (req: any, res) => {
    const ruleId = parseInt(req.params.id);
    
    const rule = await storage.getRule(ruleId);
    if (!rule) {
      return res.status(404).json({ message: "Rule not found" });
    }
    
    if (rule.userId !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    const success = await storage.deleteRule(ruleId);
    res.json({ success });
  });

  // Event routes
  app.get("/api/events", checkAuth, async (req: any, res) => {
    const events = await storage.getEvents(req.userId);
    res.json(events);
  });

  app.post("/api/events", checkAuth, async (req: any, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent({ ...eventData, userId: req.userId });
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ message: "Invalid event data", error });
    }
  });

  app.delete("/api/events/:id", checkAuth, async (req: any, res) => {
    const eventId = parseInt(req.params.id);
    
    const event = await storage.getEvent(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    if (event.userId !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    const success = await storage.deleteEvent(eventId);
    res.json({ success });
  });

  const httpServer = createServer(app);
  return httpServer;
}
