import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { openaiService } from "./services/openai";
import bcrypt from "bcryptjs";
import { insertUserSchema, insertMoodCheckinSchema, insertAnonymousReportSchema, insertPanicAlertSchema, insertWellnessCaseSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User profile routes
  app.put("/api/users/profile", async (req, res) => {
    try {
      const { id, firstName, lastName, email } = req.body;
      
      // Get the user by ID
      const user = await storage.getUserById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Update user in storage
      await storage.updateUser(id, {
        firstName, 
        lastName,
        email,
        updatedAt: new Date()
      });
      
      // Return updated user
      const updatedUser = await storage.getUserById(id);
      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to retrieve updated user" });
      }
      
      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
  
  // Authentication routes
  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Authentication failed" });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.post("/api/auth/signout", async (req, res) => {
    res.json({ message: "Signed out successfully" });
  });

  // Mood check-in routes
  app.post("/api/mood-checkins", async (req, res) => {
    try {
      const checkinData = insertMoodCheckinSchema.parse(req.body);
      
      // Get AI analysis for the mood entry
      let aiAnalysis = null;
      if (checkinData.journalEntry) {
        try {
          aiAnalysis = await openaiService.analyzeMoodEntry(
            checkinData.journalEntry, 
            checkinData.mood,
            checkinData.energyLevel
          );
        } catch (error) {
          console.error("AI analysis failed:", error);
        }
      }
      
      const checkin = await storage.createMoodCheckin({
        ...checkinData,
        aiAnalysis
      });
      
      // If AI flagged as concerning, create alert for counselors
      if (aiAnalysis?.flagged) {
        await storage.createCounselorAlert({
          studentId: checkinData.userId,
          type: 'concerning_mood',
          priority: aiAnalysis.priority || 'medium',
          message: `Concerning mood pattern detected for student`
        });
      }
      
      res.status(201).json(checkin);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid mood check-in data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create mood check-in" });
    }
  });

  app.get("/api/mood-checkins/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const checkins = await storage.getMoodCheckinsByUser(userId);
      res.json(checkins);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mood check-ins" });
    }
  });

  // Anonymous report routes
  app.post("/api/anonymous-reports", async (req, res) => {
    try {
      const reportData = insertAnonymousReportSchema.parse(req.body);
      
      const report = await storage.createAnonymousReport({
        ...reportData,
        status: reportData.isEmergency ? 'urgent' : 'pending'
      });
      
      // If emergency, assign to available counselor and send alerts
      if (reportData.isEmergency) {
        const availableCounselor = await storage.getAvailableCounselor();
        if (availableCounselor) {
          await storage.updateAnonymousReport(report.id, {
            assignedCounselorId: availableCounselor.id
          });
        }
        
        // Create emergency alert
        await storage.createEmergencyAlert({
          type: 'anonymous_report',
          reportId: report.id,
          priority: 'urgent'
        });
      }
      
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid report data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  app.get("/api/anonymous-reports", async (req, res) => {
    try {
      const reports = await storage.getAnonymousReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  // Panic alert routes
  app.post("/api/panic-alert", async (req, res) => {
    try {
      const alertData = insertPanicAlertSchema.parse(req.body);
      
      const alert = await storage.createPanicAlert(alertData);
      
      // Immediately notify all counselors and administrators
      await storage.createEmergencyAlert({
        type: 'panic_alert',
        alertId: alert.id,
        priority: 'urgent',
        userId: alertData.userId,
        location: alertData.location
      });
      
      // In a real implementation, this would trigger SMS/email notifications
      console.log("EMERGENCY: Panic alert activated", { alertId: alert.id, userId: alertData.userId });
      
      res.status(201).json(alert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid panic alert data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create panic alert" });
    }
  });

  app.get("/api/panic-alerts", async (req, res) => {
    try {
      const alerts = await storage.getPanicAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch panic alerts" });
    }
  });

  // AI Chat routes
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, context } = req.body;
      
      const response = await openaiService.chatWithStudent(message, context);
      
      // Save chat message for logging
      if (req.body.userId) {
        await storage.createChatMessage({
          userId: req.body.userId,
          message: message,
          isAiResponse: false
        });
        
        await storage.createChatMessage({
          userId: req.body.userId,
          message: response.message,
          isAiResponse: true,
          aiContext: response
        });
      }
      
      res.json(response);
    } catch (error) {
      console.error("AI chat error:", error);
      res.status(500).json({ 
        message: "I'm sorry, I'm having trouble connecting right now. If this is urgent, please reach out to a counselor or call the crisis hotline at 988.",
        suggestions: [
          "Tell me more about how you're feeling",
          "What happened today that's bothering you?",
          "Would you like some breathing exercises?"
        ],
        resources: [
          {
            title: "Crisis Text Line",
            url: "sms:741741",
            type: "contact"
          }
        ]
      });
    }
  });

  app.post("/api/ai/analyze-mood", async (req, res) => {
    try {
      const { journalEntry, mood, energyLevel } = req.body;
      
      const analysis = await openaiService.analyzeMoodEntry(journalEntry, mood, energyLevel);
      res.json(analysis);
    } catch (error) {
      console.error("Mood analysis error:", error);
      res.status(500).json({ 
        sentiment: mood === 'very-sad' || mood === 'sad' ? 'negative' : 
                  mood === 'okay' ? 'neutral' : 'positive',
        confidence: 0.5,
        keywords: [],
        concerns: [],
        recommendations: ['Consider speaking with a counselor']
      });
    }
  });

  // Counselor dashboard routes
  app.get("/api/counselor/stats", async (req, res) => {
    try {
      const stats = await storage.getCounselorStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch counselor stats" });
    }
  });

  app.get("/api/counselor/priority-alerts", async (req, res) => {
    try {
      const alerts = await storage.getPriorityAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch priority alerts" });
    }
  });

  app.get("/api/counselor/cases", async (req, res) => {
    try {
      const cases = await storage.getWellnessCases();
      res.json(cases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wellness cases" });
    }
  });

  // Admin dashboard routes
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  app.get("/api/admin/recent-users", async (req, res) => {
    try {
      const users = await storage.getRecentUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent users" });
    }
  });

  app.get("/api/admin/system-health", async (req, res) => {
    try {
      const health = await storage.getSystemHealth();
      res.json(health);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch system health" });
    }
  });

  // Parent dashboard routes
  app.get("/api/parent/children/:parentId", async (req, res) => {
    try {
      const { parentId } = req.params;
      const children = await storage.getChildrenByParent(parentId);
      res.json(children);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch children" });
    }
  });

  app.get("/api/parent/notifications/:parentId", async (req, res) => {
    try {
      const { parentId } = req.params;
      const notifications = await storage.getParentNotifications(parentId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  // File upload route
  app.post("/api/upload", async (req, res) => {
    try {
      // In a real implementation, this would handle file uploads to cloud storage
      // For now, return mock URLs
      const files = req.body.files || [];
      const urls = files.map((_, index) => `https://storage.edu360.com/uploads/file_${Date.now()}_${index}`);
      
      res.json({ urls });
    } catch (error) {
      res.status(500).json({ message: "File upload failed" });
    }
  });

  // Real-time routes (Server-Sent Events)
  app.get("/api/realtime/:channel", (req, res) => {
    const { channel } = req.params;
    
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    
    // Send keep-alive message every 30 seconds
    const keepAlive = setInterval(() => {
      res.write('data: {"type":"keepalive"}\n\n');
    }, 30000);
    
    // Clean up on client disconnect
    req.on('close', () => {
      clearInterval(keepAlive);
    });
    
    // In a real implementation, this would subscribe to database changes
    // and push updates to connected clients
  });

  const httpServer = createServer(app);
  return httpServer;
}
