
import React, { useState } from 'react';
import { mockReservations } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Reservation, ReservationStatus } from '@/types';

const Reservations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const filteredReservations = mockReservations.filter(reservation => 
    (reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.id.includes(searchTerm)) &&
    reservation.date === selectedDate
  );
  
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
  const dayAfter = new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getStatusBadgeVariant = (status: ReservationStatus) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'seated':
        return 'bg-brand text-white';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'no-show':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Group reservations by time slot
  const groupedReservations: Record<string, Reservation[]> = {};
  filteredReservations.forEach(reservation => {
    if (!groupedReservations[reservation.time]) {
      groupedReservations[reservation.time] = [];
    }
    groupedReservations[reservation.time].push(reservation);
  });
  
  // Sort time slots
  const sortedTimeSlots = Object.keys(groupedReservations).sort();
  
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Reservations</h1>
        <Link to="/reservations/new">
          <Button className="bg-brand hover:bg-brand-muted">
            <Plus className="mr-2 h-4 w-4" />
            New Reservation
          </Button>
        </Link>
      </div>
      
      <Tabs defaultValue={today} className="w-full">
        <TabsList className="grid grid-cols-3 max-w-md mb-4">
          <TabsTrigger value={today} onClick={() => handleDateSelect(today)}>
            Today
          </TabsTrigger>
          <TabsTrigger value={tomorrow} onClick={() => handleDateSelect(tomorrow)}>
            Tomorrow
          </TabsTrigger>
          <TabsTrigger value={dayAfter} onClick={() => handleDateSelect(dayAfter)}>
            {formatDate(dayAfter)}
          </TabsTrigger>
        </TabsList>
        
        <div className="flex items-center justify-between mb-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search reservations..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateSelect(e.target.value)}
              className="w-[200px]"
            />
          </div>
        </div>
        
        {sortedTimeSlots.length > 0 ? (
          <div className="space-y-8">
            {sortedTimeSlots.map((timeSlot) => (
              <div key={timeSlot} className="space-y-3">
                <h3 className="font-medium">
                  {timeSlot.split(':')[0] % 12 || 12}:{timeSlot.split(':')[1]} {parseInt(timeSlot.split(':')[0]) >= 12 ? 'PM' : 'AM'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedReservations[timeSlot].map((reservation) => (
                    <ReservationCard 
                      key={reservation.id} 
                      reservation={reservation}
                      getStatusBadgeVariant={getStatusBadgeVariant}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-lg font-medium">No reservations found</h3>
            <p className="text-muted-foreground mt-1">
              {searchTerm ? 'Try adjusting your search' : `No reservations for ${formatDate(selectedDate)}`}
            </p>
          </div>
        )}
      </Tabs>
    </div>
  );
};

interface ReservationCardProps {
  reservation: Reservation;
  getStatusBadgeVariant: (status: ReservationStatus) => string;
}

const ReservationCard: React.FC<ReservationCardProps> = ({ 
  reservation, 
  getStatusBadgeVariant 
}) => {
  return (
    <Link to={`/reservations/${reservation.id}`}>
      <Card className="reservation-card h-full hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{reservation.customerName}</h4>
              <p className="text-sm text-muted-foreground">
                {reservation.partySize} {reservation.partySize === 1 ? 'guest' : 'guests'}
                {reservation.tableIds.length > 0 && ` • Table ${reservation.tableIds.map(id => id.split('-')[1]).join(', ')}`}
              </p>
              {reservation.specialRequests && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  <span className="font-medium">Request:</span> {reservation.specialRequests}
                </p>
              )}
            </div>
            <Badge className={`${getStatusBadgeVariant(reservation.status)} capitalize`}>
              {reservation.status}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Reservations;
