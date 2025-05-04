
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, ListFilter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EventCalendarView from '@/components/events/EventCalendarView';
import EventListView from '@/components/events/EventListView';
import EventTimelineView from '@/components/events/EventTimelineView';
import CreateEventDialog from '@/components/events/CreateEventDialog';
import EventFilterBar from '@/components/events/EventFilterBar';
import { EventType, EventStatus, Event } from '@/types';
import { mockEvents } from '@/data/eventsData';

type ViewType = 'calendar' | 'timeline' | 'list';

const EventCommandCenter: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<EventType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<{ from: Date | undefined, to: Date | undefined }>({ from: undefined, to: undefined });
  
  // Apply filters to events
  const filteredEvents = mockEvents.filter((event) => {
    // Text search
    const matchesSearch = searchQuery === '' || 
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Type filter
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    
    // Date range filter
    let matchesDateRange = true;
    if (dateRangeFilter.from || dateRangeFilter.to) {
      const eventDate = new Date(event.startDate);
      
      if (dateRangeFilter.from && dateRangeFilter.to) {
        matchesDateRange = eventDate >= dateRangeFilter.from && eventDate <= dateRangeFilter.to;
      } else if (dateRangeFilter.from) {
        matchesDateRange = eventDate >= dateRangeFilter.from;
      } else if (dateRangeFilter.to) {
        matchesDateRange = eventDate <= dateRangeFilter.to;
      }
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesDateRange;
  });
  
  const openCreateDialog = () => setIsCreateDialogOpen(true);
  const closeCreateDialog = () => setIsCreateDialogOpen(false);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-[#9b87f5]" />
          <h1 className="text-3xl font-bold tracking-tight">Event Command Center</h1>
        </div>
        <Button onClick={openCreateDialog} className="bg-[#9b87f5] hover:bg-[#8b77e5]">
          <Plus className="mr-2 h-4 w-4" />
          New Event
        </Button>
      </div>
      
      {/* View Switcher */}
      <Tabs defaultValue={currentView} className="w-full" onValueChange={(value) => setCurrentView(value as ViewType)}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
          
          <EventFilterBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateRangeFilter={dateRangeFilter}
            setDateRangeFilter={setDateRangeFilter}
          />
        </div>
        
        <TabsContent value="calendar" className="mt-4">
          <EventCalendarView 
            events={filteredEvents} 
            selectedDate={selectedDate} 
            onDateChange={setSelectedDate} 
          />
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-4">
          <EventTimelineView 
            events={filteredEvents} 
          />
        </TabsContent>
        
        <TabsContent value="list" className="mt-4">
          <EventListView 
            events={filteredEvents} 
          />
        </TabsContent>
      </Tabs>
      
      <CreateEventDialog open={isCreateDialogOpen} onClose={closeCreateDialog} />
    </div>
  );
};

export default EventCommandCenter;
