
import React from 'react';
import { Reservation } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardUpcomingReservationsProps {
  reservations: Reservation[];
}

const DashboardUpcomingReservations: React.FC<DashboardUpcomingReservationsProps> = ({ reservations }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'seated':
        return 'bg-brand text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };
  
  return (
    <div className="space-y-4">
      {reservations.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No upcoming reservations
        </div>
      ) : (
        reservations.map((reservation) => (
          <Link 
            to={`/reservations/${reservation.id}`}
            key={reservation.id} 
            className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{reservation.customerName}</h4>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(reservation.time)}</span>
                  <span className="mx-1">•</span>
                  <Users className="h-3 w-3" />
                  <span>{reservation.partySize} guests</span>
                </div>
              </div>
              <Badge className={`${getStatusColor(reservation.status)} capitalize`}>
                {reservation.status}
              </Badge>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default DashboardUpcomingReservations;
