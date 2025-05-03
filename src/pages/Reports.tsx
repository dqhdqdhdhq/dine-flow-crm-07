
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockDailySummaries, mockCustomers } from '@/data/mockData';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Reports: React.FC = () => {
  // Data for charts
  const summaries = [...mockDailySummaries].reverse();
  const visitData = summaries.map(summary => ({
    date: summary.date.split('-')[2], // Just the day for brevity
    guests: summary.totalCustomers,
    reservations: summary.totalReservations
  }));
  
  const ratingData = summaries.map(summary => ({
    date: summary.date.split('-')[2],
    rating: summary.avgRating
  }));
  
  const customerVisitsDistribution = [
    { name: '1 visit', value: mockCustomers.filter(c => c.visits === 1).length },
    { name: '2-5 visits', value: mockCustomers.filter(c => c.visits >= 2 && c.visits <= 5).length },
    { name: '6-10 visits', value: mockCustomers.filter(c => c.visits >= 6 && c.visits <= 10).length },
    { name: '10+ visits', value: mockCustomers.filter(c => c.visits > 10).length },
  ];
  
  const reservationStatus = [
    { 
      name: 'Completed', 
      value: summaries.reduce((sum, day) => sum + day.completedReservations, 0)
    },
    { 
      name: 'Cancelled', 
      value: summaries.reduce((sum, day) => sum + day.cancelledReservations, 0)
    },
    { 
      name: 'No-show', 
      value: summaries.reduce((sum, day) => sum + day.noShowReservations, 0)
    },
  ];
  
  const COLORS = ['#9b87f5', '#7E69AB', '#F97316', '#33C3F0'];
  
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
      <p className="text-muted-foreground">
        Restaurant performance overview for the last 7 days
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Guest & Reservation Trends</CardTitle>
            <CardDescription>Daily comparison of guests and reservations</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="guests" name="Total Guests" fill="#9b87f5" />
                <Bar dataKey="reservations" name="Reservations" fill="#7E69AB" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Customer Satisfaction</CardTitle>
            <CardDescription>Average daily rating trend</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ratingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[3, 5]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rating"
                  name="Avg Rating"
                  stroke="#F97316"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Customer Loyalty Distribution</CardTitle>
            <CardDescription>Analysis of customer visit frequency</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerVisitsDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {customerVisitsDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Reservation Outcomes</CardTitle>
            <CardDescription>Completed vs cancelled vs no-shows</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reservationStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {reservationStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
