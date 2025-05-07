import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { createUserSchema, createPetSchema, createCourseSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // ===== Auth Routes =====
  
  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, we'd properly hash and compare the password
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set user in session (removing password field)
      const { password: _, ...userWithoutPassword } = user;
      req.session.user = userWithoutPassword;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });
  
  // Get current user info
  app.get("/api/auth/me", (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    return res.status(200).json(req.session.user);
  });
  
  // Register new user
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = createUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already taken" });
      }

      // 기관 코드가 제공된 경우 검증
      if (userData.instituteCode) {
        const institute = await storage.getInstituteByCode(userData.instituteCode);
        if (!institute) {
          return res.status(400).json({ message: "Invalid institute code" });
        }
        userData.role = 'trainer';
        userData.instituteId = institute.id;
      }
      
      const newUser = await storage.createUser(userData);
      
      // Don't return the password
      const { password: _, ...userWithoutPassword } = newUser;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ===== User Routes =====
  
  // Get user profile
  app.get("/api/users/:id", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return the password
      const { password: _, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ===== Pet Routes =====
  
  // Get user's pets
  app.get("/api/pets", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = req.session.user.id;
      const pets = await storage.getPetsByUserId(userId);
      
      return res.status(200).json(pets);
    } catch (error) {
      console.error("Get pets error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get specific pet
  app.get("/api/pets/:id", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const petId = parseInt(req.params.id);
      const pet = await storage.getPet(petId);
      
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }
      
      // Check if pet belongs to the logged-in user
      if (pet.userId !== req.session.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      return res.status(200).json(pet);
    } catch (error) {
      console.error("Get pet error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Create new pet
  app.post("/api/pets", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const petData = createPetSchema.parse(req.body);
      
      // Assign the current user as the pet owner
      petData.userId = req.session.user.id;
      
      const newPet = await storage.createPet(petData);
      return res.status(201).json(newPet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      
      console.error("Create pet error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ===== Course Routes =====
  
  // Get all courses
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      return res.status(200).json(courses);
    } catch (error) {
      console.error("Get courses error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get course by ID
  app.get("/api/courses/:id", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      return res.status(200).json(course);
    } catch (error) {
      console.error("Get course error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get user's enrolled courses
  app.get("/api/user/courses", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = req.session.user.id;
      const courses = await storage.getCoursesByUserId(userId);
      
      return res.status(200).json(courses);
    } catch (error) {
      console.error("Get user courses error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Enroll in a course
  app.post("/api/courses/:id/enroll", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const courseId = parseInt(req.params.id);
      const userId = req.session.user.id;
      
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      const enrollment = await storage.enrollUserInCourse(userId, courseId);
      return res.status(201).json(enrollment);
    } catch (error) {
      console.error("Enroll in course error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Create new course (for trainers)
  app.post("/api/courses", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Check if user is a trainer
      if (req.session.user.role !== "trainer" && req.session.user.role !== "institute-admin" && req.session.user.role !== "admin") {
        return res.status(403).json({ message: "Only trainers can create courses" });
      }
      
      const courseData = createCourseSchema.parse(req.body);
      
      // Set the trainer ID as the current user
      courseData.trainerId = req.session.user.id;
      
      const newCourse = await storage.createCourse(courseData);
      return res.status(201).json(newCourse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      
      console.error("Create course error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ===== Trainer Routes =====
  
  // Get all trainers
  app.get("/api/trainers", async (req, res) => {
    try {
      const trainers = await storage.getAllTrainers();
      return res.status(200).json(trainers);
    } catch (error) {
      console.error("Get trainers error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get trainer by ID
  app.get("/api/trainers/:id", async (req, res) => {
    try {
      const trainerId = parseInt(req.params.id);
      const trainer = await storage.getTrainer(trainerId);
      
      if (!trainer) {
        return res.status(404).json({ message: "Trainer not found" });
      }
      
      return res.status(200).json(trainer);
    } catch (error) {
      console.error("Get trainer error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // ===== User Management Routes =====
  
  // Upgrade user to pet owner
  app.post("/api/users/:id/upgrade-to-pet-owner", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Check if user is institute admin
      if (req.session.user.role !== "institute-admin") {
        return res.status(403).json({ message: "Only institute admins can upgrade users" });
      }
      
      const userId = parseInt(req.params.id);
      const { trainerId } = req.body;
      
      // Validate trainer belongs to institute
      const trainer = await storage.getTrainer(trainerId);
      if (!trainer || trainer.instituteId !== req.session.user.instituteId) {
        return res.status(400).json({ message: "Invalid trainer" });
      }
      
      // Upgrade user
      const updatedUser = await storage.updateUserRole(userId, 'pet-owner', trainerId);
      
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Upgrade user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // ===== Institute Routes =====
  
  // Get all institutes
  app.get("/api/institutes", async (req, res) => {
    try {
      const institutes = await storage.getAllInstitutes();
      return res.status(200).json(institutes);
    } catch (error) {
      console.error("Get institutes error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get institute by ID
  app.get("/api/institutes/:id", async (req, res) => {
    try {
      const instituteId = parseInt(req.params.id);
      const institute = await storage.getInstitute(instituteId);
      
      if (!institute) {
        return res.status(404).json({ message: "Institute not found" });
      }
      
      return res.status(200).json(institute);
    } catch (error) {
      console.error("Get institute error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
