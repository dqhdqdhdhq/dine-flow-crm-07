
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/types';
import { format, parseISO, differenceInDays } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import EventDetailsDialog from './EventDetailsDialog';
import { eventStatuses, eventTypes } from '@/data/eventsData';

interface EventTimelineViewProps {
  events: Event[];
}

const EventTimelineView: React.FC<EventTimelineViewProps> = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);

  // Sort events by start date
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  // Group events by month
  const eventsByMonth: Record<string, Event[]> = {};
  
  sortedEvents.forEach(event => {
    const monthYear = format(new Date(event.startDate), 'MMMM yyyy');
    if (!eventsByMonth[monthYear]) {
      eventsByMonth[monthYear] = [];
    }
    eventsByMonth[monthYear].push(event);
  });

  return (
    <>
      <div className="space-y-8">
        {Object.entries(eventsByMonth).length === 0 ? (
          <div className="py-10 text-center">
            <CalendarDays className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium">No events found</h3>
            <p className="text-sm text-muted-foreground">
              Try changing your filters or create a new event.
            </p>
          </div>
        ) : (
          Object.entries(eventsByMonth).map(([monthYear, monthEvents]) => (
            <div key={monthYear}>
              <h3 className="text-lg font-medium mb-4">{monthYear}</h3>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-border" />
                
                <div className="space-y-6">
                  {monthEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className="flex gap-4"
                    >
                      {/* Date circle */}
                      <div className="relative z-10 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-background border-2 border-muted-foreground text-xs">
                        {format(new Date(event.startDate), 'dd')}
                      </div>
                      
                      {/* Event card */}
                      <Card 
                        className="flex-1 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleEventClick(event)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex flex-wrap gap-2 mb-1">
                            <Badge variant="outline" className={`border-2 ${eventStatuses[event.status].color.replace('bg-', 'border-')}`}>
                              {eventStatuses[event.status].label}
                            </Badge>
                            <Badge className={`${eventTypes[event.type].color} text-white`}>
                              {eventTypes[event.type].label}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{event.name}</CardTitle>
                          <CardDescription className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {format(new Date(event.startDate), 'MMM dd')}
                              {event.isMultiDay && (
                                <> - {format(new Date(event.endDate), 'MMM dd')}</>
                              )}
                            </span>
                            <span>{event.startTime} - {event.endTime}</span>
                            <span>{event.locationDetails}</span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-4">
                          <p className="text-sm line-clamp-2">
                            {event.description || 'No description provided.'}
                          </p>
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            Attendees: <span className="font-medium">{event.bookedCount}/{event.capacity}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {selectedEvent && (
        <EventDetailsDialog
          event={selectedEvent}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}
    </>
  );
};

export default EventTimelineView;
