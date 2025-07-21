import { useQuery } from '@tanstack/react-query';
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
  Users, 
  Heart, 
  Shield, 
  AlertTriangle, 
  TrendingUp,
  Settings,
  UserPlus,
  FolderOutput,
  UserCog,
  Database,
  Bell,
  Search,
  Key,
  BarChart3,
  PieChart
} from 'lucide-react';

export default function AdminDashboard() {
  const { data: stats = {} } = useQuery({
    queryKey: ['/api/admin/stats'],
  });

  const { data: recentUsers = [] } = useQuery({
    queryKey: ['/api/admin/recent-users'],
  });

  const { data: systemHealth = {} } = useQuery({
    queryKey: ['/api/admin/system-health'],
  });

  const { data: auditLogs = [] } = useQuery({
    queryKey: ['/api/admin/audit-logs'],
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student':
        return 'bg-green-100 text-green-800';
      case 'teacher':
        return 'bg-blue-100 text-blue-800';
      case 'parent':
        return 'bg-purple-100 text-purple-800';
      case 'counselor':
        return 'bg-orange-100 text-orange-800';
      case 'admin':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Console</h2>
        <p className="text-gray-600">System-wide analytics, user management, and configuration</p>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="text-green-600 h-6 w-6" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers || '2,847'}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Heart className="text-blue-600 h-6 w-6" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.dailyCheckins || '1,284'}</p>
              <p className="text-sm text-gray-600">Daily Check-ins</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="text-orange-600 h-6 w-6" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.activeReports || '23'}</p>
              <p className="text-sm text-gray-600">Active Reports</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="text-red-600 h-6 w-6" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.emergencyAlerts || '3'}</p>
              <p className="text-sm text-gray-600">Emergency Alerts</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="text-green-600 h-6 w-6" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{systemHealth.uptime || '99.2%'}</p>
              <p className="text-sm text-gray-600">System Health</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="audit">Audit & Security</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Wellness Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle>School-wide Wellness Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                    <p className="text-sm text-gray-500">30-day wellness trend visualization</p>
                    <div className="grid grid-cols-3 gap-4 mt-4 text-xs">
                      <div>
                        <p className="font-medium text-green-600">76%</p>
                        <p className="text-gray-500">Positive</p>
                      </div>
                      <div>
                        <p className="font-medium text-yellow-600">18%</p>
                        <p className="text-gray-500">Neutral</p>
                      </div>
                      <div>
                        <p className="font-medium text-red-600">6%</p>
                        <p className="text-gray-500">Concerning</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alert Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Alert Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                    <p className="text-sm text-gray-500">Alert type distribution</p>
                    <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                      <div>
                        <p className="font-medium text-red-600">12</p>
                        <p className="text-gray-500">Emergency</p>
                      </div>
                      <div>
                        <p className="font-medium text-orange-600">45</p>
                        <p className="text-gray-500">Reports</p>
                      </div>
                      <div>
                        <p className="font-medium text-yellow-600">67</p>
                        <p className="text-gray-500">Wellness</p>
                      </div>
                      <div>
                        <p className="font-medium text-blue-600">23</p>
                        <p className="text-gray-500">Other</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          {/* User Management */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Users</CardTitle>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <FolderOutput className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers.length === 0 ? (
                      // Mock data for display purposes
                      <>
                        <TableRow>
                          <TableCell className="font-medium">Sarah Johnson</TableCell>
                          <TableCell>sarah.johnson@school.edu</TableCell>
                          <TableCell>
                            <Badge className={getRoleColor('student')}>Student</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </TableCell>
                          <TableCell>2 days ago</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">Edit</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Dr. Emily Chen</TableCell>
                          <TableCell>emily.chen@school.edu</TableCell>
                          <TableCell>
                            <Badge className={getRoleColor('counselor')}>Counselor</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </TableCell>
                          <TableCell>5 days ago</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">Edit</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Michael Brown</TableCell>
                          <TableCell>michael.brown@school.edu</TableCell>
                          <TableCell>
                            <Badge className={getRoleColor('teacher')}>Teacher</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </TableCell>
                          <TableCell>1 week ago</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">Edit</Button>
                          </TableCell>
                        </TableRow>
                      </>
                    ) : (
                      recentUsers.map((user: any) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.firstName} {user.lastName}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">Edit</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-2">
                  <p className="text-2xl font-bold text-blue-600">{stats.studentCount || '2,145'}</p>
                  <p className="text-sm text-gray-600">Students</p>
                </div>
                <div className="text-center py-2">
                  <p className="text-2xl font-bold text-green-600">{stats.teacherCount || '142'}</p>
                  <p className="text-sm text-gray-600">Teachers</p>
                </div>
                <div className="text-center py-2">
                  <p className="text-2xl font-bold text-purple-600">{stats.parentCount || '1,876'}</p>
                  <p className="text-sm text-gray-600">Parents</p>
                </div>
                <div className="text-center py-2">
                  <p className="text-2xl font-bold text-orange-600">{stats.counselorCount || '12'}</p>
                  <p className="text-sm text-gray-600">Counselors</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          {/* System Configuration */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 justify-between">
                  <div className="flex items-center">
                    <UserPlus className="mr-3 h-4 w-4" />
                    Add New User
                  </div>
                  <Settings className="h-4 w-4" />
                </Button>
                <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 justify-between">
                  <div className="flex items-center">
                    <UserCog className="mr-3 h-4 w-4" />
                    Manage Roles
                  </div>
                  <Settings className="h-4 w-4" />
                </Button>
                <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 justify-between">
                  <div className="flex items-center">
                    <FolderOutput className="mr-3 h-4 w-4" />
                    Export User Data
                  </div>
                  <Settings className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white justify-between">
                  <div className="flex items-center">
                    <Settings className="mr-3 h-4 w-4" />
                    Platform Settings
                  </div>
                  <Settings className="h-4 w-4" />
                </Button>
                <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 justify-between">
                  <div className="flex items-center">
                    <Bell className="mr-3 h-4 w-4" />
                    Notification Rules
                  </div>
                  <Settings className="h-4 w-4" />
                </Button>
                <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 justify-between">
                  <div className="flex items-center">
                    <Database className="mr-3 h-4 w-4" />
                    Data Retention
                  </div>
                  <Settings className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Database</span>
                  <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">API Services</span>
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">AI Services</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Notifications</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Delayed</Badge>
                </div>
                <div className="pt-4 border-t">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-green-600">99.2%</p>
                    <p className="text-xs text-gray-500">Uptime (30 days)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          {/* Audit & Security */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Audit Logs</CardTitle>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    <Search className="mr-2 h-4 w-4" />
                    View All Logs
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.length === 0 ? (
                      // Mock data for display
                      <>
                        <TableRow>
                          <TableCell>2024-01-20 14:23:15</TableCell>
                          <TableCell>admin@school.edu</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-800">LOGIN</Badge>
                          </TableCell>
                          <TableCell>/admin/dashboard</TableCell>
                          <TableCell>192.168.1.100</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>2024-01-20 14:20:45</TableCell>
                          <TableCell>system</TableCell>
                          <TableCell>
                            <Badge className="bg-yellow-100 text-yellow-800">CREATE</Badge>
                          </TableCell>
                          <TableCell>/api/panic-alert</TableCell>
                          <TableCell>internal</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>2024-01-20 14:18:32</TableCell>
                          <TableCell>counselor@school.edu</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">UPDATE</Badge>
                          </TableCell>
                          <TableCell>/api/wellness-cases/123</TableCell>
                          <TableCell>192.168.1.205</TableCell>
                        </TableRow>
                      </>
                    ) : (
                      auditLogs.map((log: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                          <TableCell>{log.user}</TableCell>
                          <TableCell>
                            <Badge className={
                              log.action === 'LOGIN' ? 'bg-blue-100 text-blue-800' :
                              log.action === 'CREATE' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }>
                              {log.action}
                            </Badge>
                          </TableCell>
                          <TableCell>{log.resource}</TableCell>
                          <TableCell>{log.ipAddress}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white justify-between">
                  <div className="flex items-center">
                    <Search className="mr-3 h-4 w-4" />
                    Audit Logs
                  </div>
                  <Settings className="h-4 w-4" />
                </Button>
                <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 justify-between">
                  <div className="flex items-center">
                    <Shield className="mr-3 h-4 w-4" />
                    Security Reports
                  </div>
                  <Settings className="h-4 w-4" />
                </Button>
                <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 justify-between">
                  <div className="flex items-center">
                    <Key className="mr-3 h-4 w-4" />
                    Access Control
                  </div>
                  <Settings className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
