import { 
  users, 
  moodCheckins, 
  anonymousReports, 
  panicAlerts, 
  wellnessCases, 
  counselorNotes, 
  chatMessages, 
  parentNotifications,
  type User, 
  type InsertUser, 
  type MoodCheckin, 
  type InsertMoodCheckin,
  type AnonymousReport,
  type InsertAnonymousReport,
  type PanicAlert,
  type InsertPanicAlert,
  type WellnessCase,
  type InsertWellnessCase,
  type CounselorNote,
  type InsertCounselorNote,
  type ChatMessage,
  type InsertChatMessage
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getRecentUsers(limit?: number): Promise<User[]>;
  getChildrenByParent(parentId: string): Promise<User[]>;
  
  // Mood check-in operations
  createMoodCheckin(checkin: InsertMoodCheckin & { aiAnalysis?: any }): Promise<MoodCheckin>;
  getMoodCheckinsByUser(userId: string): Promise<MoodCheckin[]>;
  
  // Anonymous report operations
  createAnonymousReport(report: InsertAnonymousReport): Promise<AnonymousReport>;
  getAnonymousReports(): Promise<AnonymousReport[]>;
  updateAnonymousReport(id: string, data: Partial<AnonymousReport>): Promise<void>;
  
  // Panic alert operations
  createPanicAlert(alert: InsertPanicAlert): Promise<PanicAlert>;
  getPanicAlerts(): Promise<PanicAlert[]>;
  
  // Wellness case operations
  createWellnessCase(case_: InsertWellnessCase): Promise<WellnessCase>;
  getWellnessCases(): Promise<WellnessCase[]>;
  
  // Chat message operations
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessagesByUser(userId: string): Promise<ChatMessage[]>;
  
  // Counselor operations
  getAvailableCounselor(): Promise<User | undefined>;
  getCounselorStats(): Promise<any>;
  getPriorityAlerts(): Promise<any[]>;
  createCounselorAlert(alert: any): Promise<void>;
  
  // Admin operations
  getAdminStats(): Promise<any>;
  getSystemHealth(): Promise<any>;
  
  // Parent operations
  getParentNotifications(parentId: string): Promise<any[]>;
  
  // Emergency operations
  createEmergencyAlert(alert: any): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private moodCheckins: Map<string, MoodCheckin>;
  private anonymousReports: Map<string, AnonymousReport>;
  private panicAlerts: Map<string, PanicAlert>;
  private wellnessCases: Map<string, WellnessCase>;
  private counselorNotes: Map<string, CounselorNote>;
  private chatMessages: Map<string, ChatMessage>;
  private parentNotifications: Map<string, any>;
  private emergencyAlerts: Map<string, any>;
  private counselorAlerts: Map<string, any>;

  constructor() {
    this.users = new Map();
    this.moodCheckins = new Map();
    this.anonymousReports = new Map();
    this.panicAlerts = new Map();
    this.wellnessCases = new Map();
    this.counselorNotes = new Map();
    this.chatMessages = new Map();
    this.parentNotifications = new Map();
    this.emergencyAlerts = new Map();
    this.counselorAlerts = new Map();
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample admin user
    const adminId = this.generateId();
    const sampleAdmin: User = {
      id: adminId,
      email: "admin@edu360.com",
      password: "$2b$12$McHbLvYY6xKmPUWIhdMjUub0nFI.C5GknQ85ipZXW11aWtp5ALp.i", // hashed "password123"
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      grade: null,
      parentId: null
    };
    this.users.set(adminId, sampleAdmin);
    
    // Create sample counselor
    const counselorId = this.generateId();
    const sampleCounselor: User = {
      id: counselorId,
      email: "counselor@edu360.com",
      password: "$2b$12$McHbLvYY6xKmPUWIhdMjUub0nFI.C5GknQ85ipZXW11aWtp5ALp.i",
      firstName: "Dr. Emily",
      lastName: "Chen",
      role: "counselor",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      grade: null,
      parentId: null
    };
    this.users.set(counselorId, sampleCounselor);

    // Create sample parent
    const parentId = this.generateId();
    const sampleParent: User = {
      id: parentId,
      email: "parent@edu360.com",
      password: "$2b$12$McHbLvYY6xKmPUWIhdMjUub0nFI.C5GknQ85ipZXW11aWtp5ALp.i",
      firstName: "Sarah",
      lastName: "Johnson",
      role: "parent",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      grade: null,
      parentId: null
    };
    this.users.set(parentId, sampleParent);

    // Create sample student (child of parent)
    const studentId = this.generateId();
    const sampleStudent: User = {
      id: studentId,
      email: "student@edu360.com",
      password: "$2b$12$McHbLvYY6xKmPUWIhdMjUub0nFI.C5GknQ85ipZXW11aWtp5ALp.i",
      firstName: "Alex",
      lastName: "Johnson",
      role: "student",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      grade: "Grade 9",
      parentId: parentId
    };
    this.users.set(studentId, sampleStudent);

    // Create sample teacher
    const teacherId = this.generateId();
    const sampleTeacher: User = {
      id: teacherId,
      email: "teacher@edu360.com",
      password: "$2b$12$McHbLvYY6xKmPUWIhdMjUub0nFI.C5GknQ85ipZXW11aWtp5ALp.i",
      firstName: "Mr. David",
      lastName: "Rodriguez",
      role: "teacher",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      grade: null,
      parentId: null
    };
    this.users.set(teacherId, sampleTeacher);

    // Add sample mood checkins
    const mood1Id = this.generateId();
    this.moodCheckins.set(mood1Id, {
      id: mood1Id,
      userId: studentId,
      mood: 'okay',
      energyLevel: 3,
      journalEntry: 'Had a tough day with math class but feeling better now.',
      aiAnalysis: { sentiment: 'neutral', keywords: ['math', 'tough'], flagged: false },
      isPrivate: false,
      createdAt: new Date()
    });

    const mood2Id = this.generateId();
    this.moodCheckins.set(mood2Id, {
      id: mood2Id,
      userId: studentId,
      mood: 'sad',
      energyLevel: 2,
      journalEntry: 'Feeling overwhelmed with homework and social pressure.',
      aiAnalysis: { sentiment: 'negative', keywords: ['overwhelmed', 'pressure'], flagged: true },
      isPrivate: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
    });

    // Add sample anonymous report
    const reportId = this.generateId();
    this.anonymousReports.set(reportId, {
      id: reportId,
      reportType: 'bullying',
      description: 'Student being harassed in hallways during lunch break.',
      isEmergency: false,
      attachments: null,
      location: 'Main hallway near cafeteria',
      status: 'pending',
      assignedCounselorId: counselorId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Add sample wellness case
    const caseId = this.generateId();
    this.wellnessCases.set(caseId, {
      id: caseId,
      studentId: studentId,
      counselorId: counselorId,
      title: 'Academic Stress Management',
      description: 'Student showing signs of academic burnout and social anxiety.',
      priority: 'medium',
      status: 'open',
      lastContact: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      updatedAt: new Date()
    });

    // Add sample counselor note
    const noteId = this.generateId();
    this.counselorNotes.set(noteId, {
      id: noteId,
      caseId: caseId,
      counselorId: counselorId,
      note: 'Initial consultation completed. Student is responsive to CBT techniques. Scheduled follow-up for next week.',
      isPrivate: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    });

    // Add sample parent notification
    const notificationId = this.generateId();
    this.parentNotifications.set(notificationId, {
      id: notificationId,
      parentId: parentId,
      studentId: studentId,
      type: 'mood_alert',
      title: 'Mood Check-in Alert',
      message: 'Your child Alex has been experiencing some academic stress. The school counselor has reached out for support.',
      read: false,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
    });

    console.log('Sample data initialized with multiple user roles and test data');
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.generateId();
    const user: User = {
      id,
      email: insertUser.email,
      password: insertUser.password,
      firstName: insertUser.firstName,
      lastName: insertUser.lastName,
      role: insertUser.role,
      grade: insertUser.grade || null,
      parentId: insertUser.parentId || null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getRecentUsers(limit: number = 10): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async getChildrenByParent(parentId: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.parentId === parentId);
  }

  async createMoodCheckin(checkinData: InsertMoodCheckin & { aiAnalysis?: any }): Promise<MoodCheckin> {
    const id = this.generateId();
    const checkin: MoodCheckin = {
      id,
      userId: checkinData.userId,
      mood: checkinData.mood,
      energyLevel: checkinData.energyLevel,
      journalEntry: checkinData.journalEntry || null,
      aiAnalysis: checkinData.aiAnalysis || null,
      isPrivate: checkinData.isPrivate || false,
      createdAt: new Date()
    };
    this.moodCheckins.set(id, checkin);
    return checkin;
  }

  async getMoodCheckinsByUser(userId: string): Promise<MoodCheckin[]> {
    return Array.from(this.moodCheckins.values())
      .filter(checkin => checkin.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createAnonymousReport(reportData: InsertAnonymousReport): Promise<AnonymousReport> {
    const id = this.generateId();
    const report: AnonymousReport = {
      id,
      reportType: reportData.reportType,
      description: reportData.description,
      isEmergency: reportData.isEmergency || false,
      attachments: reportData.attachments || null,
      location: reportData.location || null,
      status: reportData.isEmergency ? 'urgent' : 'pending',
      assignedCounselorId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.anonymousReports.set(id, report);
    return report;
  }

  async getAnonymousReports(): Promise<AnonymousReport[]> {
    return Array.from(this.anonymousReports.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async updateAnonymousReport(id: string, data: Partial<AnonymousReport>): Promise<void> {
    const report = this.anonymousReports.get(id);
    if (report) {
      const updated = { ...report, ...data, updatedAt: new Date() };
      this.anonymousReports.set(id, updated);
    }
  }

  async createPanicAlert(alertData: InsertPanicAlert): Promise<PanicAlert> {
    const id = this.generateId();
    const alert: PanicAlert = {
      id,
      userId: alertData.userId,
      location: alertData.location || null,
      resolved: false,
      resolvedBy: null,
      resolvedAt: null,
      createdAt: new Date()
    };
    this.panicAlerts.set(id, alert);
    return alert;
  }

  async getPanicAlerts(): Promise<PanicAlert[]> {
    return Array.from(this.panicAlerts.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createWellnessCase(caseData: InsertWellnessCase): Promise<WellnessCase> {
    const id = this.generateId();
    const case_: WellnessCase = {
      id,
      studentId: caseData.studentId,
      counselorId: caseData.counselorId,
      title: caseData.title,
      description: caseData.description || null,
      priority: caseData.priority || 'medium',
      status: caseData.status || 'open',
      lastContact: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.wellnessCases.set(id, case_);
    return case_;
  }

  async getWellnessCases(): Promise<WellnessCase[]> {
    return Array.from(this.wellnessCases.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createChatMessage(messageData: InsertChatMessage): Promise<ChatMessage> {
    const id = this.generateId();
    const message: ChatMessage = {
      id,
      userId: messageData.userId,
      message: messageData.message,
      isAiResponse: false,
      aiContext: null,
      createdAt: new Date()
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getChatMessagesByUser(userId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.userId === userId)
      .sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));
  }

  async getAvailableCounselor(): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.role === 'counselor' && user.isActive);
  }

  async getCounselorStats(): Promise<any> {
    const activeCases = this.wellnessCases.size;
    const newReports = Array.from(this.anonymousReports.values()).filter(r => r.status === 'pending').length;
    const atRisk = Math.floor(activeCases * 0.6); // Mock calculation
    const wellnessScore = 78; // Mock score
    
    return {
      activeCases,
      newReports,
      atRisk,
      wellnessScore
    };
  }

  async getPriorityAlerts(): Promise<any[]> {
    return Array.from(this.counselorAlerts.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createCounselorAlert(alert: any): Promise<void> {
    const id = this.generateId();
    this.counselorAlerts.set(id, {
      ...alert,
      id,
      createdAt: new Date()
    });
  }

  async getAdminStats(): Promise<any> {
    const totalUsers = this.users.size;
    const studentCount = Array.from(this.users.values()).filter(u => u.role === 'student').length;
    const teacherCount = Array.from(this.users.values()).filter(u => u.role === 'teacher').length;
    const parentCount = Array.from(this.users.values()).filter(u => u.role === 'parent').length;
    const counselorCount = Array.from(this.users.values()).filter(u => u.role === 'counselor').length;
    const dailyCheckins = this.moodCheckins.size;
    const activeReports = Array.from(this.anonymousReports.values()).filter(r => r.status !== 'closed').length;
    const emergencyAlerts = this.panicAlerts.size;
    
    return {
      totalUsers,
      studentCount,
      teacherCount,
      parentCount,
      counselorCount,
      dailyCheckins,
      activeReports,
      emergencyAlerts
    };
  }

  async getSystemHealth(): Promise<any> {
    return {
      uptime: '99.2%',
      database: 'healthy',
      api: 'online',
      ai: 'active',
      notifications: 'delayed'
    };
  }

  async getParentNotifications(parentId: string): Promise<any[]> {
    return Array.from(this.parentNotifications.values())
      .filter(notification => notification.parentId === parentId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createEmergencyAlert(alert: any): Promise<void> {
    const id = this.generateId();
    this.emergencyAlerts.set(id, {
      ...alert,
      id,
      createdAt: new Date()
    });
    
    // In a real implementation, this would trigger external notifications
    console.log("EMERGENCY ALERT CREATED:", alert);
  }
}

export const storage = new MemStorage();
