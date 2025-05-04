
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { useRealtime } from '@/context/RealtimeContext';
import { Reservation, ReservationStatus } from '@/types';
import { toast } from 'sonner';

interface CalendarViewProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ selectedDate, onDateChange }) => {
  const { reservations, updateReservation } = useRealtime();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  
  // Generate array of time slots for the day (from 9 AM to 10 PM)
  const timeSlots = Array.from({ length: 14 }, (_, i) => {
    const hour = i + 9;
    return `${hour % 12 || 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
  });
  
  // Convert date string format to Date object
  const getDateFromString = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Convert Date object to date string format
  const getStringFromDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Count reservations per time slot
  const getReservationsForTimeSlot = (timeSlot: string): Reservation[] => {
    // Convert the display time format (e.g., "7:00 PM") to 24-hour format for comparison
    const displayHour = parseInt(timeSlot.split(':')[0]);
    const isPM = timeSlot.includes('PM');
    const militaryHour = isPM && displayHour !== 12 ? displayHour + 12 : 
                        !isPM && displayHour === 12 ? 0 : displayHour;
    
    // Filter reservations for the selected date and time slot (considering a 1-hour window)
    return reservations.filter(res => {
      if (res.date !== selectedDate) return false;
      
      const resHour = parseInt(res.time.split(':')[0]);
      const resMinute = parseInt(res.time.split(':')[1]);
      
      return resHour === militaryHour || (resHour === militaryHour - 1 && resMinute >= 30);
    });
  };

  // Handle date change in calendar
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      onDateChange(getStringFromDate(date));
    }
  };

  // Get status badge variant
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

  // Check if a date has reservations
  const hasReservations = (date: Date) => {
    return reservations.some(res => res.date === getStringFromDate(date));
  };

  // Render the calendar with reservation indicators
  const renderCalendar = () => {
    return (
      <Card className="border shadow-sm">
        <CardContent className="p-3">
          <Calendar
            mode="single"
            selected={getDateFromString(selectedDate)}
            onSelect={handleDateChange}
            className="rounded-md"
            modifiers={{
              hasReservation: (date) => hasReservations(date),
            }}
            modifiersStyles={{
              hasReservation: { 
                fontWeight: 'bold',
                border: '2px solid rgb(155, 135, 245)',
                color: 'rgb(155, 135, 245)' 
              }
            }}
          />
        </CardContent>
      </Card>
    );
  };

  // Handle quick status update
  const updateStatus = (reservation: Reservation, newStatus: ReservationStatus) => {
    updateReservation({
      ...reservation,
      status: newStatus
    });
    toast.success(`Updated ${reservation.customerName}'s reservation status to ${newStatus}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      <div>
        {renderCalendar()}
      </div>
      
      <div className="md:col-span-2">
        <Table>
          <thead>
            <tr>
              <th className="w-24">Time</th>
              <th>Reservations</th>
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((timeSlot) => {
              const slotReservations = getReservationsForTimeSlot(timeSlot);
              return (
                <tr 
                  key={timeSlot}
                  className={`${selectedTimeSlot === timeSlot ? 'bg-muted' : ''} 
                    ${slotReservations.length > 0 ? 'hover:bg-muted/80' : ''} 
                    cursor-pointer`}
                  onClick={() => setSelectedTimeSlot(timeSlot === selectedTimeSlot ? null : timeSlot)}
                >
                  <td className="align-top font-medium">{timeSlot}</td>
                  <td>
                    {slotReservations.length === 0 ? (
                      <span className="text-muted-foreground text-sm">No reservations</span>
                    ) : (
                      <div className="space-y-2">
                        {slotReservations.map((res) => (
                          <div key={res.id} className="bg-white border rounded-md p-2 shadow-sm">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{res.customerName}</div>
                                <div className="text-xs text-muted-foreground">
                                  {res.time} · {res.partySize} {res.partySize === 1 ? 'guest' : 'guests'}
                                </div>
                              </div>
                              <Badge className={`${getStatusBadgeVariant(res.status)} capitalize`}>
                                {res.status}
                              </Badge>
                            </div>
                            
                            {selectedTimeSlot === timeSlot && (
                              <div className="mt-2 pt-2 border-t flex flex-wrap gap-1">
                                {res.status === 'pending' && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      className="bg-emerald-500 hover:bg-emerald-600 h-7 text-xs"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateStatus(res, 'confirmed');
                                      }}
                                    >
                                      Confirm
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="destructive"
                                      className="h-7 text-xs"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateStatus(res, 'cancelled');
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                  </>
                                )}
                                
                                {res.status === 'confirmed' && (
                                  <Button 
                                    size="sm" 
                                    className="bg-brand hover:bg-brand-muted h-7 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateStatus(res, 'seated');
                                    }}
                                  >
                                    Seat
                                  </Button>
                                )}
                                
                                {res.status === 'seated' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="h-7 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateStatus(res, 'completed');
                                    }}
                                  >
                                    Complete
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default CalendarView;
