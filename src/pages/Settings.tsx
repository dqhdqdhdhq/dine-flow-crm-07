import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner';
import { Table as TableType } from '@/types';

const Settings: React.FC = () => {
  const [restaurantName, setRestaurantName] = useState("Lovable Restaurant");
  const [theme, setTheme] = useState("light");
  const [volume, setVolume] = useState(50);
  const [tables, setTables] = useState<TableType[]>([]);
  const [location, setLocation] = useState("Main");
  const [capacity, setCapacity] = useState("4");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Load tables from local storage on component mount
    const storedTables = localStorage.getItem('tables');
    if (storedTables) {
      setTables(JSON.parse(storedTables));
    } else {
      // Initialize with default tables if nothing is stored
      setTables(defaultTables);
    }
  }, []);

  useEffect(() => {
    // Save tables to local storage whenever tables state changes
    localStorage.setItem('tables', JSON.stringify(tables));
  }, [tables]);

  const defaultTables = [
    { id: 'table-1', number: 1, capacity: 4, status: 'available', location: 'Main', section: 'Main' },
    { id: 'table-2', number: 2, capacity: 2, status: 'available', location: 'Bar', section: 'Bar' }, 
    { id: 'table-3', number: 3, capacity: 6, status: 'available', location: 'Patio', section: 'Patio' },
    { id: 'table-4', number: 4, capacity: 8, status: 'available', location: 'Main', section: 'Main' },
    { id: 'table-5', number: 5, capacity: 4, status: 'available', location: 'Private', section: 'Private' },
    { id: 'table-6', number: 6, capacity: 2, status: 'available', location: 'Bar', section: 'Bar' }
  ];

  const handleAddTable = () => {
    if (!capacity || !location) {
      toast.error('Please fill in all fields.');
      return;
    }

    const newTable = {
      id: `table-${Date.now()}`,
      number: tables.length + 1,
      capacity: Number(capacity),
      status: 'available',
      location: location,
      section: location // Using location as section for now
    };

    setTables([...tables, newTable]);
    setLocation("");
    setCapacity("");
    setIsDialogOpen(false);
    toast.success('Table added successfully!');
  };

  const handleDeleteTable = (tableId: string) => {
    setTables(tables.filter(table => table.id !== tableId));
    toast.success('Table deleted successfully!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="restaurantName">Restaurant Name</Label>
              <Input
                type="text"
                id="restaurantName"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="volume">Volume</Label>
            <Slider
              id="volume"
              defaultValue={[volume]}
              max={100}
              step={1}
              onValueChange={(value) => setVolume(value[0])}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="notifications" defaultChecked />
            <Label htmlFor="notifications">Enable Notifications</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tables</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of your tables.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Number</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Section</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tables.map((table) => (
                <TableRow key={table.id}>
                  <TableCell className="font-medium">{table.number}</TableCell>
                  <TableCell>{table.capacity}</TableCell>
                  <TableCell>{table.location}</TableCell>
                   <TableCell>{table.section}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the table from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteTable(table.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={() => setIsDialogOpen(true)} className="mt-4">Add Table</Button>
        </CardContent>
      </Card>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Table</AlertDialogTitle>
            <AlertDialogDescription>
              Add a new table to your restaurant.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                Capacity
              </Label>
              <Input id="capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsDialogOpen(false);
              setLocation("");
              setCapacity("");
            }}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddTable}>Add</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
