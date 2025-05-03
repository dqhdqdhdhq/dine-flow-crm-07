
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockCustomers, mockReservations, mockFeedback } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CalendarDays,
  ChevronLeft,
  Edit,
  Flag,
  MessageSquare,
  Phone,
  Mail,
  Star,
  Tag,
  AlertCircle,
  MessageCircle,
  Award,
  Heart,
} from 'lucide-react';

const CustomerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const customer = mockCustomers.find(c => c.id === id);

  // Get customer's reservations
  const customerReservations = mockReservations.filter(r => r.customerId === id);
  
  // Get customer's feedback
  const customerFeedback = mockFeedback.filter(f => f.customerId === id);

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h2 className="text-2xl font-semibold">Customer not found</h2>
        <p className="text-muted-foreground mt-2">The customer you're looking for doesn't exist or has been removed.</p>
        <Link to="/customers" className="mt-6">
          <Button variant="outline">Back to Customers</Button>
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getBadgeStyle = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'vip':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'regular':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'new customer':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300">Pending</Badge>;
      case 'seated':
        return <Badge className="bg-brand text-white">Seated</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Cancelled</Badge>;
      case 'no-show':
        return <Badge className="bg-red-100 text-red-800 border-red-300">No-Show</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button */}
      <div>
        <Link to="/customers">
          <Button variant="ghost" className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to Customers
          </Button>
        </Link>
      </div>
      
      {/* Customer Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {customer.firstName} {customer.lastName}
              </h1>
              {customer.tags.map((tag, i) => (
                <Badge key={i} className={getBadgeStyle(tag)}>
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>{customer.email}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to={`/customers/${id}/edit`}>
              <Button variant="outline" className="h-9">
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Visits</CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="text-2xl font-bold">{customer.visits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Visit</CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="text-2xl font-bold">{formatDate(customer.lastVisit)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Loyalty Points</CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="text-2xl font-bold">{customer.loyaltyPoints}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Customer Since</CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="text-2xl font-bold">{formatDate(customer.createdAt)}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Allergies & Preferences Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {customer.allergies.length > 0 && (
          <Card className="border-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                Allergies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {customer.allergies.map((allergy, i) => (
                  <Badge key={i} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    {allergy}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {customer.preferences.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-brand" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {customer.preferences.map((preference, i) => (
                  <Badge key={i} variant="outline" className="bg-brand-50 text-brand border-brand-200">
                    {preference}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Tabs for Visit History, Feedback, and Notes */}
      <Tabs defaultValue="visits" className="w-full">
        <TabsList>
          <TabsTrigger value="visits">Visit History</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        {/* Visit History Tab */}
        <TabsContent value="visits" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Visit History</CardTitle>
              <CardDescription>
                Past reservations and visits by this customer
              </CardDescription>
            </CardHeader>
            <CardContent>
              {customerReservations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Party Size</TableHead>
                      <TableHead>Table(s)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerReservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell>{formatDate(reservation.date)}</TableCell>
                        <TableCell>{reservation.time}</TableCell>
                        <TableCell>{reservation.partySize}</TableCell>
                        <TableCell>
                          {reservation.tableIds.length > 0
                            ? reservation.tableIds.map(id => id.split('-')[1]).join(', ')
                            : '-'}
                        </TableCell>
                        <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {reservation.notes || reservation.specialRequests || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No visit history found for this customer
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Feedback Tab */}
        <TabsContent value="feedback" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Feedback</CardTitle>
              <CardDescription>
                Feedback received from this customer
              </CardDescription>
            </CardHeader>
            <CardContent>
              {customerFeedback.length > 0 ? (
                <div className="space-y-4">
                  {customerFeedback.map((feedback) => (
                    <Card key={feedback.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex justify-between">
                          <div className="flex items-center gap-2">
                            <span>{formatDate(feedback.createdAt)}</span>
                            <Badge className={
                              feedback.type === 'positive' ? "bg-emerald-100 text-emerald-800" : 
                              feedback.type === 'negative' ? "bg-red-100 text-red-800" : 
                              "bg-blue-100 text-blue-800"
                            }>
                              {feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < feedback.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{feedback.content}</p>
                        
                        {feedback.followUpNotes && (
                          <div className="mt-2 p-2 bg-gray-50 rounded-sm">
                            <p className="text-xs font-semibold">Follow-up Notes:</p>
                            <p className="text-xs">{feedback.followUpNotes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No feedback found for this customer
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notes Tab */}
        <TabsContent value="notes" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Notes</CardTitle>
                <CardDescription>
                  Manager and staff notes for this customer
                </CardDescription>
              </div>
              <Button>
                <MessageSquare className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </CardHeader>
            <CardContent>
              {customer.notes ? (
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm">{customer.notes}</p>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No notes found for this customer
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerProfile;
