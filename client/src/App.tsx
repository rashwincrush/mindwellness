import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { RealtimeProvider } from "@/contexts/RealtimeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import Login from "@/pages/Login";
import StudentDashboard from "@/pages/StudentDashboard";
import CounselorDashboard from "@/pages/CounselorDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import ParentDashboard from "@/pages/ParentDashboard";
import NotFound from "@/pages/not-found";

function AppRoutes() {
  const { user, loading } = useAuth();

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
    return <Login />;
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={() => <DashboardRouter user={user} />} />
        <Route path="/dashboard" component={() => <DashboardRouter user={user} />} />
        <Route path="/mood-checkin" component={() => <DashboardRouter user={user} />} />
        <Route path="/reports" component={() => <DashboardRouter user={user} />} />
        <Route path="/ai-chat" component={() => <DashboardRouter user={user} />} />
        <Route path="/cases" component={() => <DashboardRouter user={user} />} />
        <Route path="/users" component={() => <DashboardRouter user={user} />} />
        <Route path="/analytics" component={() => <DashboardRouter user={user} />} />
        <Route path="/settings" component={() => <DashboardRouter user={user} />} />
        <Route path="/child-reports" component={() => <DashboardRouter user={user} />} />
        <Route path="/notifications" component={() => <DashboardRouter user={user} />} />
        <Route path="/mood-insights" component={() => <DashboardRouter user={user} />} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function DashboardRouter({ user }: { user: any }) {
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
