
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockDailySummaries, mockCustomers } from '@/data/mockData';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { format, subDays, subMonths } from 'date-fns';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Calendar as CalendarIcon, 
  Download, 
  Filter, 
  BarChart as BarChartIcon, 
  PieChart as PieChartIcon
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

// Define date range presets
const DATE_RANGE_PRESETS = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  LAST_7_DAYS: 'last_7_days',
  LAST_30_DAYS: 'last_30_days',
  THIS_MONTH: 'this_month',
  LAST_MONTH: 'last_month',
  YEAR_TO_DATE: 'year_to_date'
};

// Color constants
const COLORS = {
  primary: '#9b87f5',
  secondary: '#7E69AB',
  tertiary: '#F97316',
  quaternary: '#33C3F0',
  positive: '#10B981',
  negative: '#EF4444',
  neutral: '#6B7280',
  pieColors: ['#9b87f5', '#7E69AB', '#F97316', '#33C3F0', '#10B981', '#6366F1', '#F59E0B']
};

const Reports: React.FC = () => {
  // State for filters and date range
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState<{start: Date, end: Date}>({
    start: subDays(new Date(), 7),
    end: new Date()
  });
  const [dateRangePreset, setDateRangePreset] = useState(DATE_RANGE_PRESETS.LAST_7_DAYS);
  const [timeOfDayFilter, setTimeOfDayFilter] = useState('all');
  const [dayOfWeekFilter, setDayOfWeekFilter] = useState('all');
  const [tableLocationFilter, setTableLocationFilter] = useState('all');
  const [reservationSourceFilter, setReservationSourceFilter] = useState('all');
  const [customerTagFilter, setCustomerTagFilter] = useState('all');
  
  // Handle date range preset selection
  const handleDateRangePreset = (preset: string) => {
    const today = new Date();
    let start = new Date();
    let end = new Date();
    
    switch(preset) {
      case DATE_RANGE_PRESETS.TODAY:
        start = today;
        end = today;
        break;
      case DATE_RANGE_PRESETS.YESTERDAY:
        start = subDays(today, 1);
        end = subDays(today, 1);
        break;
      case DATE_RANGE_PRESETS.LAST_7_DAYS:
        start = subDays(today, 6);
        break;
      case DATE_RANGE_PRESETS.LAST_30_DAYS:
        start = subDays(today, 29);
        break;
      case DATE_RANGE_PRESETS.THIS_MONTH:
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case DATE_RANGE_PRESETS.LAST_MONTH:
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case DATE_RANGE_PRESETS.YEAR_TO_DATE:
        start = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        start = subDays(today, 6);
    }
    
    setDateRange({ start, end });
    setDateRangePreset(preset);
  };
  
  // Data for charts
  const summaries = [...mockDailySummaries].reverse();
  
  // Guest & Reservation Trends Data
  const visitData = summaries.map(summary => ({
    date: summary.date.split('-')[2], // Just the day for brevity
    guests: summary.totalCustomers,
    reservations: summary.totalReservations
  }));
  
  // Customer Satisfaction Data
  const ratingData = summaries.map(summary => ({
    date: summary.date.split('-')[2],
    rating: summary.avgRating
  }));
  
  // Customer Loyalty Distribution Data
  const customerVisitsDistribution = [
    { name: '1 visit', value: mockCustomers.filter(c => c.visits === 1).length },
    { name: '2-5 visits', value: mockCustomers.filter(c => c.visits >= 2 && c.visits <= 5).length },
    { name: '6-10 visits', value: mockCustomers.filter(c => c.visits >= 6 && c.visits <= 10).length },
    { name: '10+ visits', value: mockCustomers.filter(c => c.visits > 10).length },
  ];
  
  // Reservation Status Data
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
  
  // Rating Distribution Data
  const ratingDistribution = [
    { rating: '5 Stars', count: summaries.reduce((sum, day) => sum + (day.positiveReviews || 0), 0) },
    { rating: '4 Stars', count: Math.floor(summaries.reduce((sum, day) => sum + (day.positiveReviews || 0) * 0.4, 0)) },
    { rating: '3 Stars', count: Math.floor(summaries.reduce((sum, day) => sum + (day.totalReservations || 0) * 0.1, 0)) },
    { rating: '2 Stars', count: Math.floor(summaries.reduce((sum, day) => sum + (day.negativeReviews || 0) * 0.4, 0)) },
    { rating: '1 Star', count: summaries.reduce((sum, day) => sum + (day.negativeReviews || 0), 0) },
  ];
  
  // Feedback Type Data
  const feedbackTypeData = [
    { name: 'Positive', value: summaries.reduce((sum, day) => sum + day.positiveReviews, 0) },
    { name: 'Negative', value: summaries.reduce((sum, day) => sum + day.negativeReviews, 0) },
    { name: 'Suggestions', value: Math.floor(summaries.reduce((sum, day) => sum + day.totalCustomers * 0.05, 0)) },
  ];
  
  // Reservation by Day Data (Mock)
  const reservationByDay = [
    { name: 'Mon', reservations: 45 },
    { name: 'Tue', reservations: 52 },
    { name: 'Wed', reservations: 49 },
    { name: 'Thu', reservations: 63 },
    { name: 'Fri', reservations: 85 },
    { name: 'Sat', reservations: 125 },
    { name: 'Sun', reservations: 98 },
  ];
  
  // Reservation by Hour Data (Mock)
  const reservationByHour = [
    { hour: '11:00', lunch: 12, dinner: 0 },
    { hour: '12:00', lunch: 18, dinner: 0 },
    { hour: '13:00', lunch: 15, dinner: 0 },
    { hour: '14:00', lunch: 8, dinner: 0 },
    { hour: '17:00', lunch: 0, dinner: 10 },
    { hour: '18:00', lunch: 0, dinner: 25 },
    { hour: '19:00', lunch: 0, dinner: 38 },
    { hour: '20:00', lunch: 0, dinner: 28 },
    { hour: '21:00', lunch: 0, dinner: 15 },
    { hour: '22:00', lunch: 0, dinner: 5 },
  ];
  
  // Calculate KPIs
  const totalReservations = summaries.reduce((sum, day) => sum + day.totalReservations, 0);
  const totalCustomers = summaries.reduce((sum, day) => sum + day.totalCustomers, 0);
  const avgPartySize = totalCustomers / totalReservations;
  const avgRating = summaries.reduce((sum, day) => sum + day.avgRating, 0) / summaries.length;
  const completionRate = reservationStatus[0].value / (reservationStatus[0].value + reservationStatus[1].value + reservationStatus[2].value) * 100;
  const cancellationRate = reservationStatus[1].value / (reservationStatus[0].value + reservationStatus[1].value + reservationStatus[2].value) * 100;
  const noShowRate = reservationStatus[2].value / (reservationStatus[0].value + reservationStatus[1].value + reservationStatus[2].value) * 100;
  
  // Helper function to format date range for display
  const formatDateRange = () => {
    if (dateRangePreset === DATE_RANGE_PRESETS.TODAY) return 'Today';
    if (dateRangePreset === DATE_RANGE_PRESETS.YESTERDAY) return 'Yesterday';
    
    return `${format(dateRange.start, 'MMM d, yyyy')} - ${format(dateRange.end, 'MMM d, yyyy')}`;
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Performance insights for {formatDateRange()}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Date Range</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-4 border-b">
                <div className="space-y-2">
                  <h4 className="font-medium">Select Range</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={dateRangePreset === DATE_RANGE_PRESETS.TODAY ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => handleDateRangePreset(DATE_RANGE_PRESETS.TODAY)}
                    >
                      Today
                    </Button>
                    <Button 
                      variant={dateRangePreset === DATE_RANGE_PRESETS.YESTERDAY ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => handleDateRangePreset(DATE_RANGE_PRESETS.YESTERDAY)}
                    >
                      Yesterday
                    </Button>
                    <Button 
                      variant={dateRangePreset === DATE_RANGE_PRESETS.LAST_7_DAYS ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => handleDateRangePreset(DATE_RANGE_PRESETS.LAST_7_DAYS)}
                    >
                      Last 7 Days
                    </Button>
                    <Button 
                      variant={dateRangePreset === DATE_RANGE_PRESETS.LAST_30_DAYS ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => handleDateRangePreset(DATE_RANGE_PRESETS.LAST_30_DAYS)}
                    >
                      Last 30 Days
                    </Button>
                    <Button 
                      variant={dateRangePreset === DATE_RANGE_PRESETS.THIS_MONTH ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => handleDateRangePreset(DATE_RANGE_PRESETS.THIS_MONTH)}
                    >
                      This Month
                    </Button>
                    <Button 
                      variant={dateRangePreset === DATE_RANGE_PRESETS.LAST_MONTH ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => handleDateRangePreset(DATE_RANGE_PRESETS.LAST_MONTH)}
                    >
                      Last Month
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 p-4">
                <div>
                  <p className="text-sm font-medium mb-2">Start Date</p>
                  <Calendar
                    mode="single"
                    selected={dateRange.start}
                    onSelect={(date) => date && setDateRange({ ...dateRange, start: date })}
                    className="border rounded-md"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">End Date</p>
                  <Calendar
                    mode="single"
                    selected={dateRange.end}
                    onSelect={(date) => date && setDateRange({ ...dateRange, end: date })}
                    className="border rounded-md"
                  />
                </div>
              </div>
              <div className="flex items-center p-4 border-t">
                <Button className="ml-auto">Apply Range</Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                <span>Filter</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Reports</h4>
                
                <div>
                  <h5 className="text-sm font-medium mb-1">Time of Day</h5>
                  <Select value={timeOfDayFilter} onValueChange={setTimeOfDayFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Hours" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Hours</SelectItem>
                      <SelectItem value="breakfast">Breakfast (6am-11am)</SelectItem>
                      <SelectItem value="lunch">Lunch (11am-3pm)</SelectItem>
                      <SelectItem value="dinner">Dinner (3pm-10pm)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium mb-1">Day of Week</h5>
                  <Select value={dayOfWeekFilter} onValueChange={setDayOfWeekFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Days</SelectItem>
                      <SelectItem value="weekday">Weekdays</SelectItem>
                      <SelectItem value="weekend">Weekends</SelectItem>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="tuesday">Tuesday</SelectItem>
                      <SelectItem value="wednesday">Wednesday</SelectItem>
                      <SelectItem value="thursday">Thursday</SelectItem>
                      <SelectItem value="friday">Friday</SelectItem>
                      <SelectItem value="saturday">Saturday</SelectItem>
                      <SelectItem value="sunday">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium mb-1">Table Location</h5>
                  <Select value={tableLocationFilter} onValueChange={setTableLocationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="main">Main Dining</SelectItem>
                      <SelectItem value="patio">Patio</SelectItem>
                      <SelectItem value="bar">Bar Area</SelectItem>
                      <SelectItem value="private">Private Dining</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium mb-1">Reservation Source</h5>
                  <Select value={reservationSourceFilter} onValueChange={setReservationSourceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Sources" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="walk-in">Walk-in</SelectItem>
                      <SelectItem value="third-party">Third-party App</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium mb-1">Customer Tag</h5>
                  <Select value={customerTagFilter} onValueChange={setCustomerTagFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Customers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="wine-enthusiast">Wine Enthusiast</SelectItem>
                      <SelectItem value="special-occasion">Special Occasion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button variant="outline">Reset</Button>
                  <Button>Apply Filters</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      {/* KPIs Overview Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Total Reservations</p>
              <h3 className="text-2xl font-bold">{totalReservations}</h3>
              <p className="text-xs text-muted-foreground">+5% from last period</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Total Customers</p>
              <h3 className="text-2xl font-bold">{totalCustomers}</h3>
              <p className="text-xs text-muted-foreground">+8% from last period</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Avg Party Size</p>
              <h3 className="text-2xl font-bold">{avgPartySize.toFixed(1)}</h3>
              <p className="text-xs text-muted-foreground">-0.2 from last period</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Avg Customer Rating</p>
              <h3 className="text-2xl font-bold">{avgRating.toFixed(1)}/5</h3>
              <p className="text-xs text-muted-foreground">+0.3 from last period</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Report Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 w-full mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  Guest & Reservation Trends
                  <Badge variant="outline" className="ml-2">Last 7 Days</Badge>
                </CardTitle>
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
                    <Bar dataKey="guests" name="Total Guests" fill={COLORS.primary} />
                    <Bar dataKey="reservations" name="Reservations" fill={COLORS.secondary} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  Customer Satisfaction
                  <Badge variant="outline" className="ml-2">Last 7 Days</Badge>
                </CardTitle>
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
                      stroke={COLORS.tertiary}
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
                <CardTitle className="flex justify-between">
                  Customer Loyalty Distribution
                  <Badge variant="outline" className="ml-2">All Customers</Badge>
                </CardTitle>
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
                        <Cell key={`cell-${index}`} fill={COLORS.pieColors[index % COLORS.pieColors.length]} />
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
                <CardTitle className="flex justify-between">
                  Reservation Outcomes
                  <Badge variant="outline" className="ml-2">Last 7 Days</Badge>
                </CardTitle>
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
                        <Cell key={`cell-${index}`} fill={COLORS.pieColors[index % COLORS.pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="grid grid-cols-3 w-full text-center text-sm">
                  <div>
                    <p className="text-muted-foreground">Completion</p>
                    <p className="font-medium text-positive">{completionRate.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Cancellation</p>
                    <p className="font-medium text-negative">{cancellationRate.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">No-show</p>
                    <p className="font-medium text-negative">{noShowRate.toFixed(1)}%</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Reservations Tab Content */}
        <TabsContent value="reservations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Reservations by Day of Week</CardTitle>
                <CardDescription>Distribution of reservations across weekdays</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reservationByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="reservations" name="Reservations" fill={COLORS.primary} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Reservations by Hour</CardTitle>
                <CardDescription>Peak reservation times by hour and service</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reservationByHour}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="lunch" name="Lunch Service" stackId="a" fill={COLORS.primary} />
                    <Bar dataKey="dinner" name="Dinner Service" stackId="a" fill={COLORS.secondary} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Reservation Details</CardTitle>
                <CardDescription>Raw reservation data for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Total Reservations</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Cancelled</TableHead>
                      <TableHead>No-show</TableHead>
                      <TableHead>Total Guests</TableHead>
                      <TableHead>Avg Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summaries.map((day) => (
                      <TableRow key={day.date}>
                        <TableCell>{day.date}</TableCell>
                        <TableCell>{day.totalReservations}</TableCell>
                        <TableCell>{day.completedReservations}</TableCell>
                        <TableCell>{day.cancelledReservations}</TableCell>
                        <TableCell>{day.noShowReservations}</TableCell>
                        <TableCell>{day.totalCustomers}</TableCell>
                        <TableCell>{day.avgRating.toFixed(1)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Customers Tab Content */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>New vs Returning Customers</CardTitle>
                <CardDescription>Customer acquisition and retention trend</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={summaries.map(s => ({
                    date: s.date.split('-')[2],
                    new: s.newCustomers,
                    returning: s.totalCustomers - s.newCustomers
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="new" name="New Customers" stackId="1" stroke={COLORS.tertiary} fill={COLORS.tertiary} />
                    <Area type="monotone" dataKey="returning" name="Returning Customers" stackId="1" stroke={COLORS.primary} fill={COLORS.primary} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Customer Visit Frequency</CardTitle>
                <CardDescription>Distribution of customers by visit count</CardDescription>
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
                        <Cell key={`cell-${index}`} fill={COLORS.pieColors[index % COLORS.pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
                <CardDescription>Customers with most visits</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Visits</TableHead>
                      <TableHead>Last Visit</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Loyalty Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCustomers
                      .sort((a, b) => b.visits - a.visits)
                      .slice(0, 10)
                      .map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell>{customer.firstName} {customer.lastName}</TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell>{customer.visits}</TableCell>
                          <TableCell>{customer.lastVisit || 'N/A'}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {customer.tags.map(tag => (
                                <Badge key={tag} variant="outline">{tag}</Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{customer.loyaltyPoints}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Feedback Tab Content */}
        <TabsContent value="feedback" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rating Distribution</CardTitle>
                <CardDescription>Breakdown of customer ratings</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" name="Number of Reviews" fill={COLORS.tertiary} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Feedback Type Analysis</CardTitle>
                <CardDescription>Distribution of feedback categories</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={feedbackTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {feedbackTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.positive : index === 1 ? COLORS.negative : COLORS.neutral} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Customer Satisfaction Trend</CardTitle>
                <CardDescription>Rating trend over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={summaries.map(s => ({
                    date: s.date,
                    rating: s.avgRating,
                    positive: s.positiveReviews,
                    negative: s.negativeReviews
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" domain={[0, 5]} />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="rating" name="Avg Rating" stroke={COLORS.tertiary} strokeWidth={2} dot={{ r: 4 }} />
                    <Line yAxisId="right" type="monotone" dataKey="positive" name="Positive Reviews" stroke={COLORS.positive} />
                    <Line yAxisId="right" type="monotone" dataKey="negative" name="Negative Reviews" stroke={COLORS.negative} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Operations Tab Content */}
        <TabsContent value="operations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Table Utilization</CardTitle>
                <CardDescription>Percentage of time tables are occupied</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Main Dining', utilization: 78 },
                    { name: 'Patio', utilization: 65 },
                    { name: 'Bar Area', utilization: 85 },
                    { name: 'Private Room', utilization: 42 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="utilization" name="Utilization %" fill={COLORS.primary} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Wait Time Analysis</CardTitle>
                <CardDescription>Average wait times by hour</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { hour: '17:00', waitTime: 5 },
                    { hour: '18:00', waitTime: 15 },
                    { hour: '19:00', waitTime: 25 },
                    { hour: '20:00', waitTime: 20 },
                    { hour: '21:00', waitTime: 10 },
                    { hour: '22:00', waitTime: 5 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="waitTime" name="Wait Time (mins)" stroke={COLORS.secondary} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Staff Performance</CardTitle>
                <CardDescription>Covers and ratings by staff member</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Covers Served</TableHead>
                      <TableHead>Tables Managed</TableHead>
                      <TableHead>Avg Rating</TableHead>
                      <TableHead>Positive Reviews</TableHead>
                      <TableHead>Negative Reviews</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>John Doe</TableCell>
                      <TableCell>248</TableCell>
                      <TableCell>62</TableCell>
                      <TableCell>4.7</TableCell>
                      <TableCell>18</TableCell>
                      <TableCell>2</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Jane Smith</TableCell>
                      <TableCell>215</TableCell>
                      <TableCell>54</TableCell>
                      <TableCell>4.9</TableCell>
                      <TableCell>21</TableCell>
                      <TableCell>0</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Alex Johnson</TableCell>
                      <TableCell>193</TableCell>
                      <TableCell>48</TableCell>
                      <TableCell>4.5</TableCell>
                      <TableCell>14</TableCell>
                      <TableCell>3</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Sarah Williams</TableCell>
                      <TableCell>227</TableCell>
                      <TableCell>57</TableCell>
                      <TableCell>4.6</TableCell>
                      <TableCell>16</TableCell>
                      <TableCell>2</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
