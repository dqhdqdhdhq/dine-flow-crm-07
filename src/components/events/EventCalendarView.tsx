
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Event } from '@/types';
import EventDetailsDialog from './EventDetailsDialog';
import { eventTypes, eventStatuses } from '@/data/eventsData';

interface EventCalendarViewProps {
  events: Event[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const EventCalendarView: React.FC<EventCalendarViewProps> = ({ events, selectedDate, onDateChange }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);

  const goToPreviousMonth = () => {
    const newMonth = subMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
  };

  const goToNextMonth = () => {
    const newMonth = addMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  const closeDetailsDialog = () => {
    setIsDetailsOpen(false);
  };

  // Generate array of days for the current month
  const startDate = startOfMonth(currentMonth);
  const endDate = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Create a 7-column grid for the calendar
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Get events for each day
  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      
      // Check if the day falls between start and end dates (inclusive)
      return (
        eventStart <= day && 
        eventEnd >= day
      );
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <CardTitle className="text-xl">
            {format(currentMonth, 'MMMM yyyy')}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                const today = new Date();
                setCurrentMonth(today);
                onDateChange(today);
              }}
            >
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-2">
            {weekdays.map((day) => (
              <div 
                key={day} 
                className="text-center font-semibold text-sm p-2"
              >
                {day.substring(0, 3)}
              </div>
            ))}
            
            {/* Empty cells for days before the first day of the month */}
            {Array.from({ length: startDate.getDay() }).map((_, index) => (
              <div key={`empty-start-${index}`} className="h-24 border border-muted rounded-md bg-muted/20"></div>
            ))}
            
            {/* Calendar days */}
            {days.map((day) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());
              
              return (
                <div 
                  key={day.toString()} 
                  className={`h-24 border rounded-md p-1 overflow-hidden flex flex-col ${
                    isToday ? 'border-primary border-2 bg-primary/5' : 'border-muted'
                  } ${
                    !isCurrentMonth ? 'bg-muted/20 text-muted-foreground' : ''
                  }`}
                >
                  <div className="text-right text-sm font-medium mb-1 p-1">
                    {format(day, 'd')}
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-1">
                    {dayEvents.map(event => (
                      <button
                        key={event.id}
                        onClick={() => handleEventClick(event)}
                        className={`text-xs rounded px-1 py-0.5 w-full text-left truncate ${eventTypes[event.type].color} text-white opacity-90 hover:opacity-100`}
                      >
                        {event.name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {/* Empty cells for days after the last day of the month */}
            {Array.from({ length: 6 - endDate.getDay() }).map((_, index) => (
              <div key={`empty-end-${index}`} className="h-24 border border-muted rounded-md bg-muted/20"></div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedEvent && (
        <EventDetailsDialog
          event={selectedEvent}
          isOpen={isDetailsOpen}
          onClose={closeDetailsDialog}
        />
      )}
    </>
  );
};

export default EventCalendarView;
