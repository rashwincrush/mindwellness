// Client-side authentication and realtime management
// Database operations are handled server-side via API routes

// Supabase Auth Helper Functions
export interface AuthUser {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

class AuthManager {
  private user: AuthUser | null = null;
  private listeners: ((user: AuthUser | null) => void)[] = [];

  constructor() {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('edu360_user');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
      }
    }
  }

  async signIn(email: string, password: string): Promise<AuthUser> {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Sign in failed');
      }

      const user = await response.json();
      this.user = user;
      if (typeof window !== 'undefined') {
        localStorage.setItem('edu360_user', JSON.stringify(user));
      }
      this.notifyListeners();
      return user;
    } catch (error) {
      throw new Error(`Authentication failed: ${(error as Error).message}`);
    }
  }

  async signUp(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    grade?: string;
    parentId?: string;
  }): Promise<AuthUser> {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Sign up failed');
      }

      const user = await response.json();
      this.user = user;
      if (typeof window !== 'undefined') {
        localStorage.setItem('edu360_user', JSON.stringify(user));
      }
      this.notifyListeners();
      return user;
    } catch (error) {
      throw new Error(`Registration failed: ${(error as Error).message}`);
    }
  }

  async signOut(): Promise<void> {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      this.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('edu360_user');
      }
      this.notifyListeners();
    }
  }

  getUser(): AuthUser | null {
    return this.user;
  }

  updateUserInStorage(updatedUser: AuthUser): void {
    this.user = updatedUser;
    if (typeof window !== 'undefined') {
      localStorage.setItem('edu360_user', JSON.stringify(updatedUser));
    }
    this.notifyListeners();
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.user));
  }
}

export const auth = new AuthManager();

// Real-time subscription manager
class RealtimeManager {
  private subscriptions = new Map<string, EventSource>();

  subscribe(channel: string, callback: (data: any) => void): () => void {
    const eventSource = new EventSource(`/api/realtime/${channel}`);
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        callback(data);
      } catch (error) {
        console.error('Real-time data parse error:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('Real-time connection error:', error);
    };

    this.subscriptions.set(channel, eventSource);

    return () => {
      eventSource.close();
      this.subscriptions.delete(channel);
    };
  }

  unsubscribe(channel: string) {
    const eventSource = this.subscriptions.get(channel);
    if (eventSource) {
      eventSource.close();
      this.subscriptions.delete(channel);
    }
  }

  unsubscribeAll() {
    this.subscriptions.forEach(eventSource => eventSource.close());
    this.subscriptions.clear();
  }
}

export const realtime = new RealtimeManager();
