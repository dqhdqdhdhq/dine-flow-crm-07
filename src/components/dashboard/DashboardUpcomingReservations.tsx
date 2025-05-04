
import React, { useState, useEffect } from 'react';
import { Reservation } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Check, X, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useRealtime } from '@/context/RealtimeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface DashboardUpcomingReservationsProps {
  reservations: Reservation[];
}

const DashboardUpcomingReservations: React.FC<DashboardUpcomingReservationsProps> = ({ reservations }) => {
  const { updateReservation } = useRealtime();
  const [lastUpdatedId, setLastUpdatedId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

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
    const updatedReservation = {
      ...reservation,
      status: newStatus
    };
    
    updateReservation(updatedReservation);
    setLastUpdatedId(reservation.id);
    
    // Show a notification for status update
    toast.success(`Reservation status updated to ${newStatus}`, {
      description: `${reservation.customerName} - ${formatTime(reservation.time)}`,
    });
  };
  
  // Calculate if a reservation is due soon (within 30 minutes)
  const isDueSoon = (reservation: Reservation): boolean => {
    const [hours, minutes] = reservation.time.split(':').map(Number);
    const reservationTime = new Date();
    reservationTime.setHours(hours, minutes, 0);
    
    // If reservation is today and within 30 minutes
    const diffMs = reservationTime.getTime() - currentTime.getTime();
    const diffMinutes = diffMs / (1000 * 60);
    
    return diffMinutes >= 0 && diffMinutes <= 30;
  };
  
  // Reset animation trigger after a timeout
  useEffect(() => {
    if (lastUpdatedId) {
      const timer = setTimeout(() => {
        setLastUpdatedId(null);
      }, 2000);
      return () => clearInterval(timer);
    }
  }, [lastUpdatedId]);
  
  return (
    <div className="space-y-4">
      {reservations.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No upcoming reservations
        </div>
      ) : (
        <AnimatePresence initial={false}>
          {reservations.map((reservation) => {
            const dueSoon = isDueSoon(reservation);
            
            return (
              <motion.div 
                key={reservation.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: lastUpdatedId === reservation.id ? [1, 1.02, 1] : 1,
                  backgroundColor: lastUpdatedId === reservation.id ? ['#f9fafb', '#f3f4f6', '#f9fafb'] : '#f9fafb'
                }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-3 border rounded-lg hover:bg-gray-50 transition-colors relative group ${
                  dueSoon ? 'border-amber-300 bg-amber-50/50' : ''
                }`}
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

                {dueSoon && (
                  <div className="absolute right-1 top-1">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      <Bell className="h-3 w-3 mr-1 animate-bounce" />
                      Due soon
                    </span>
                  </div>
                )}

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
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
    </div>
  );
};

export default DashboardUpcomingReservations;
