
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Clock, Users, ChevronsUp } from 'lucide-react';
import { mockDailySummaries } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardTableStatus from '@/components/dashboard/DashboardTableStatus';
import DashboardUpcomingReservations from '@/components/dashboard/DashboardUpcomingReservations';
import { useRealtime } from '@/context/RealtimeContext';

const Dashboard: React.FC = () => {
  const { tables, reservations } = useRealtime();
  
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
          <Link to="/customers/new">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              New Customer
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stats-card">
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
        
        <Card className="stats-card">
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
        
        <Card className="stats-card">
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
        
        <Card className="stats-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{todaySummary.avgRating.toFixed(1)}/5.0</div>
              <ChevronsUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {todaySummary.positiveReviews} positive, {todaySummary.negativeReviews} negative
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Guest Trends</CardTitle>
            <CardDescription>Total daily guest count over the last week</CardDescription>
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
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Reservations</CardTitle>
            <CardDescription>Next reservations for today</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardUpcomingReservations reservations={upcomingReservations} />
          </CardContent>
        </Card>
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
