
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Clock, Users, ChevronsUp, Bell, List } from 'lucide-react';
import { mockDailySummaries } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardTableStatus from '@/components/dashboard/DashboardTableStatus';
import DashboardUpcomingReservations from '@/components/dashboard/DashboardUpcomingReservations';
import { useRealtime } from '@/context/RealtimeContext';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const Dashboard: React.FC = () => {
  const { tables, reservations } = useRealtime();
  const [statsUpdate, setStatsUpdate] = useState<string | null>(null);
  
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

  // Simulated waitlist data
  const [waitlist, setWaitlist] = useState([
    { id: 'w1', name: 'Johnson Party', size: 3, time: '12:45', waitTime: '15-20 min' },
    { id: 'w2', name: 'Garcia Family', size: 5, time: '13:10', waitTime: '25-30 min' }
  ]);

  // Simulate adding to waitlist
  const addToWaitlist = () => {
    const names = ['Smith', 'Brown', 'Jones', 'Miller', 'Wilson'];
    const sizes = [2, 3, 4, 5];
    const randomName = names[Math.floor(Math.random() * names.length)];
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}`;
    
    const newParty = {
      id: `w${Date.now()}`,
      name: `${randomName} Party`,
      size: sizes[Math.floor(Math.random() * sizes.length)],
      time: formattedTime,
      waitTime: '35-40 min'
    };
    
    setWaitlist([...waitlist, newParty]);
    setStatsUpdate('waitlist');
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
          <Button variant="outline" onClick={addToWaitlist}>
            <Plus className="mr-2 h-4 w-4" />
            Add to Waitlist
          </Button>
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
                Average wait: 25 minutes
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
              <Button variant="outline" size="sm" className="h-8" onClick={addToWaitlist}>
                <Plus className="h-3 w-3 mr-1" />
                Add Party
              </Button>
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
                      className="p-3 border border-amber-100 bg-amber-50/50 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium">{party.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>Party of {party.size}</span>
                          <span>•</span>
                          <span>Added {party.time}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-amber-100 border-amber-300 text-amber-800">
                        {party.waitTime}
                      </Badge>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Table Status</CardTitle>
          <CardDescription>Current overview of all tables</CardDescription>
        </CardHeader>
        <CardContent>
          <DashboardTableStatus tables={tables} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
