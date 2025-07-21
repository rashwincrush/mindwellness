import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Heart, 
  Bell, 
  MapPin, 
  Calendar, 
  TrendingUp,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  MessageCircle,
  BookOpen,
  Users
} from 'lucide-react';

export default function ParentDashboard() {
  const { user } = useAuth();

  const { data: children = [] } = useQuery({
    queryKey: ['/api/parent/children', user?.id],
    enabled: !!user?.id,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['/api/parent/notifications', user?.id],
    enabled: !!user?.id,
  });

  const { data: moodReports = [] } = useQuery({
    queryKey: ['/api/parent/mood-reports', user?.id],
    enabled: !!user?.id,
  });

  const { data: emergencyAlerts = [] } = useQuery({
    queryKey: ['/api/parent/emergency-alerts', user?.id],
    enabled: !!user?.id,
  });

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Parent Dashboard</h2>
        <p className="text-gray-600">Monitor your child's wellness and school activities</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Children</p>
                <p className="text-2xl font-bold text-gray-900">{children.length || 2}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="text-blue-600 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread Notifications</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter((n: any) => !n.read).length || 3}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Bell className="text-orange-600 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week's Check-ins</p>
                <p className="text-2xl font-bold text-gray-900">{moodReports.length || 12}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Heart className="text-green-600 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Emergency Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{emergencyAlerts.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-red-600 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="mood-reports">Mood Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Children Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Your Children</CardTitle>
              </CardHeader>
              <CardContent>
                {children.length === 0 ? (
                  // Mock data for display
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">SJ</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">Sarah Johnson</h3>
                        <p className="text-sm text-gray-500">Grade 10 • Lincoln High School</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-lg">{getMoodEmoji('good')}</span>
                          <span className="text-sm text-green-600">Doing well today</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-green-600">MJ</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">Michael Johnson</h3>
                        <p className="text-sm text-gray-500">Grade 8 • Lincoln Middle School</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-lg">{getMoodEmoji('okay')}</span>
                          <span className="text-sm text-gray-600">Okay today</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {children.map((child: any) => (
                      <div key={child.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {child.firstName?.[0]}{child.lastName?.[0]}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {child.firstName} {child.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">{child.grade} • {child.school}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-lg">{getMoodEmoji(child.lastMood || 'okay')}</span>
                            <span className="text-sm text-gray-600">{child.lastMoodDate}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Sarah completed mood check-in</p>
                      <p className="text-xs text-gray-500">Today at 2:30 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Counselor meeting scheduled</p>
                      <p className="text-xs text-gray-500">Tomorrow at 10:00 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Michael used AI wellness chat</p>
                      <p className="text-xs text-gray-500">Yesterday at 4:15 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Parent-teacher conference reminder</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mood-reports" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Mood Check-in Reports</CardTitle>
                <Button size="sm" variant="outline">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Trends
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Child</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Mood</TableHead>
                    <TableHead>Energy</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {moodReports.length === 0 ? (
                    // Mock data for display
                    <>
                      <TableRow>
                        <TableCell>Sarah Johnson</TableCell>
                        <TableCell>Today, 2:30 PM</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getMoodEmoji('good')}</span>
                            <span>Good</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="w-2 h-2 bg-green-400 rounded-full"></div>
                            ))}
                            <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Had a great day in math class
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Normal</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Michael Johnson</TableCell>
                        <TableCell>Yesterday, 4:15 PM</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getMoodEmoji('okay')}</span>
                            <span>Okay</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            ))}
                            <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                            <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Worried about upcoming test
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-100 text-yellow-800">Monitoring</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Sarah Johnson</TableCell>
                        <TableCell>2 days ago, 1:45 PM</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getMoodEmoji('great')}</span>
                            <span>Great</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div key={i} className="w-2 h-2 bg-green-400 rounded-full"></div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          Excited about the science fair
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Normal</Badge>
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    moodReports.map((report: any) => (
                      <TableRow key={report.id}>
                        <TableCell>{report.childName}</TableCell>
                        <TableCell>{new Date(report.createdAt).toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getMoodEmoji(report.mood)}</span>
                            <span>{report.mood}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i <= report.energyLevel ? 'bg-green-400' : 'bg-gray-200'
                                }`}
                              ></div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {report.journalEntry || 'No notes'}
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(report.status || 'normal')}>
                            {report.status || 'Normal'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Notifications</CardTitle>
                <Button size="sm" variant="outline">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark All Read
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
                    <Bell className="text-blue-600 mt-1 h-5 w-5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">Weekly Wellness Summary</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Sarah has completed 5 mood check-ins this week with positive trends.
                      </p>
                      <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
                    </div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 border-l-4 border-orange-500 bg-orange-50 rounded-r-lg">
                    <AlertTriangle className="text-orange-600 mt-1 h-5 w-5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">Counselor Meeting Scheduled</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        A meeting has been scheduled with Dr. Emily Chen for Michael on Thursday at 10:00 AM.
                      </p>
                      <p className="text-xs text-gray-500 mt-2">1 day ago</p>
                    </div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
                    <CheckCircle className="text-green-600 mt-1 h-5 w-5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">Wellness Goal Achieved</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Sarah has successfully maintained consistent mood check-ins for 2 weeks!
                      </p>
                      <p className="text-xs text-gray-500 mt-2">3 days ago</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification: any) => (
                    <div
                      key={notification.id}
                      className={`flex items-start space-x-4 p-4 border-l-4 rounded-r-lg ${
                        notification.read ? 'bg-gray-50 border-gray-300' : 'bg-blue-50 border-blue-500'
                      }`}
                    >
                      <Bell className={`mt-1 h-5 w-5 ${notification.read ? 'text-gray-400' : 'text-blue-600'}`} />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Emergency Alerts & Procedures</CardTitle>
            </CardHeader>
            <CardContent>
              {emergencyAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Emergency Alerts</h3>
                  <p className="text-gray-600 mb-6">
                    There are currently no active emergency alerts for your children.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {emergencyAlerts.map((alert: any) => (
                    <div key={alert.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="text-red-600 mt-1 h-5 w-5" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-red-900">{alert.title}</h4>
                          <p className="text-sm text-red-700 mt-1">{alert.message}</p>
                          {alert.location && (
                            <div className="flex items-center mt-2 text-xs text-red-600">
                              <MapPin className="mr-1 h-3 w-3" />
                              {alert.location}
                            </div>
                          )}
                          <p className="text-xs text-red-500 mt-2">
                            {new Date(alert.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <Badge className="bg-red-500 text-white">ACTIVE</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Emergency Contact Information */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-red-900 mb-3">Emergency Contacts</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-red-800">School Emergency Line</p>
                    <a href="tel:5551234567" className="text-red-600 hover:underline">
                      (555) 123-4567
                    </a>
                  </div>
                  <div>
                    <p className="font-medium text-red-800">Crisis Hotline</p>
                    <a href="tel:988" className="text-red-600 hover:underline">
                      988
                    </a>
                  </div>
                  <div>
                    <p className="font-medium text-red-800">Local Emergency</p>
                    <a href="tel:911" className="text-red-600 hover:underline">
                      911
                    </a>
                  </div>
                  <div>
                    <p className="font-medium text-red-800">School Counselor</p>
                    <a href="tel:5551234568" className="text-red-600 hover:underline">
                      (555) 123-4568
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
