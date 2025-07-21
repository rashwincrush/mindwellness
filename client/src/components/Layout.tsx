import { ReactNode, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { EmergencyPanic } from '@/components/EmergencyPanic';
import { 
  GraduationCap, 
  Menu, 
  Heart, 
  Shield, 
  Bot, 
  UserRound, 
  Settings,
  Home,
  Phone,
  AlertTriangle
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const navigationItems = {
  student: [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/mood-checkin', icon: Heart, label: 'Mood Check-in' },
    { href: '/reports', icon: Shield, label: 'Anonymous Reporting' },
    { href: '/ai-chat', icon: Bot, label: 'AI Wellness Chat' }
  ],
  teacher: [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/mood-checkin', icon: Heart, label: 'Mood Check-in' },
    { href: '/reports', icon: Shield, label: 'Anonymous Reporting' },
    { href: '/ai-chat', icon: Bot, label: 'AI Wellness Chat' }
  ],
  parent: [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/child-reports', icon: Heart, label: 'Child Reports' },
    { href: '/notifications', icon: AlertTriangle, label: 'Notifications' }
  ],
  counselor: [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/cases', icon: UserRound, label: 'Cases' },
    { href: '/reports', icon: Shield, label: 'Reports' },
    { href: '/mood-insights', icon: Heart, label: 'Mood Insights' }
  ],
  admin: [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/users', icon: Settings, label: 'User Management' },
    { href: '/analytics', icon: Heart, label: 'Analytics' },
    { href: '/reports', icon: Shield, label: 'Reports' },
    { href: '/settings', icon: Settings, label: 'Settings' }
  ]
};

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) {
    return <>{children}</>;
  }

  const userInitials = `${user.firstName[0]}${user.lastName[0]}`;
  const navItems = navigationItems[user.role as keyof typeof navigationItems] || [];

  const roleColors = {
    student: 'bg-green-100 text-green-800',
    teacher: 'bg-blue-100 text-blue-800',
    parent: 'bg-purple-100 text-purple-800',
    counselor: 'bg-orange-100 text-orange-800',
    admin: 'bg-red-100 text-red-800'
  };

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              ${mobile ? 'block' : 'group flex items-center'} 
              px-4 py-3 text-sm font-medium rounded-lg transition-colors
              ${isActive 
                ? 'bg-blue-100 text-blue-600 border-l-4 border-blue-600' 
                : 'text-gray-700 hover:bg-gray-50'
              }
            `}
            onClick={() => mobile && setMobileMenuOpen(false)}
          >
            <Icon className={`${mobile ? 'inline mr-3' : 'mr-3'} h-5 w-5`} />
            {item.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="text-white h-6 w-6" />
                </div>
                <h1 className="ml-3 text-xl font-bold text-gray-900">Edu360+</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-sm text-gray-600">Welcome back,</span>
                <span className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </span>
                <Badge className={roleColors[user.role as keyof typeof roleColors]}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>

              {/* Emergency Panic Button */}
              <EmergencyPanic />

              {/* Profile Menu */}
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gray-300 text-gray-600 text-sm">
                  {userInitials}
                </AvatarFallback>
              </Avatar>

              {/* Mobile menu button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gray-300 text-gray-600">
                            {userInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <Badge className={roleColors[user.role as keyof typeof roleColors]} variant="secondary">
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <nav className="flex-1 px-4 py-4 space-y-2">
                      <NavItems mobile />
                    </nav>
                    <div className="p-4 border-t border-gray-200">
                      <Button
                        onClick={signOut}
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar Navigation - Desktop */}
        <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-16">
          <div className="flex-1 flex flex-col bg-white border-r border-gray-200 pt-4">
            <nav className="flex-1 px-4 space-y-2">
              <NavItems />
            </nav>

            {/* Emergency Resources */}
            <div className="p-4 border-t border-gray-200 bg-red-50">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Need immediate help?</h4>
              <div className="space-y-2">
                <a
                  href="tel:988"
                  className="flex items-center text-sm text-red-600 hover:text-red-700"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Crisis Hotline: 988
                </a>
                <a
                  href="tel:911"
                  className="flex items-center text-sm text-red-600 hover:text-red-700"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Emergency: 911
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="md:ml-64 flex-1 flex flex-col">
          <main className="flex-1 p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
