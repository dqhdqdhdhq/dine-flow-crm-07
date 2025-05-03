
import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { mockUsers } from '@/data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Settings: React.FC = () => {
  const [restaurantName, setRestaurantName] = useState('DineFlow Restaurant');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [autoConfirmation, setAutoConfirmation] = useState(true);
  const currentUser = mockUsers[0]; // Admin user
  
  const handleSaveSettings = () => {
    // In a real app, this would save the settings to the server
    console.log('Saving settings:', {
      restaurantName,
      emailNotifications,
      smsNotifications,
      autoConfirmation
    });
  };
  
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-6 grid grid-cols-3 max-w-md">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Information</CardTitle>
              <CardDescription>
                Basic information about your restaurant.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="restaurant-name">Restaurant Name</Label>
                <Input 
                  id="restaurant-name" 
                  value={restaurantName} 
                  onChange={(e) => setRestaurantName(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input id="contact-email" type="email" defaultValue="contact@dineflowrestaurant.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Contact Phone</Label>
                <Input id="contact-phone" type="tel" defaultValue="(555) 123-4567" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue="123 Restaurant Row, Foodie City, FC 12345" />
              </div>
              
              <div className="pt-4">
                <Button className="bg-brand hover:bg-brand-muted" onClick={handleSaveSettings}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Reservation Settings</CardTitle>
              <CardDescription>
                Configure how reservations are handled.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
              
              <div className="space-y-2">
                <Label htmlFor="reservation-interval">Reservation Time Interval (minutes)</Label>
                <Input id="reservation-interval" type="number" defaultValue="15" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="table-turnover">Default Table Turnover Time (minutes)</Label>
                <Input id="table-turnover" type="number" defaultValue="90" />
              </div>
              
              <div className="pt-4">
                <Button className="bg-brand hover:bg-brand-muted" onClick={handleSaveSettings}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you want to be notified about reservations and customers.
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
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="important-alerts">Important Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for high-priority events only
                  </p>
                </div>
                <Switch id="important-alerts" defaultChecked={true} />
              </div>
              
              <div className="pt-4">
                <Button className="bg-brand hover:bg-brand-muted" onClick={handleSaveSettings}>
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Manage your account details and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                  <AvatarFallback>{currentUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{currentUser.name}</p>
                  <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                  <p className="text-xs text-muted-foreground capitalize mt-1">Role: {currentUser.role}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={currentUser.name} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={currentUser.email} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              
              <div className="pt-4">
                <Button className="bg-brand hover:bg-brand-muted">
                  Update Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
