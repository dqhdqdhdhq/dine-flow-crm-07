
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Clock, Users, ChevronsUp, Bell, List, Edit } from 'lucide-react';
import { mockDailySummaries } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardTableStatus from '@/components/dashboard/DashboardTableStatus';
import DashboardUpcomingReservations from '@/components/dashboard/DashboardUpcomingReservations';
import { useRealtime } from '@/context/RealtimeContext';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import AddToWaitlistDialog from '@/components/dashboard/AddToWaitlistDialog';
import { Table } from '@/types';
import { toast } from 'sonner';

// Interface for waitlist party
interface WaitlistParty {
  id: string;
  name: string;
  size: number;
  time: string;
  waitTime: string;
  notes?: string;
}

// Interface for edit waitlist party dialog props
interface EditWaitlistPartyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  party: WaitlistParty | null;
  onSave: (party: WaitlistParty) => void;
}

// Edit Waitlist Party Dialog Component
const EditWaitlistPartyDialog: React.FC<EditWaitlistPartyDialogProps> = ({ 
  isOpen, 
  onClose, 
  party, 
  onSave 
}) => {
  const [name, setName] = useState('');
  const [size, setSize] = useState('2');
  const [waitTime, setWaitTime] = useState('15-20 min');
  const [notes, setNotes] = useState('');
  
  useEffect(() => {
    if (party) {
      setName(party.name);
      setSize(party.size.toString());
      setWaitTime(party.waitTime);
      setNotes(party.notes || '');
    }
  }, [party]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (party) {
      onSave({
        ...party,
        name,
        size: parseInt(size),
        waitTime,
        notes
      });
    }
    onClose();
  };
  
  if (!party) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Waitlist Party</DialogTitle>
          <DialogDescription>
            Update the waitlist party details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-party-name">Party Name</Label>
              <Input
                id="edit-party-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Smith Party"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-party-size">Party Size</Label>
              <select
                id="edit-party-size"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((size) => (
                  <option key={size} value={size}>
                    {size} {size === 1 ? "person" : "people"}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-wait-time">Estimated Wait Time</Label>
              <select
                id="edit-wait-time"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={waitTime}
                onChange={(e) => setWaitTime(e.target.value)}
              >
                <option value="5-10 min">5-10 minutes</option>
                <option value="10-15 min">10-15 minutes</option>
                <option value="15-20 min">15-20 minutes</option>
                <option value="20-30 min">20-30 minutes</option>
                <option value="30-45 min">30-45 minutes</option>
                <option value="45-60 min">45-60 minutes</option>
                <option value="60+ min">Over 60 minutes</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes (Optional)</Label>
              <Input
                id="edit-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Dashboard: React.FC = () => {
  const { tables, reservations, updateTable } = useRealtime();
  const [statsUpdate, setStatsUpdate] = useState<string | null>(null);
  const [editingWaitlistParty, setEditingWaitlistParty] = useState<WaitlistParty | null>(null);
  const [isEditWaitlistDialogOpen, setIsEditWaitlistDialogOpen] = useState(false);
  
  const todaySummary = mockDailySummaries[0];
  const visitsData = mockDailySummaries.map(summary => ({
    name: summary.date.split('-')[2], // Just the day number for brevity
    guests: summary.totalCustomers
  })).reverse();
  
  const availableTables = tables.filter(table => table.status === 'available').length;
  const occupiedTables = tables.filter(table => table.status === 'occupied').length;
  const reservedTables = tables.filter(table => table.status === 'reserved').length;
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Filter reservations for today that are confirmed or pending
  const upcomingReservations = reservations
    .filter(res => 
      (res.status === 'confirmed' || res.status === 'pending') && 
      res.date === today
    )
    .sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.time}`);
      const dateTimeB = new Date(`${b.date}T${b.time}`);
      return dateTimeA.getTime() - dateTimeB.getTime();
    })
    .slice(0, 5);

  // Waitlist data
  const [waitlist, setWaitlist] = useState<WaitlistParty[]>([
    { id: 'w1', name: 'Johnson Party', size: 3, time: '12:45', waitTime: '15-20 min' },
    { id: 'w2', name: 'Garcia Family', size: 5, time: '13:10', waitTime: '25-30 min' }
  ]);

  // Add to waitlist
  const addToWaitlist = (party: { name: string; size: number; notes?: string }) => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}`;
    
    const newParty: WaitlistParty = {
      id: `w${Date.now()}`,
      name: party.name,
      size: party.size,
      time: formattedTime,
      waitTime: estimateWaitTime(party.size),
      notes: party.notes
    };
    
    setWaitlist([...waitlist, newParty]);
    setStatsUpdate('waitlist');
    
    toast.success(`Added ${party.name} to waitlist`, {
      description: `Party of ${party.size}, wait time: ${newParty.waitTime}`,
    });
  };

  // Helper function to estimate wait time based on party size and available tables
  const estimateWaitTime = (partySize: number): string => {
    const suitableTables = tables.filter(t => t.capacity >= partySize && t.status === 'available').length;
    
    if (suitableTables > 1) return "5-10 min";
    if (suitableTables === 1) return "10-15 min";
    
    const occupiedCount = tables.filter(t => t.capacity >= partySize && t.status === 'occupied').length;
    
    if (occupiedCount <= 1) return "15-20 min";
    if (occupiedCount <= 3) return "20-30 min";
    return "30-45 min";
  };
  
  // Edit waitlist party
  const editWaitlistParty = (party: WaitlistParty) => {
    setEditingWaitlistParty(party);
    setIsEditWaitlistDialogOpen(true);
  };
  
  // Save edited waitlist party
  const saveEditedWaitlistParty = (updatedParty: WaitlistParty) => {
    const updatedWaitlist = waitlist.map(party => 
      party.id === updatedParty.id ? updatedParty : party
    );
    setWaitlist(updatedWaitlist);
    toast.success(`Updated ${updatedParty.name} on waitlist`);
  };
  
  // Remove from waitlist
  const removeFromWaitlist = (id: string) => {
    const party = waitlist.find(p => p.id === id);
    setWaitlist(waitlist.filter(p => p.id !== id));
    if (party) {
      toast.success(`Removed ${party.name} from waitlist`);
    }
  };

  // Seat party from waitlist
  const seatWaitlistParty = (party: WaitlistParty) => {
    // Find a suitable table
    const availableTable = tables.find(table => 
      table.status === 'available' && table.capacity >= party.size
    );
    
    if (availableTable) {
      // Update table status
      updateTable({
        ...availableTable,
        status: 'occupied'
      });
      
      // Remove from waitlist
      removeFromWaitlist(party.id);
      
      toast.success(`${party.name} seated at Table ${availableTable.number}`);
    } else {
      toast.error(`No suitable tables available for ${party.name}`);
    }
  };

  // Effect to trigger animation after stats update
  useEffect(() => {
    if (statsUpdate) {
      const timer = setTimeout(() => {
        setStatsUpdate(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [statsUpdate]);

  // Style for animated stats
  const getAnimationStyle = (type: string) => {
    return statsUpdate === type ? { scale: [1, 1.05, 1] } : {};
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Restaurant overview for {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/reservations/new">
            <Button className="bg-brand hover:bg-brand-muted">
              <Plus className="mr-2 h-4 w-4" />
              New Reservation
            </Button>
          </Link>
          <AddToWaitlistDialog onAddParty={addToWaitlist} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          animate={getAnimationStyle('tables')}
          transition={{ duration: 0.5 }}
        >
          <Card className="stats-card h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tables Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{availableTables} / {tables.length}</div>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {occupiedTables} occupied, {reservedTables} reserved
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          animate={getAnimationStyle('reservations')}
          transition={{ duration: 0.5 }}
        >
          <Card className="stats-card h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Reservations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{todaySummary.totalReservations}</div>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {todaySummary.completedReservations} completed, {todaySummary.cancelledReservations} cancelled
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          animate={getAnimationStyle('guests')}
          transition={{ duration: 0.5 }}
        >
          <Card className="stats-card h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Guests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{todaySummary.totalCustomers}</div>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {todaySummary.newCustomers} new customers today
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          animate={getAnimationStyle('waitlist')}
          transition={{ duration: 0.5 }}
        >
          <Card className="stats-card h-full border-amber-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Waitlist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{waitlist.length} parties</div>
                <List className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Average wait: {waitlist.length ? "~25 minutes" : "No wait"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Guest Trends</CardTitle>
              <CardDescription>Total daily guest count over the last week</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="h-8">
              View Details
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={visitsData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="guests" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Upcoming Reservations</CardTitle>
                <CardDescription>Next reservations for today</CardDescription>
              </div>
              <Link to="/reservations">
                <Button variant="ghost" size="sm" className="h-8 text-brand">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <DashboardUpcomingReservations reservations={upcomingReservations} />
            </CardContent>
          </Card>
          
          <Card className="border-amber-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Waitlist</CardTitle>
                <CardDescription>Current parties waiting</CardDescription>
              </div>
              <AddToWaitlistDialog onAddParty={addToWaitlist} />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {waitlist.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No parties on waitlist
                  </div>
                ) : (
                  waitlist.map((party, index) => (
                    <motion.div 
                      key={party.id}
                      initial={index >= waitlist.length - 1 ? { opacity: 0, y: 10 } : { opacity: 1 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 border border-amber-100 bg-amber-50/50 rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{party.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <span>Party of {party.size}</span>
                            <span>•</span>
                            <span>Added {party.time}</span>
                          </div>
                          {party.notes && (
                            <div className="text-xs italic mt-1 text-muted-foreground">
                              {party.notes}
                            </div>
                          )}
                        </div>
                        <Badge variant="outline" className="bg-amber-100 border-amber-300 text-amber-800">
                          {party.waitTime}
                        </Badge>
                      </div>
                      
                      <div className="mt-3 flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 text-xs"
                          onClick={() => editWaitlistParty(party)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 text-xs bg-destructive/10 border-destructive/20 hover:bg-destructive/20 text-destructive"
                          onClick={() => removeFromWaitlist(party.id)}
                        >
                          Remove
                        </Button>
                        <Button 
                          size="sm" 
                          className="h-7 text-xs"
                          onClick={() => seatWaitlistParty(party)}
                        >
                          Seat Now
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle>Table Status</CardTitle>
            <CardDescription>Current overview of all tables</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <DashboardTableStatus tables={tables} />
        </CardContent>
      </Card>
      
      {/* Edit Waitlist Party Dialog */}
      <EditWaitlistPartyDialog 
        isOpen={isEditWaitlistDialogOpen}
        onClose={() => setIsEditWaitlistDialogOpen(false)}
        party={editingWaitlistParty}
        onSave={saveEditedWaitlistParty}
      />
    </div>
  );
};

// Import for the Dialog components used above
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default Dashboard;
