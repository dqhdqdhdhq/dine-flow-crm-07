
import React, { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { 
  User, 
  Table
} from '@/types';

const Settings = () => {
  // User data state (current user and all users)
  const [currentUser, setCurrentUser] = useState<User>({
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'owner' as const,
    avatarUrl: 'https://i.pravatar.cc/150?u=1',
    isActive: true,
    lastLogin: '2024-05-01T12:30:00Z'
  });
  
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      role: 'owner' as const,
      avatarUrl: 'https://i.pravatar.cc/150?u=1',
      isActive: true,
      lastLogin: '2024-05-01T12:30:00Z'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'manager' as const,
      avatarUrl: 'https://i.pravatar.cc/150?u=2',
      isActive: true,
      lastLogin: '2024-04-30T10:15:00Z'
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'michael@example.com',
      role: 'staff' as const,
      avatarUrl: 'https://i.pravatar.cc/150?u=3',
      isActive: false,
      lastLogin: '2024-04-25T09:45:00Z'
    }
  ]);

  // Restaurant settings state
  const [restaurant, setRestaurant] = useState({
    name: 'Restaurant Software',
    address: '123 Main Street, Anytown, USA',
    phone: '(555) 123-4567',
    website: 'www.restaurantsoftware.com',
    cuisineType: 'Contemporary American',
    logo: '/lovable-uploads/72d56d1c-5559-4703-95fa-c4865c955355.png',
    timezone: 'America/New_York',
    currency: 'USD',
    operatingHours: {
      monday: '11:00 AM - 10:00 PM',
      tuesday: '11:00 AM - 10:00 PM',
      wednesday: '11:00 AM - 10:00 PM',
      thursday: '11:00 AM - 11:00 PM',
      friday: '11:00 AM - 12:00 AM',
      saturday: '10:00 AM - 12:00 AM',
      sunday: '10:00 AM - 9:00 PM'
    }
  });

  // Table configurations
  const [tables, setTables] = useState<Table[]>([
    { id: '1', number: 1, capacity: 2, status: 'available', location: 'Main Dining' },
    { id: '2', number: 2, capacity: 4, status: 'available', location: 'Main Dining' },
    { id: '3', number: 3, capacity: 6, status: 'available', location: 'Main Dining' },
    { id: '4', number: 4, capacity: 2, status: 'available', location: 'Patio' },
    { id: '5', number: 5, capacity: 4, status: 'available', location: 'Patio' },
    { id: '6', number: 6, capacity: 8, status: 'available', location: 'Private Room' }
  ]);

  // Reservation configurations
  const [reservationSettings, setReservationSettings] = useState({
    defaultDuration: 90, // minutes
    advanceBookingWindow: 30, // days
    minPartySize: 1,
    maxPartySize: 20,
    autoConfirmations: true,
    autoReminders: true,
    reminderTime: 24, // hours
    allowWaitlist: true
  });

  // Notification preferences
  const [notificationPreferences, setNotificationPreferences] = useState({
    newReservation: true,
    reservationChanges: true,
    vipArrival: true,
    lowInventory: false,
    staffMessages: true,
    dailyReports: true,
    feedbackAlerts: true
  });

  // Integrations configuration
  const [integrations, setIntegrations] = useState([
    { id: '1', name: 'Point of Sale System', connected: true, lastSynced: '2024-05-01T12:00:00Z' },
    { id: '2', name: 'Online Booking Platform', connected: true, lastSynced: '2024-05-01T14:30:00Z' },
    { id: '3', name: 'Email Marketing Tool', connected: false, lastSynced: null },
    { id: '4', name: 'Accounting Software', connected: false, lastSynced: null }
  ]);

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    requirePasswordComplexity: true,
    enableTwoFactorAuth: false,
    sessionTimeout: 60 // minutes
  });

  // Function to handle user role change
  const handleRoleChange = (userId: string, newRole: "admin" | "manager" | "staff" | "owner" | "employee") => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);
    toast.success(`User role updated successfully!`);
  };

  // Function to handle user activation/deactivation
  const handleUserStatusChange = (userId: string, isActive: boolean) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, isActive } : user
    );
    setUsers(updatedUsers);
    toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully!`);
  };

  // Function to update restaurant profile
  const handleRestaurantUpdate = () => {
    toast.success('Restaurant profile updated successfully!');
  };

  // Function to add a new table
  const handleAddTable = () => {
    const newTable: Table = {
      id: `${tables.length + 1}`,
      number: tables.length + 1,
      capacity: 4,
      status: 'available',
      location: 'Main Dining'
    };
    setTables([...tables, newTable]);
    toast.success('New table added successfully!');
  };

  // Function to update reservation settings
  const handleReservationSettingsUpdate = () => {
    toast.success('Reservation settings updated successfully!');
  };

  // Function to add a new user
  const handleAddUser = () => {
    const newUser: User = {
      id: `${users.length + 1}`,
      name: 'New User',
      email: 'newuser@example.com',
      role: 'staff' as const,
      avatarUrl: undefined,
      isActive: true,
      lastLogin: undefined
    };
    setUsers([...users, newUser]);
    toast.success('Invitation sent to new user!');
  };

  // Check if the current user has admin/owner privileges
  const isOwnerOrAdmin = currentUser.role === 'owner' || currentUser.role === 'admin';

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Sidebar */}
        <div className="md:w-64 space-y-4">
          <div className="font-semibold text-xl">Settings</div>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted p-2">
              <span className="text-sm font-medium">Account</span>
            </div>
            <div className="p-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#profile">My Profile</a>
              </Button>
            </div>
          </div>
          
          {isOwnerOrAdmin && (
            <>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-2">
                  <span className="text-sm font-medium">Management</span>
                </div>
                <div className="p-2 space-y-1">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#users">Users</a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#restaurant">Restaurant Profile</a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#tables">Table Management</a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#reservations">Reservation Settings</a>
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-2">
                  <span className="text-sm font-medium">System</span>
                </div>
                <div className="p-2 space-y-1">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#notifications">Notifications</a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#integrations">Integrations</a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#billing">Billing</a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#security">Security</a>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {/* My Profile Section */}
          <section id="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>
                  Manage your personal account settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={currentUser.name} onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={currentUser.email} onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" value="•••••••••" disabled />
                        <Button variant="outline" size="sm">Change Password</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-start space-y-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                      <AvatarFallback>{currentUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center">
                      <Badge variant="outline" className="mb-2">{currentUser.role}</Badge>
                      <Button variant="secondary" size="sm">Upload Photo</Button>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">App Notifications</h4>
                    <p className="text-sm text-muted-foreground">Manage how you receive notifications</p>
                  </div>
                  <Switch checked={notificationPreferences.staffMessages} onCheckedChange={(checked) => setNotificationPreferences({...notificationPreferences, staffMessages: checked})} />
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button onClick={() => toast.success('Profile updated successfully!')}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </section>
          
          {isOwnerOrAdmin && (
            <>
              {/* User Management Section */}
              <section id="users" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>
                        Manage user accounts and permissions
                      </CardDescription>
                    </div>
                    <Button onClick={handleAddUser}>Add New User</Button>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {users.map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <Avatar>
                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{user.name}</h4>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                <div className="flex items-center mt-1">
                                  <Badge variant={user.isActive ? "default" : "secondary"} className="text-xs">
                                    {user.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Select
                                defaultValue={user.role}
                                onValueChange={(value) => handleRoleChange(user.id, value as "admin" | "manager" | "staff" | "owner" | "employee")}
                              >
                                <SelectTrigger className="w-[130px]">
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="owner">Owner</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="manager">Manager</SelectItem>
                                  <SelectItem value="staff">Staff</SelectItem>
                                  <SelectItem value="employee">Employee</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant={user.isActive ? "destructive" : "default"}
                                size="sm"
                                onClick={() => handleUserStatusChange(user.id, !user.isActive)}
                              >
                                {user.isActive ? "Deactivate" : "Activate"}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </section>
              
              {/* Restaurant Profile Section */}
              <section id="restaurant" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Restaurant Profile</CardTitle>
                    <CardDescription>
                      Manage your restaurant's information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="restaurant-name">Restaurant Name</Label>
                          <Input 
                            id="restaurant-name" 
                            value={restaurant.name} 
                            onChange={(e) => setRestaurant({...restaurant, name: e.target.value})} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="restaurant-address">Address</Label>
                          <Input 
                            id="restaurant-address" 
                            value={restaurant.address} 
                            onChange={(e) => setRestaurant({...restaurant, address: e.target.value})} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="restaurant-phone">Phone</Label>
                          <Input 
                            id="restaurant-phone" 
                            value={restaurant.phone} 
                            onChange={(e) => setRestaurant({...restaurant, phone: e.target.value})} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="restaurant-website">Website</Label>
                          <Input 
                            id="restaurant-website" 
                            value={restaurant.website} 
                            onChange={(e) => setRestaurant({...restaurant, website: e.target.value})} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="restaurant-cuisine">Cuisine Type</Label>
                          <Input 
                            id="restaurant-cuisine" 
                            value={restaurant.cuisineType} 
                            onChange={(e) => setRestaurant({...restaurant, cuisineType: e.target.value})} 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="h-40 w-40 rounded-lg border flex items-center justify-center overflow-hidden">
                            {restaurant.logo ? (
                              <img src={restaurant.logo} alt="Restaurant logo" className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-muted-foreground">No logo uploaded</span>
                            )}
                          </div>
                          <Button variant="outline">Upload Logo</Button>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="restaurant-timezone">Timezone</Label>
                          <Select 
                            defaultValue={restaurant.timezone}
                            onValueChange={(value) => setRestaurant({...restaurant, timezone: value})}
                          >
                            <SelectTrigger id="restaurant-timezone">
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                              <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                              <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                              <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="restaurant-currency">Currency</Label>
                          <Select 
                            defaultValue={restaurant.currency}
                            onValueChange={(value) => setRestaurant({...restaurant, currency: value})}
                          >
                            <SelectTrigger id="restaurant-currency">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD ($)</SelectItem>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                              <SelectItem value="GBP">GBP (£)</SelectItem>
                              <SelectItem value="CAD">CAD ($)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div>
                      <h4 className="font-medium mb-4">Operating Hours</h4>
                      <div className="space-y-2">
                        {Object.entries(restaurant.operatingHours).map(([day, hours]) => (
                          <div key={day} className="grid grid-cols-3 gap-4 items-center">
                            <div className="capitalize">{day}</div>
                            <Input 
                              value={hours} 
                              onChange={(e) => setRestaurant({
                                ...restaurant, 
                                operatingHours: {
                                  ...restaurant.operatingHours,
                                  [day]: e.target.value
                                }
                              })} 
                            />
                            <div>
                              <Switch 
                                checked={hours !== 'Closed'}
                                onCheckedChange={(checked) => setRestaurant({
                                  ...restaurant,
                                  operatingHours: {
                                    ...restaurant.operatingHours,
                                    [day]: checked ? '11:00 AM - 10:00 PM' : 'Closed'
                                  }
                                })}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button onClick={handleRestaurantUpdate}>Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
              </section>
              
              {/* Table Management Section */}
              <section id="tables" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Table Management</CardTitle>
                      <CardDescription>
                        Configure your restaurant's tables
                      </CardDescription>
                    </div>
                    <Button onClick={handleAddTable}>Add Table</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tables.map((table) => (
                        <div key={table.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">Table #{table.number}</h4>
                            <Badge>{table.location}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Capacity: {table.capacity} people
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <Select 
                              defaultValue={table.location}
                              onValueChange={(value) => {
                                const updatedTables = tables.map(t => 
                                  t.id === table.id ? {...t, location: value} : t
                                );
                                setTables(updatedTables);
                              }}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Location" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Main Dining">Main Dining</SelectItem>
                                <SelectItem value="Patio">Patio</SelectItem>
                                <SelectItem value="Bar">Bar</SelectItem>
                                <SelectItem value="Private Room">Private Room</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                const updatedTables = tables.filter(t => t.id !== table.id);
                                setTables(updatedTables);
                                toast.success(`Table #${table.number} removed.`);
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>
              
              {/* Reservation Settings Section */}
              <section id="reservations" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Reservation Settings</CardTitle>
                    <CardDescription>
                      Configure your reservation system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="default-duration">Default Reservation Duration (minutes)</Label>
                          <Input 
                            id="default-duration" 
                            type="number" 
                            value={reservationSettings.defaultDuration} 
                            onChange={(e) => setReservationSettings({...reservationSettings, defaultDuration: parseInt(e.target.value)})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="advance-booking">Advance Booking Window (days)</Label>
                          <Input 
                            id="advance-booking" 
                            type="number" 
                            value={reservationSettings.advanceBookingWindow} 
                            onChange={(e) => setReservationSettings({...reservationSettings, advanceBookingWindow: parseInt(e.target.value)})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="min-party">Minimum Party Size</Label>
                          <Input 
                            id="min-party" 
                            type="number" 
                            value={reservationSettings.minPartySize} 
                            onChange={(e) => setReservationSettings({...reservationSettings, minPartySize: parseInt(e.target.value)})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="max-party">Maximum Party Size</Label>
                          <Input 
                            id="max-party" 
                            type="number" 
                            value={reservationSettings.maxPartySize} 
                            onChange={(e) => setReservationSettings({...reservationSettings, maxPartySize: parseInt(e.target.value)})}
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Automatic Confirmations</h4>
                            <p className="text-sm text-muted-foreground">Automatically confirm new reservations</p>
                          </div>
                          <Switch 
                            checked={reservationSettings.autoConfirmations} 
                            onCheckedChange={(checked) => setReservationSettings({...reservationSettings, autoConfirmations: checked})}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Send Reminders</h4>
                            <p className="text-sm text-muted-foreground">Send automatic reminders to guests</p>
                          </div>
                          <Switch 
                            checked={reservationSettings.autoReminders} 
                            onCheckedChange={(checked) => setReservationSettings({...reservationSettings, autoReminders: checked})}
                          />
                        </div>
                        
                        {reservationSettings.autoReminders && (
                          <div className="pl-6 space-y-2">
                            <Label htmlFor="reminder-time">Reminder Time (hours before reservation)</Label>
                            <Input 
                              id="reminder-time" 
                              type="number" 
                              value={reservationSettings.reminderTime} 
                              onChange={(e) => setReservationSettings({...reservationSettings, reminderTime: parseInt(e.target.value)})}
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Allow Waitlist</h4>
                            <p className="text-sm text-muted-foreground">Allow customers to join a waitlist when fully booked</p>
                          </div>
                          <Switch 
                            checked={reservationSettings.allowWaitlist} 
                            onCheckedChange={(checked) => setReservationSettings({...reservationSettings, allowWaitlist: checked})}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-end">
                        <Button onClick={handleReservationSettingsUpdate}>Save Changes</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
              
              {/* Notifications Section */}
              <section id="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Configure notifications for your staff
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(notificationPreferences).map(([key, value]) => {
                        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
                        return (
                          <div key={key} className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{label}</h4>
                              <p className="text-sm text-muted-foreground">
                                Receive notifications about {key.toLowerCase().includes('reservation') ? 'reservations' : key.toLowerCase()}
                              </p>
                            </div>
                            <Switch 
                              checked={value} 
                              onCheckedChange={(checked) => 
                                setNotificationPreferences({...notificationPreferences, [key]: checked})
                              }
                            />
                          </div>
                        );
                      })}
                      
                      <div className="mt-6 flex justify-end">
                        <Button onClick={() => toast.success('Notification preferences updated successfully!')}>
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
              
              {/* Integrations Section */}
              <section id="integrations" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Integrations</CardTitle>
                    <CardDescription>
                      Connect with third-party services
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {integrations.map((integration) => (
                        <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{integration.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {integration.connected 
                                ? `Last synced: ${new Date(integration.lastSynced as string).toLocaleString()}` 
                                : 'Not connected'}
                            </p>
                          </div>
                          <div>
                            <Button 
                              variant={integration.connected ? "destructive" : "default"}
                              onClick={() => {
                                const updatedIntegrations = integrations.map(i => 
                                  i.id === integration.id 
                                    ? {...i, connected: !i.connected, lastSynced: !i.connected ? new Date().toISOString() : i.lastSynced} 
                                    : i
                                );
                                setIntegrations(updatedIntegrations);
                                toast.success(`${integration.name} ${integration.connected ? 'disconnected' : 'connected'} successfully!`);
                              }}
                            >
                              {integration.connected ? "Disconnect" : "Connect"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>
              
              {/* Billing Section */}
              <section id="billing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Billing & Subscription</CardTitle>
                    <CardDescription>
                      Manage your payment information and subscription
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-medium text-lg">Current Plan: Premium</h4>
                        <p className="text-sm text-muted-foreground mb-4">Your subscription renews on June 1, 2024</p>
                        <div className="flex space-x-2">
                          <Button variant="outline">Change Plan</Button>
                          <Button variant="destructive">Cancel Subscription</Button>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Payment Method</h4>
                        <div className="flex justify-between items-center p-4 border rounded-lg mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="h-8 w-12 bg-muted rounded flex items-center justify-center">
                              <span className="text-xs font-bold">VISA</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Visa ending in 4242</p>
                              <p className="text-xs text-muted-foreground">Expires 12/2025</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                        <Button variant="outline" size="sm">Add Payment Method</Button>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Billing History</h4>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="min-w-full divide-y divide-border">
                            <thead className="bg-muted">
                              <tr>
                                <th className="px-4 py-2 text-left">Date</th>
                                <th className="px-4 py-2 text-left">Description</th>
                                <th className="px-4 py-2 text-left">Amount</th>
                                <th className="px-4 py-2 text-left">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              <tr>
                                <td className="px-4 py-2">2024-05-01</td>
                                <td className="px-4 py-2">Premium Plan - Monthly</td>
                                <td className="px-4 py-2">$49.00</td>
                                <td className="px-4 py-2"><Badge>Paid</Badge></td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2">2024-04-01</td>
                                <td className="px-4 py-2">Premium Plan - Monthly</td>
                                <td className="px-4 py-2">$49.00</td>
                                <td className="px-4 py-2"><Badge>Paid</Badge></td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2">2024-03-01</td>
                                <td className="px-4 py-2">Premium Plan - Monthly</td>
                                <td className="px-4 py-2">$49.00</td>
                                <td className="px-4 py-2"><Badge>Paid</Badge></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
              
              {/* Security Section */}
              <section id="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your security preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Password Requirements</h4>
                          <p className="text-sm text-muted-foreground">
                            Minimum length: {securitySettings.passwordMinLength} characters
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="min-length" className="mr-2">Minimum Length:</Label>
                          <Select 
                            defaultValue={securitySettings.passwordMinLength.toString()}
                            onValueChange={(value) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(value)})}
                          >
                            <SelectTrigger id="min-length" className="w-[80px]">
                              <SelectValue placeholder="Length" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="6">6</SelectItem>
                              <SelectItem value="8">8</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="12">12</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Password Complexity</h4>
                          <p className="text-sm text-muted-foreground">
                            Require special characters, numbers and mixed case
                          </p>
                        </div>
                        <Switch 
                          checked={securitySettings.requirePasswordComplexity} 
                          onCheckedChange={(checked) => setSecuritySettings({...securitySettings, requirePasswordComplexity: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Two-Factor Authentication</h4>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch 
                          checked={securitySettings.enableTwoFactorAuth} 
                          onCheckedChange={(checked) => setSecuritySettings({...securitySettings, enableTwoFactorAuth: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Session Timeout</h4>
                          <p className="text-sm text-muted-foreground">
                            Automatically log out after inactivity
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="session-timeout" className="mr-2">Minutes:</Label>
                          <Select 
                            defaultValue={securitySettings.sessionTimeout.toString()}
                            onValueChange={(value) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(value)})}
                          >
                            <SelectTrigger id="session-timeout" className="w-[80px]">
                              <SelectValue placeholder="Minutes" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15">15</SelectItem>
                              <SelectItem value="30">30</SelectItem>
                              <SelectItem value="60">60</SelectItem>
                              <SelectItem value="120">120</SelectItem>
                              <SelectItem value="240">240</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-end">
                        <Button onClick={() => toast.success('Security settings updated successfully!')}>
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
