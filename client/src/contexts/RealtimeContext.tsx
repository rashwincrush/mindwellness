import { createContext, useContext, useEffect, ReactNode } from 'react';
import { realtime } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';

interface RealtimeContextType {
  isConnected: boolean;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    // Subscribe to panic alerts (for counselors and admins)
    let unsubscribePanic: (() => void) | undefined;
    if (user.role === 'counselor' || user.role === 'admin') {
      unsubscribePanic = realtime.subscribe('panic_alerts', (data) => {
        if (data.type === 'INSERT') {
          toast({
            title: "🚨 Emergency Alert",
            description: `Emergency panic button activated by a student. Location: ${data.record.location?.address || 'Unknown'}`,
            variant: "destructive",
          });
          
          // Invalidate panic alerts query to refresh the UI
          queryClient.invalidateQueries({ queryKey: ['/api/panic-alerts'] });
        }
      });
    }

    // Subscribe to new anonymous reports (for counselors and admins)
    let unsubscribeReports: (() => void) | undefined;
    if (user.role === 'counselor' || user.role === 'admin') {
      unsubscribeReports = realtime.subscribe('anonymous_reports', (data) => {
        if (data.type === 'INSERT') {
          const priority = data.record.isEmergency ? '🚨 Emergency' : '📝 New';
          toast({
            title: `${priority} Report`,
            description: `New ${data.record.reportType} report submitted anonymously`,
            variant: data.record.isEmergency ? "destructive" : "default",
          });
          
          // Invalidate reports query
          queryClient.invalidateQueries({ queryKey: ['/api/anonymous-reports'] });
        }
      });
    }

    // Subscribe to mood check-ins for flagged patterns (counselors and admins)
    let unsubscribeMoods: (() => void) | undefined;
    if (user.role === 'counselor' || user.role === 'admin') {
      unsubscribeMoods = realtime.subscribe('mood_checkins', (data) => {
        if (data.type === 'INSERT' && data.record.aiAnalysis?.flagged) {
          toast({
            title: "⚠️ Concerning Mood Pattern",
            description: `Student showing concerning mood patterns requiring attention`,
          });
          
          // Invalidate mood queries
          queryClient.invalidateQueries({ queryKey: ['/api/mood-checkins'] });
        }
      });
    }

    // Subscribe to parent notifications
    let unsubscribeParent: (() => void) | undefined;
    if (user.role === 'parent') {
      unsubscribeParent = realtime.subscribe(`parent_notifications_${user.id}`, (data) => {
        if (data.type === 'INSERT') {
          toast({
            title: data.record.title,
            description: data.record.message,
          });
          
          // Invalidate parent notifications
          queryClient.invalidateQueries({ queryKey: ['/api/parent-notifications'] });
        }
      });
    }

    // Cleanup subscriptions
    return () => {
      unsubscribePanic?.();
      unsubscribeReports?.();
      unsubscribeMoods?.();
      unsubscribeParent?.();
    };
  }, [user, toast]);

  const value = {
    isConnected: true // Simplified for now
  };

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
}
