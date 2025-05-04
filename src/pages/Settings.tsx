import React, { useState, useEffect } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { mockUsers } from '@/data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  AlertCircle,
  Building,
  Clock,
  CreditCard,
  ExternalLink,
  FileWarning,
  Globe,
  KeyRound,
  LayoutGrid,
  LucideIcon,
  Mail,
  Phone,
  Plus,
  Shield,
  Table,
  Trash2,
  UserCog,
  UserIcon,
  Users,
  X
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Define the type for our tab sections
type TabSection = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  adminOnly: boolean;
};

const Settings: React.FC = () => {
  const [restaurantName, setRestaurantName] = useState('DineFlow Restaurant');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [autoConfirmation, setAutoConfirmation] = useState(true);
  const [currentUser, setCurrentUser] = useState(mockUsers[0]); // Admin user by default
  const [activeTab, setActiveTab] = useState('general');
  const [isAdmin, setIsAdmin] = useState(true); // Default to admin for demo

  // New state for user management
  const [users, setUsers] = useState(mockUsers);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('employee');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  
  // Toast hook
  const { toast } = useToast();
  
  // Define available tabs with their access restrictions
  const tabSections: TabSection[] = [
    {
      id: 'general',
      title: 'General',
      description: 'Basic restaurant information and configuration',
      icon: Building,
      adminOnly: false
    },
    {
      id: 'users',
      title: 'Users',
      description: 'Manage staff accounts and permissions',
      icon: Users,
      adminOnly: true
    },
    {
      id: 'tables',
      title: 'Tables',
      description: 'Configure tables and dining sections',
      icon: Table,
      adminOnly: true
    },
    {
      id: 'reservations',
      title: 'Reservations',
      description: 'Reservation settings and policies',
      icon: Clock,
      adminOnly: true
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Configure notification preferences',
      icon: AlertCircle,
      adminOnly: false
    },
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'Connect with third-party services',
      icon: ExternalLink,
      adminOnly: true
    },
    {
      id: 'billing',
      title: 'Billing',
      description: 'Manage subscription and payment methods',
      icon: CreditCard,
      adminOnly: true
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Security settings and access control',
      icon: Shield,
      adminOnly: true
    },
    {
      id: 'account',
      title: 'My Account',
      description: 'Your personal account settings',
      icon: UserIcon,
      adminOnly: false
    }
  ];
  
  // Filter tabs based on user's admin status
  const availableTabs = tabSections.filter(tab => !tab.adminOnly || isAdmin);
  
  // Handle user invitation
  const handleInviteUser = () => {
    if (!newUserEmail) {
      toast({
        title: "Email required",
        description: "Please enter an email address for the new user.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would send an invitation email and create a pending user
    const newUser = {
      id: `user-${users.length + 1}`,
      name: `New User (${newUserEmail})`,
      email: newUserEmail,
      role: newUserRole,
      avatarUrl: '',
      isActive: true,
      lastLogin: ''
    };
    
    setUsers([...users, newUser]);
    setNewUserEmail('');
    setNewUserRole('employee');
    setIsInviteDialogOpen(false);
    
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${newUserEmail}.`,
    });
  };
  
  // Handle user status toggle
  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? {...user, isActive: !user.isActive} : user
    ));
    
    const user = users.find(u => u.id === userId);
    if (user) {
      toast({
        title: user.isActive ? "User deactivated" : "User activated",
        description: `${user.name} has been ${user.isActive ? 'deactivated' : 'activated'}.`,
      });
    }
  };
  
  // Handle user deletion
  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setUsers(users.filter(user => user.id !== userId));
    
    if (user) {
      toast({
        title: "User removed",
        description: `${user.name} has been removed from the system.`,
      });
    }
  };
  
  // Handle user role change
  const handleChangeUserRole = (userId: string, newRole: string) => {
    setUsers(users.map(user => 
      user.id === userId ? {...user, role: newRole} : user
    ));
    
    const user = users.find(u => u.id === userId);
    if (user) {
      toast({
        title: "Role updated",
        description: `${user.name}'s role has been changed to ${newRole}.`,
      });
    }
  };
  
  const handleSaveSettings = () => {
    // In a real app, this would save the settings to the server
    console.log('Saving settings:', {
      restaurantName,
      emailNotifications,
      smsNotifications,
      autoConfirmation
    });
    
    toast({
      title: "Settings saved",
      description: "Your changes have been saved successfully.",
    });
  };
  
  // Restaurant hours state
  const [hours, setHours] = useState([
    { day: 'Monday', open: '11:00', close: '22:00', closed: false },
    { day: 'Tuesday', open: '11:00', close: '22:00', closed: false },
    { day: 'Wednesday', open: '11:00', close: '22:00', closed: false },
    { day: 'Thursday', open: '11:00', close: '22:00', closed: false },
    { day: 'Friday', open: '11:00', close: '23:00', closed: false },
    { day: 'Saturday', open: '12:00', close: '23:00', closed: false },
    { day: 'Sunday', open: '12:00', close: '21:00', closed: false }
  ]);
  
  // Table sections state
  const [tableSections, setTableSections] = useState([
    { id: '1', name: 'Main Dining', color: '#4f46e5' },
    { id: '2', name: 'Patio', color: '#10b981' },
    { id: '3', name: 'Bar', color: '#f59e0b' }
  ]);
  
  // Tables state
  const [tables, setTables] = useState([
    { id: '1', number: '1', capacity: 4, section: '1', status: 'available' },
    { id: '2', number: '2', capacity: 2, section: '1', status: 'available' },
    { id: '3', number: '3', capacity: 6, section: '1', status: 'available' },
    { id: '4', number: '4', capacity: 4, section: '2', status: 'available' },
    { id: '5', number: '5', capacity: 2, section: '2', status: 'available' },
    { id: '6', number: 'B1', capacity: 2, section: '3', status: 'available' },
    { id: '7', number: 'B2', capacity: 2, section: '3', status: 'available' }
  ]);
  
  // New table state
  const [newTable, setNewTable] = useState({
    number: '',
    capacity: 2,
    section: '1'
  });
  
  // Handle adding a new table
  const handleAddTable = () => {
    if (!newTable.number) {
      toast({
        title: "Table number required",
        description: "Please enter a table number.",
        variant: "destructive",
      });
      return;
    }
    
    const newTableObj = {
      id: `${tables.length + 1}`,
      number: newTable.number,
      capacity: newTable.capacity,
      section: newTable.section,
      status: 'available'
    };
    
    setTables([...tables, newTableObj]);
    setNewTable({
      number: '',
      capacity: 2,
      section: '1'
    });
    
    toast({
      title: "Table added",
      description: `Table ${newTable.number} has been added.`,
    });
  };
  
  // Handle table deletion
  const handleDeleteTable = (tableId: string) => {
    const tableToDelete = tables.find(t => t.id === tableId);
    setTables(tables.filter(table => table.id !== tableId));
    
    if (tableToDelete) {
      toast({
        title: "Table removed",
        description: `Table ${tableToDelete.number} has been removed.`,
      });
    }
  };
  
  // Update the operating hours
  const updateHours = (index: number, field: string, value: string | boolean) => {
    const updatedHours = [...hours];
    updatedHours[index] = { 
      ...updatedHours[index], 
      [field]: value,
      // If changing to closed, keep the previous hours for when it's reopened
      ...(field === 'closed' && value === true ? {} : {})
    };
    setHours(updatedHours);
  };
  
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure your restaurant and application preferences
          </p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-64 space-y-1">
          {availableTabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors ${
                activeTab === tab.id ? 'bg-muted font-medium' : 'text-muted-foreground'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.title}</span>
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 space-y-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Restaurant Information</CardTitle>
                  <CardDescription>
                    Basic information about your restaurant
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="restaurant-name">Restaurant Name</Label>
                    <Input 
                      id="restaurant-name" 
                      value={restaurantName} 
                      onChange={(e) => setRestaurantName(e.target.value)} 
                      disabled={!isAdmin}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input 
                      id="contact-email" 
                      type="email" 
                      defaultValue="contact@dineflowrestaurant.com"
                      disabled={!isAdmin} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">Contact Phone</Label>
                    <Input 
                      id="contact-phone" 
                      type="tel" 
                      defaultValue="(555) 123-4567"
                      disabled={!isAdmin} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input 
                      id="website" 
                      type="url" 
                      defaultValue="https://dineflowrestaurant.com"
                      disabled={!isAdmin} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      defaultValue="123 Restaurant Row, Foodie City, FC 12345"
                      disabled={!isAdmin} 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="America/New_York" disabled={!isAdmin}>
                        <SelectTrigger id="timezone">
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
                      <Label htmlFor="currency">Currency</Label>
                      <Select defaultValue="USD" disabled={!isAdmin}>
                        <SelectTrigger id="currency">
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
                  
                  <div className="pt-4">
                    {isAdmin && (
                      <Button className="bg-brand hover:bg-brand-muted" onClick={handleSaveSettings}>
                        Save Changes
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {isAdmin && (
                <Card>
                  <CardHeader>
                    <CardTitle>Operating Hours</CardTitle>
                    <CardDescription>
                      Set your restaurant's opening and closing hours
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {hours.map((day, index) => (
                        <div key={day.day} className="flex flex-wrap items-center gap-4">
                          <div className="w-24">
                            <p className="font-medium">{day.day}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={!day.closed}
                              onCheckedChange={(checked) => updateHours(index, 'closed', !checked)}
                            />
                            <span className="text-sm">
                              {day.closed ? 'Closed' : 'Open'}
                            </span>
                          </div>
                          
                          {!day.closed && (
                            <>
                              <div>
                                <Label htmlFor={`${day.day}-open`} className="sr-only">Opening Time</Label>
                                <Input
                                  id={`${day.day}-open`}
                                  type="time"
                                  value={day.open}
                                  onChange={(e) => updateHours(index, 'open', e.target.value)}
                                  className="w-32"
                                />
                              </div>
                              <span className="text-muted-foreground">to</span>
                              <div>
                                <Label htmlFor={`${day.day}-close`} className="sr-only">Closing Time</Label>
                                <Input
                                  id={`${day.day}-close`}
                                  type="time"
                                  value={day.close}
                                  onChange={(e) => updateHours(index, 'close', e.target.value)}
                                  className="w-32"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <Button className="bg-brand hover:bg-brand-muted" onClick={handleSaveSettings}>
                        Save Hours
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
          
          {/* Users Management */}
          {activeTab === 'users' && isAdmin && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      Manage staff accounts and permissions
                    </CardDescription>
                  </div>
                  <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-brand hover:bg-brand-muted">
                        <Plus className="mr-2 h-4 w-4" />
                        Invite User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Invite New User</DialogTitle>
                        <DialogDescription>
                          Send an invitation to a new staff member.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email" 
                            placeholder="staff@example.com" 
                            type="email"
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Select value={newUserRole} onValueChange={setNewUserRole}>
                            <SelectTrigger id="role">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="employee">Employee</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="owner">Owner</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button className="bg-brand hover:bg-brand-muted" onClick={handleInviteUser}>
                          Send Invitation
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No users found</p>
                  ) : (
                    <div className="rounded-md border">
                      <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium text-sm">
                        <div className="col-span-3">Name</div>
                        <div className="col-span-3">Email</div>
                        <div className="col-span-2">Role</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2 text-right">Actions</div>
                      </div>
                      {users.map((user) => (
                        <div 
                          key={user.id}
                          className="grid grid-cols-12 gap-4 p-4 border-b last:border-b-0 text-sm items-center"
                        >
                          <div className="col-span-3 flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatarUrl} alt={user.name} />
                              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                          </div>
                          <div className="col-span-3">{user.email}</div>
                          <div className="col-span-2">
                            <Select 
                              defaultValue={user.role}
                              onValueChange={(value) => handleChangeUserRole(user.id, value)}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="employee">Employee</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="owner">Owner</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-2">
                            <Badge 
                              variant={user.isActive ? "outline" : "secondary"}
                              className={user.isActive ? "bg-green-50 text-green-700 hover:bg-green-50" : ""}
                            >
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <div className="col-span-2 flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleUserStatus(user.id)}
                            >
                              {user.isActive ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Tables Management */}
          {activeTab === 'tables' && isAdmin && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Table Sections</CardTitle>
                  <CardDescription>
                    Define the sections of your restaurant
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tableSections.map((section) => (
                      <div key={section.id} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: section.color }}
                          />
                          <span className="font-medium">{section.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-4 mt-4">
                      <Button variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Section
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Tables</CardTitle>
                      <CardDescription>
                        Manage your restaurant's tables
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tables.map((table) => {
                        const section = tableSections.find(s => s.id === table.section);
                        return (
                          <Card key={table.id} className="border">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle>Table {table.number}</CardTitle>
                                  <CardDescription>
                                    {section?.name} • {table.capacity} seats
                                  </CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" className="text-destructive -mt-1 -mr-1" 
                                  onClick={() => handleDeleteTable(table.id)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: section?.color }}
                                />
                                <span className="text-sm">{section?.name}</span>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                      
                      {/* Add new table card */}
                      <Card className="border border-dashed">
                        <CardHeader>
                          <CardTitle className="text-base">Add New Table</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="table-number">Table Number</Label>
                              <Input 
                                id="table-number" 
                                placeholder="e.g., 10" 
                                value={newTable.number}
                                onChange={(e) => setNewTable({...newTable, number: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="table-capacity">Capacity</Label>
                              <Select 
                                value={String(newTable.capacity)}
                                onValueChange={(value) => setNewTable({...newTable, capacity: Number(value)})}
                              >
                                <SelectTrigger id="table-capacity">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {[1, 2, 4, 6, 8, 10, 12].map(capacity => (
                                    <SelectItem key={capacity} value={String(capacity)}>
                                      {capacity} {capacity === 1 ? 'person' : 'people'}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="table-section">Section</Label>
                              <Select 
                                value={newTable.section}
                                onValueChange={(value) => setNewTable({...newTable, section: value})}
                              >
                                <SelectTrigger id="table-section">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {tableSections.map(section => (
                                    <SelectItem key={section.id} value={section.id}>
                                      {section.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Button 
                              className="w-full bg-brand hover:bg-brand-muted mt-2"
                              onClick={handleAddTable}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add Table
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Reservation Settings */}
          {activeTab === 'reservations' && isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Reservation Settings</CardTitle>
                <CardDescription>
                  Configure how reservations are handled
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-confirmation">Automatic Reservation Confirmation</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically confirm new reservations without staff approval
                    </p>
                  </div>
                  <Switch 
                    id="auto-confirmation" 
                    checked={autoConfirmation}
                    onCheckedChange={setAutoConfirmation}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Time Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reservation-interval">Reservation Time Interval (minutes)</Label>
                      <Select defaultValue="15">
                        <SelectTrigger id="reservation-interval">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="table-turnover">Default Table Turnover Time (minutes)</Label>
                      <Select defaultValue="90">
                        <SelectTrigger id="table-turnover">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="90">90 minutes</SelectItem>
                          <SelectItem value="120">120 minutes</SelectItem>
                          <SelectItem value="150">150 minutes</SelectItem>
                          <SelectItem value="180">180 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Booking Limits</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min-party">Minimum Party Size</Label>
                      <Select defaultValue="1">
                        <SelectTrigger id="min-party">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 person</SelectItem>
                          <SelectItem value="2">2 people</SelectItem>
                          <SelectItem value="4">4 people</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="max-party">Maximum Party Size</Label>
                      <Select defaultValue="12">
                        <SelectTrigger id="max-party">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="8">8 people</SelectItem>
                          <SelectItem value="10">10 people</SelectItem>
                          <SelectItem value="12">12 people</SelectItem>
                          <SelectItem value="15">15 people</SelectItem>
                          <SelectItem value="20">20 people</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="booking-window">Advance Booking Window (days)</Label>
                      <Select defaultValue="30">
                        <SelectTrigger id="booking-window">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="14">14 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="bg-brand hover:bg-brand-muted" onClick={handleSaveSettings}>
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you want to be notified about reservations and customers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive reservation and customer updates via email
                    </p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive reservation and customer updates via SMS
                    </p>
                  </div>
                  <Switch 
                    id="sms-notifications" 
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Events</h3>
                  <p className="text-sm text-muted-foreground">
                    Select which events trigger notifications
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-new-reservation">New Reservation</Label>
                      <Switch id="notify-new-reservation" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-cancellation">Reservation Cancellation</Label>
                      <Switch id="notify-cancellation" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-modification">Reservation Modification</Label>
                      <Switch id="notify-modification" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-vip">VIP Customer Arrival</Label>
                      <Switch id="notify-vip" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-feedback">New Feedback Received</Label>
                      <Switch id="notify-feedback" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="bg-brand hover:bg-brand-muted" onClick={handleSaveSettings}>
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Integrations */}
          {activeTab === 'integrations' && isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>
                  Connect with third-party services and platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  <div className="border rounded-md p-4 relative hover:border-primary transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="bg-muted rounded-md h-12 w-12 flex items-center justify-center">
                        <Globe className="h-6 w-6" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg font-medium">Online Booking Platforms</h3>
                        <p className="text-sm text-muted-foreground">Connect with popular booking platforms</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">Not Connected</Badge>
                        </div>
                      </div>
                      <Button variant="ghost">Configure</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 relative hover:border-primary transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="bg-muted rounded-md h-12 w-12 flex items-center justify-center">
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg font-medium">Payment Processing</h3>
                        <p className="text-sm text-muted-foreground">Accept payments and process transactions</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">Not Connected</Badge>
                        </div>
                      </div>
                      <Button variant="ghost">Configure</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 relative hover:border-primary transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="bg-muted rounded-md h-12 w-12 flex items-center justify-center">
                        <Mail className="h-6 w-6" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg font-medium">Email Marketing</h3>
                        <p className="text-sm text-muted-foreground">Connect to email marketing platforms</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">Not Connected</Badge>
                        </div>
                      </div>
                      <Button variant="ghost">Configure</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 relative hover:border-primary transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="bg-muted rounded-md h-12 w-12 flex items-center justify-center">
                        <LayoutGrid className="h-6 w-6" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg font-medium">POS System</h3>
                        <p className="text-sm text-muted-foreground">Connect to your point-of-sale system</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">Not Connected</Badge>
                        </div>
                      </div>
                      <Button variant="ghost">Configure</Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-center">
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Integration
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Billing */}
          {activeTab === 'billing' && isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
                <CardDescription>
                  Manage your subscription and payment information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 rounded-md p-4 border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Current Plan</h3>
                      <p className="text-2xl font-bold mt-1">Professional</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Billed monthly • Next payment on May 15, 2025
                      </p>
                    </div>
                    <div className="bg-brand/10 text-brand font-medium px-3 py-1 rounded-full text-sm">
                      Active
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="outline">Change Plan</Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payment Method</h3>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="bg-muted rounded p-1 h-8 w-12 flex items-center justify-center">
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/25</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Change
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Billing History</h3>
                    <Button variant="outline" size="sm">
                      Download All
                    </Button>
                  </div>
                  
                  <div className="border rounded-md">
                    <div className="grid grid-cols-4 gap-4 p-4 border-b font-medium text-sm">
                      <div>Date</div>
                      <div>Description</div>
                      <div>Amount</div>
                      <div className="text-right">Receipt</div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 p-4 border-b text-sm">
                      <div>April 15, 2025</div>
                      <div>Professional Plan - Monthly</div>
                      <div>$49.00</div>
                      <div className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          Download
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 p-4 border-b text-sm">
                      <div>March 15, 2025</div>
                      <div>Professional Plan - Monthly</div>
                      <div>$49.00</div>
                      <div className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          Download
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 p-4 text-sm">
                      <div>February 15, 2025</div>
                      <div>Professional Plan - Monthly</div>
                      <div>$49.00</div>
                      <div className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Security */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Password</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      
                      <div>
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      
                      <div>
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      
                      <Button>Update Password</Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch id="2fa" defaultChecked={false} />
                  </div>
                  
                  {isAdmin && (
                    <>
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Security Policies</h3>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="require-complex">Require Complex Passwords</Label>
                              <p className="text-sm text-muted-foreground">
                                Passwords must contain at least 8 characters, including uppercase, lowercase, numbers, and symbols
                              </p>
                            </div>
                            <Switch id="require-complex" defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="password-expiry">Password Expiration</Label>
                              <p className="text-sm text-muted-foreground">
                                Require users to change passwords periodically
                              </p>
                            </div>
                            <Switch id="password-expiry" defaultChecked={false} />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="session-timeout">Session Timeout</Label>
                              <p className="text-sm text-muted-foreground">
                                Automatically log users out after a period of inactivity
                              </p>
                            </div>
                            <Select defaultValue="60">
                              <SelectTrigger id="session-timeout" className="w-[160px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="30">30 minutes</SelectItem>
                                <SelectItem value="60">60 minutes</SelectItem>
                                <SelectItem value="120">2 hours</SelectItem>
                                <SelectItem value="240">4 hours</SelectItem>
                                <SelectItem value="never">Never</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              
              {isAdmin && (
                <Card>
                  <CardHeader>
                    <CardTitle>Audit Log</CardTitle>
                    <CardDescription>
                      Track significant actions taken within the system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium text-sm">
                        <div className="col-span-2">Date & Time</div>
                        <div className="col-span-2">User</div>
                        <div className="col-span-2">Action</div>
                        <div className="col-span-6">Details</div>
                      </div>
                      
                      <div className="grid grid-cols-12 gap-4 p-4 border-b text-sm">
                        <div className="col-span-2">May 4, 2025<br/>10:15 AM</div>
                        <div className="col-span-2">John Smith</div>
                        <div className="col-span-2">User Created</div>
                        <div className="col-span-6">Created user account for sarah@example.com</div>
                      </div>
                      
                      <div className="grid grid-cols-12 gap-4 p-4 border-b text-sm">
                        <div className="col-span-2">May 3, 2025<br/>2:30 PM</div>
                        <div className="col-span-2">John Smith</div>
                        <div className="col-span-2">Setting Changed</div>
                        <div className="col-span-6">Updated reservation confirmation settings</div>
                      </div>
                      
                      <div className="grid grid-cols-12 gap-4 p-4 text-sm">
                        <div className="col-span-2">May 2, 2025<br/>9:45 AM</div>
                        <div className="col-span-2">Jane Doe</div>
                        <div className="col-span-2">Login</div>
                        <div className="col-span-6">Successful login from new device (192.168.1.45)</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-4">
                      <Button variant="outline">
                        View Full Audit Log
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          
          {/* My Account */}
          {activeTab === 'account' && (
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Manage your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                  <div className="text-center md:text-left">
                    <Avatar className="h-24 w-24 mx-auto md:mx-0">
                      <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                      <AvatarFallback className="text-2xl">{currentUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="mt-4">
                      <Button variant="outline" size="sm">
                        Change Avatar
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={currentUser.name} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={currentUser.email} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" defaultValue="+1 (555) 987-6543" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" value={currentUser.role} disabled className="bg-muted" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        placeholder="Add a short bio..."
                        defaultValue="Restaurant manager with 10+ years of experience in fine dining."
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button className="bg-brand hover:bg-brand-muted">
                        Update Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
