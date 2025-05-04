
import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Event } from '@/types';
import EventDetailsDialog from './EventDetailsDialog';
import { Badge } from '@/components/ui/badge';
import { getEventTypeLabel, getEventStatusLabel, eventTypes, eventStatuses } from '@/data/eventsData';
import { format } from 'date-fns';

interface EventListViewProps {
  events: Event[];
}

const EventListView: React.FC<EventListViewProps> = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);

  const openEventDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  const closeEventDetails = () => {
    setIsDetailsOpen(false);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No events found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow 
                  key={event.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => openEventDetails(event)}
                >
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${eventTypes[event.type].color} text-white`}
                    >
                      {getEventTypeLabel(event.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(event.startDate), 'MMM dd, yyyy')}
                    {event.isMultiDay && (
                      <>
                        <span className="mx-1">-</span>
                        {format(new Date(event.endDate), 'MMM dd, yyyy')}
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    {event.startTime} - {event.endTime}
                  </TableCell>
                  <TableCell>
                    {event.bookedCount}/{event.capacity}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`border-2 ${eventStatuses[event.status].color.replace('bg-', 'border-')}`}
                    >
                      {getEventStatusLabel(event.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{event.locationDetails}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {selectedEvent && (
        <EventDetailsDialog
          event={selectedEvent}
          isOpen={isDetailsOpen}
          onClose={closeEventDetails}
        />
      )}
    </>
  );
};

export default EventListView;
