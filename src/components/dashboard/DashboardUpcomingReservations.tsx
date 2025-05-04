import React, { useState, useEffect } from 'react';
import { Reservation, ReservationStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Check, X, Bell, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useRealtime } from '@/context/RealtimeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DashboardUpcomingReservationsProps {
  reservations: Reservation[];
}

interface EditReservationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
  onSave: (updatedReservation: Reservation) => void;
}

const EditReservationDialog: React.FC<EditReservationDialogProps> = ({
  isOpen,
  onClose,
  reservation,
  onSave
}) => {
  const [customerName, setCustomerName] = useState('');
  const [partySize, setPartySize] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  
  useEffect(() => {
    if (reservation) {
      setCustomerName(reservation.customerName);
      setPartySize(reservation.partySize.toString());
      setTime(reservation.time);
      setNotes(reservation.notes || '');
    }
  }, [reservation]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reservation) {
      const updatedReservation = {
        ...reservation,
        customerName,
        partySize: parseInt(partySize),
        time,
        notes
      };
      onSave(updatedReservation);
    }
    onClose();
  };
  
  if (!reservation) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Reservation</DialogTitle>
          <DialogDescription>
            Update reservation details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-customer-name">Customer Name</Label>
              <Input
                id="edit-customer-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-party-size">Party Size</Label>
              <select
                id="edit-party-size"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={partySize}
                onChange={(e) => setPartySize(e.target.value)}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((size) => (
                  <option key={size} value={size}>
                    {size} {size === 1 ? "person" : "people"}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-time">Time</Label>
              <Input
                id="edit-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
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

const DashboardUpcomingReservations: React.FC<DashboardUpcomingReservationsProps> = ({ reservations }) => {
  const { updateReservation } = useRealtime();
  const [lastUpdatedId, setLastUpdatedId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  
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

  const handleUpdateStatus = (reservation: Reservation, newStatus: ReservationStatus) => {
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
  
  // Open edit dialog
  const openEditDialog = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setIsEditDialogOpen(true);
  };
  
  // Save edited reservation
  const saveEditedReservation = (updatedReservation: Reservation) => {
    updateReservation(updatedReservation);
    setLastUpdatedId(updatedReservation.id);
    toast.success(`Updated ${updatedReservation.customerName}'s reservation`);
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
                className={`p-3 border rounded-lg hover:bg-gray-50 transition-colors relative ${
                  dueSoon ? 'border-amber-300 bg-amber-50/50' : ''
                }`}
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
                      {reservation.tableIds.length > 0 && (
                        <>
                          <span className="mx-1">•</span>
                          <span>Table {reservation.tableIds.map(id => id.split('-')[1]).join(', ')}</span>
                        </>
                      )}
                    </div>
                    {reservation.notes && (
                      <div className="text-xs italic mt-1 text-muted-foreground">
                        {reservation.notes}
                      </div>
                    )}
                  </div>
                  <Badge className={`${getStatusColor(reservation.status)} capitalize`}>
                    {reservation.status}
                  </Badge>
                </div>

                {dueSoon && (
                  <div className="absolute right-1 top-1">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      <Bell className="h-3 w-3 mr-1 animate-bounce" />
                      Due soon
                    </span>
                  </div>
                )}

                {/* Action buttons */}
                <div className="mt-3 flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => openEditDialog(reservation)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  
                  {reservation.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-7 text-xs bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                        onClick={(e) => {
                          e.preventDefault();
                          handleUpdateStatus(reservation, 'confirmed');
                        }}
                      >
                        <Check className="h-3 w-3 mr-1 text-emerald-600" />
                        Confirm
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-7 text-xs bg-red-50 border-red-200 hover:bg-red-100"
                        onClick={(e) => {
                          e.preventDefault();
                          handleUpdateStatus(reservation, 'cancelled');
                        }}
                      >
                        <X className="h-3 w-3 mr-1 text-red-600" />
                        Cancel
                      </Button>
                    </>
                  )}
                  
                  {reservation.status === 'confirmed' && (
                    <Button 
                      size="sm" 
                      className="h-7 text-xs bg-brand hover:bg-brand-muted"
                      onClick={(e) => {
                        e.preventDefault();
                        handleUpdateStatus(reservation, 'seated');
                      }}
                    >
                      Seat Now
                    </Button>
                  )}
                  
                  <Link to={`/reservations/${reservation.id}`} className="inline-block">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      className="h-7 text-xs"
                    >
                      Details
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
      
      {/* Edit Reservation Dialog */}
      <EditReservationDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        reservation={editingReservation}
        onSave={saveEditedReservation}
      />
    </div>
  );
};

export default DashboardUpcomingReservations;
