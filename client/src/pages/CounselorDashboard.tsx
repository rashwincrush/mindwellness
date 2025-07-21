import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  FolderOpen, 
  AlertCircle, 
  Users, 
  Heart, 
  MessageCircle, 
  Video, 
  FileText,
  TrendingUp,
  Clock,
  UserPlus
} from 'lucide-react';

export default function CounselorDashboard() {
  const { user } = useAuth();

  const { data: stats = {} } = useQuery({
    queryKey: ['/api/counselor/stats'],
  });

  const { data: priorityAlerts = [] } = useQuery({
    queryKey: ['/api/counselor/priority-alerts'],
  });

  const { data: activeCases = [] } = useQuery({
    queryKey: ['/api/counselor/cases'],
  });

  const { data: recentActivity = [] } = useQuery({
    queryKey: ['/api/counselor/recent-activity'],
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'monitoring':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Counselor Dashboard</h2>
        <p className="text-gray-600">Manage student cases and monitor wellness trends</p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Cases</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeCases || 12}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FolderOpen className="text-orange-600 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Reports</p>
                <p className="text-2xl font-bold text-gray-900">{stats.newReports || 3}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-red-600 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">At-Risk Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.atRisk || 7}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Users className="text-yellow-600 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Wellness Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.wellnessScore || 78}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Heart className="text-green-600 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Priority Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Priority Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              {priorityAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No priority alerts at this time</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {priorityAlerts.map((alert: any) => (
                    <div
                      key={alert.id}
                      className={`border-l-4 rounded-r-lg p-4 ${
                        alert.priority === 'urgent' ? 'bg-red-50 border-red-500' : 
                        alert.priority === 'high' ? 'bg-orange-50 border-orange-500' : 
                        'bg-yellow-50 border-yellow-500'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={
                              alert.priority === 'urgent' ? 'bg-red-500 text-white' :
                              alert.priority === 'high' ? 'bg-orange-500 text-white' :
                              'bg-yellow-500 text-white'
                            }>
                              {alert.priority?.toUpperCase() || 'HIGH'}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {alert.studentName || 'Anonymous Student'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-900 font-medium mb-1">
                            {alert.title || 'Concerning pattern detected'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {alert.description || 'Multiple concerning mood check-ins requiring attention'}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(alert.createdAt || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className={
                            alert.priority === 'urgent' ? 'text-red-600 border-red-300' :
                            alert.priority === 'high' ? 'text-orange-600 border-orange-300' :
                            'text-yellow-600 border-yellow-300'
                          }
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Cases Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Cases</CardTitle>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="mr-2 h-4 w-4" />
                  New Case
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {activeCases.length === 0 ? (
                <div className="text-center py-8">
                  <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No active cases</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Last Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeCases.map((case_: any) => (
                      <TableRow key={case_.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-gray-300 text-gray-600 text-sm">
                                {case_.studentName?.split(' ').map((n: string) => n[0]).join('') || 'ST'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {case_.studentName || 'Student Name'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {case_.grade || 'Grade 10'}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(case_.priority || 'medium')}>
                            {case_.priority || 'Medium'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {case_.lastContact ? 
                            new Date(case_.lastContact).toLocaleDateString() : 
                            '2 days ago'
                          }
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(case_.status || 'in-progress')}>
                            {case_.status || 'In Progress'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            View Case
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-green-600 hover:bg-green-700 justify-start">
                <MessageCircle className="mr-3 h-4 w-4" />
                Start New Chat Session
              </Button>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 justify-start">
                <Video className="mr-3 h-4 w-4" />
                Schedule Video Call
              </Button>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 justify-start">
                <FileText className="mr-3 h-4 w-4" />
                Create Wellness Plan
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-gray-900">Case #2847 updated</p>
                      <p className="text-xs text-gray-500">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-gray-900">New mood pattern detected</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-gray-900">Parent notification sent</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  {recentActivity.map((activity: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'case_update' ? 'bg-green-500' :
                        activity.type === 'mood_alert' ? 'bg-blue-500' :
                        'bg-orange-500'
                      }`}></div>
                      <div>
                        <p className="text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Wellness Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Wellness Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">School wellness overview</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-green-600">78%</p>
                  <p className="text-xs text-gray-500">Positive Trends</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-blue-600">142</p>
                  <p className="text-xs text-gray-500">Check-ins Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
