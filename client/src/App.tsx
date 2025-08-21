import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { RealtimeProvider } from "@/contexts/RealtimeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import StudentDashboard from "@/pages/StudentDashboard";
import CounselorDashboard from "@/pages/CounselorDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import ParentDashboard from "@/pages/ParentDashboard";
import AIChatPage from "@/pages/AIChat";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";
import { MoodCheckin } from "@/components/MoodCheckin";
import { AnonymousReport } from "@/components/AnonymousReport";
import { AIChat } from "@/components/AIChat";

function AppRoutes() {
  const { user, loading } = useAuth();
  const [location] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/signin" component={() => <Login initialTab="signin" />} />
        <Route path="/signup" component={() => <Login initialTab="signup" />} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={() => <DashboardRouter user={user} path={location} />} />
        <Route path="/dashboard" component={() => <DashboardRouter user={user} path="/dashboard" />} />
        <Route path="/mood-checkin" component={() => <RouteContent user={user} path="/mood-checkin" />} />
        <Route path="/reports" component={() => <RouteContent user={user} path="/reports" />} />
        <Route path="/ai-chat" component={AIChatPage} />
        <Route path="/cases" component={() => <RouteContent user={user} path="/cases" />} />
        <Route path="/users" component={() => <RouteContent user={user} path="/users" />} />
        <Route path="/analytics" component={() => <RouteContent user={user} path="/analytics" />} />
        <Route path="/settings" component={() => <RouteContent user={user} path="/settings" />} />
        <Route path="/child-reports" component={() => <RouteContent user={user} path="/child-reports" />} />
        <Route path="/notifications" component={() => <RouteContent user={user} path="/notifications" />} />
        <Route path="/mood-insights" component={() => <RouteContent user={user} path="/mood-insights" />} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function DashboardRouter({ user, path }: { user: any; path: string }) {
  // Dashboard route is common for all roles, so we render the appropriate dashboard by role
  switch (user.role) {
    case 'student':
    case 'teacher':
      return <StudentDashboard />;
    case 'counselor':
      return <CounselorDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'parent':
      return <ParentDashboard />;
    default:
      return <StudentDashboard />;
  }
}

function RouteContent({ user, path }: { user: any; path: string }) {
  // For non-dashboard routes, render the appropriate content based on path and role
  
  // First, check if the user has access to this path based on their role
  const studentTeacherRoutes = ['/mood-checkin', '/reports', '/ai-chat'];
  const counselorRoutes = ['/cases', '/reports', '/mood-insights'];
  const adminRoutes = ['/users', '/analytics', '/reports', '/settings'];
  const parentRoutes = ['/child-reports', '/notifications'];
  
  let hasAccess = false;
  
  switch(user.role) {
    case 'student':
    case 'teacher':
      hasAccess = studentTeacherRoutes.includes(path);
      break;
    case 'counselor':
      hasAccess = counselorRoutes.includes(path);
      break;
    case 'admin':
      hasAccess = adminRoutes.includes(path);
      break;
    case 'parent':
      hasAccess = parentRoutes.includes(path);
      break;
  }
  
  if (!hasAccess) {
    // If user doesn't have access to this path, redirect to their dashboard
    return <DashboardRouter user={user} path="/dashboard" />;
  }

  // Admin-specific routing: map routes to AdminDashboard tabs
  if (user.role === 'admin') {
    if (path === '/users') return <AdminDashboard initialTab="users" />;
    if (path === '/analytics') return <AdminDashboard initialTab="analytics" />;
    if (path === '/settings') return <AdminDashboard initialTab="system" />;
  }

  // Render the appropriate content based on the path
  switch(path) {
    case '/mood-checkin':
      return (
        <div className="animate-fade-in">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Mood Check-In</h2>
            <p className="text-gray-600">Share how you're feeling today to track your wellness journey.</p>
          </div>
          <div className="max-w-xl mx-auto">
            <MoodCheckin />
          </div>
        </div>
      );
    case '/reports':
      return (
        <div className="animate-fade-in">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Anonymous Reporting</h2>
            <p className="text-gray-600">Safely report concerns to help keep our community secure.</p>
          </div>
          <div className="max-w-xl mx-auto">
            <AnonymousReport />
          </div>
        </div>
      );
    // We no longer need this case as we're using the standalone AIChatPage component for this route
    case '/ai-chat':
      return <AIChatPage />;
    // Add other route-specific content for counselor, admin, and parent routes
    case '/cases':
    case '/mood-insights':
    case '/users':
    case '/analytics':
    case '/settings':
    case '/child-reports':
    case '/notifications':
      // For these routes, we'd ideally have specific components to render
      // For now, we'll show a simple placeholder
      return (
        <div className="animate-fade-in">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{path.substring(1).split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h2>
            <p className="text-gray-600">This page is currently under construction.</p>
          </div>
        </div>
      );
    default:
      // Fallback to dashboard if path is not recognized
      return <DashboardRouter user={user} path="/dashboard" />;
  }
}

function App() {
  return (
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RealtimeProvider>
            <Toaster />
            <AppRoutes />
          </RealtimeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </TooltipProvider>
  );
}

export default App;
