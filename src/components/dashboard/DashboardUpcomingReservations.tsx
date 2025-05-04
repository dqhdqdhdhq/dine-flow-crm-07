
import React from 'react';
import { Reservation } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useRealtime } from '@/context/RealtimeContext';

interface DashboardUpcomingReservationsProps {
  reservations: Reservation[];
}

const DashboardUpcomingReservations: React.FC<DashboardUpcomingReservationsProps> = ({ reservations }) => {
  const { updateReservation } = useRealtime();

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

  const handleUpdateStatus = (reservation: Reservation, newStatus: 'confirmed' | 'seated' | 'cancelled' | 'no-show') => {
    updateReservation({
      ...reservation,
      status: newStatus
    });
  };
  
  return (
    <div className="space-y-4">
      {reservations.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No upcoming reservations
        </div>
      ) : (
        reservations.map((reservation) => (
          <div 
            key={reservation.id} 
            className="p-3 border rounded-lg hover:bg-gray-50 transition-colors relative group"
          >
            <Link to={`/reservations/${reservation.id}`} className="block">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{reservation.customerName}</h4>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(reservation.time)}</span>
                    <span className="mx-1">•</span>
                    <Users className="h-3 w-3" />
                    <span>{reservation.partySize} guests</span>
                    {reservation.tableIds.length > 0 && (
                      <>
                        <span className="mx-1">•</span>
                        <span>Table {reservation.tableIds.map(id => id.split('-')[1]).join(', ')}</span>
                      </>
                    )}
                  </div>
                </div>
                <Badge className={`${getStatusColor(reservation.status)} capitalize`}>
                  {reservation.status}
                </Badge>
              </div>
            </Link>

            {/* Quick action buttons that appear on hover */}
            <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              {reservation.status === 'pending' && (
                <>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-7 px-2 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                    onClick={(e) => {
                      e.preventDefault();
                      handleUpdateStatus(reservation, 'confirmed');
                    }}
                  >
                    <Check className="h-3 w-3 text-emerald-600" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-7 px-2 bg-red-50 border-red-200 hover:bg-red-100"
                    onClick={(e) => {
                      e.preventDefault();
                      handleUpdateStatus(reservation, 'cancelled');
                    }}
                  >
                    <X className="h-3 w-3 text-red-600" />
                  </Button>
                </>
              )}
              {reservation.status === 'confirmed' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="h-7 px-2 bg-brand-50 border-brand-200 hover:bg-brand-100 text-brand"
                  onClick={(e) => {
                    e.preventDefault();
                    handleUpdateStatus(reservation, 'seated');
                  }}
                >
                  Seat
                </Button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DashboardUpcomingReservations;
