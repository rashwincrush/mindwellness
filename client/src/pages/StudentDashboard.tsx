import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoodCheckin } from '@/components/MoodCheckin';
import { AnonymousReport } from '@/components/AnonymousReport';
import { AIChat } from '@/components/AIChat';
import { 
  Heart, 
  Shield, 
  Bot, 
  TrendingUp, 
  Lightbulb, 
  Calendar,
  BookOpen,
  Users,
  Play
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();

  const { data: recentMoods = [], isLoading: moodsLoading } = useQuery({
    queryKey: ['/api/mood-checkins', user?.id],
    enabled: !!user?.id,
  });

  const { data: aiInsights = [], isLoading: insightsLoading } = useQuery({
    queryKey: ['/api/ai/wellness-insights', user?.id],
    enabled: !!user?.id,
  });

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getMoodEmoji = (mood: string) => {
    const emojiMap = {
      'very-sad': '😢',
      'sad': '😕',
      'okay': '😐',
      'good': '🙂',
      'great': '😊'
    };
    return emojiMap[mood as keyof typeof emojiMap] || '😐';
  };

  return (
    <div className="animate-fade-in">
      {/* Welcome Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {greeting()}, {user?.firstName}! 🌟
        </h2>
        <p className="text-gray-600">How are you feeling today? Your wellness matters to us.</p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MoodCheckin />
        <AnonymousReport />
        <AIChat />
      </div>

      {/* Recent Activity & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Mood Trends */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Your Wellness Journey</h3>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                View All
              </Button>
            </div>
            
            {/* Mock Mood Chart Area */}
            <div className="h-48 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg mb-4 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-500">7-day mood trend visualization</p>
                <p className="text-xs text-gray-400 mt-1">
                  {moodsLoading ? 'Loading...' : `${recentMoods.length} check-ins this week`}
                </p>
              </div>
            </div>
            
            {/* Recent Mood History */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Check-ins</h4>
              
              {moodsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-3 animate-pulse">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentMoods.length > 0 ? (
                <div className="space-y-3">
                  {recentMoods.slice(0, 3).map((checkin: any, index: number) => (
                    <div key={checkin.id} className="flex items-center space-x-3">
                      <span className="text-2xl">{getMoodEmoji(checkin.mood)}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {index === 0 ? 'Today' : `${index + 1} day${index === 0 ? '' : 's'} ago`} - {checkin.mood}
                        </p>
                        <p className="text-xs text-gray-500">
                          {checkin.journalEntry ? 
                            checkin.journalEntry.slice(0, 50) + (checkin.journalEntry.length > 50 ? '...' : '') :
                            'No notes'
                          }
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(checkin.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 mb-2">No mood check-ins yet</p>
                  <p className="text-xs text-gray-400">Start your wellness journey by checking in!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights & Resources */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Personalized Insights</h3>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
            
            {/* AI Recommendations */}
            <div className="space-y-4">
              {insightsLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Lightbulb className="text-blue-500 mt-1 h-5 w-5" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Wellness Tip</h4>
                        <p className="text-sm text-gray-600">
                          Based on your recent activity, try a 5-minute breathing exercise before stressful situations.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Calendar className="text-green-500 mt-1 h-5 w-5" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Great Progress!</h4>
                        <p className="text-sm text-gray-600">
                          You've been consistent with your check-ins. Keep up the great work!
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {/* Resource Links */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Helpful Resources</h4>
                <div className="space-y-2">
                  <a href="#" className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                    <Play className="mr-2 h-4 w-4" />
                    5-Minute Meditation for Students
                  </a>
                  <a href="#" className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Test Anxiety Management Guide
                  </a>
                  <a href="#" className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                    <Users className="mr-2 h-4 w-4" />
                    Peer Support Groups
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
