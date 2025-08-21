import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const userInitials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Make an API call to update the user profile
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user?.id, // Include user ID for the backend
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
      
      const updatedUserData = await response.json();
      
      // Update the user context
      updateUser(updatedUserData);
      
      // Show success message
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would implement the actual password change logic
    // For now we check if passwords match and simulate success
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.currentPassword) {
      toast({
        title: "Error",
        description: "Please enter your current password.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
    
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Summary Card */}
        <div className="md:w-1/3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-blue-600 text-white text-lg">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-center text-xl">{user?.firstName} {user?.lastName}</CardTitle>
              <CardDescription className="text-center">
                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Role</p>
                  <p>{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Member Since</p>
                  <p>August 2023</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different settings */}
        <div className="md:w-2/3">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details here.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex justify-end">
                      {isEditing ? (
                        <>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsEditing(false)}
                            className="mr-2"
                          >
                            Cancel
                          </Button>
                          <Button type="submit">Save Changes</Button>
                        </>
                      ) : (
                        <Button 
                          type="button" 
                          onClick={() => setIsEditing(true)}
                        >
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>
                    Manage your password and security settings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">Change Password</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
