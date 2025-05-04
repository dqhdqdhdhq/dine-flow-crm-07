
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRealtime } from '@/context/RealtimeContext';
import { Reservation, ReservationStatus } from '@/types';
import ViewSelector from '@/components/reservations/ViewSelector';
import ListView from '@/components/reservations/ListView';
import CalendarView from '@/components/reservations/CalendarView';
import FloorPlanView from '@/components/reservations/FloorPlanView';

type ViewType = 'list' | 'calendar' | 'floor-plan';

const Reservations: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const { reservations, tables, updateReservation, updateTable, assignTable, unassignTable, getAvailableTables } = useRealtime();
  
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
  const dayAfter = new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const updateStatus = (reservation: Reservation, newStatus: ReservationStatus) => {
    const updatedReservation = {
      ...reservation,
      status: newStatus
    };
    
    updateReservation(updatedReservation);
    
    // Update table statuses based on reservation status
    if (newStatus === 'seated') {
      reservation.tableIds.forEach(tableId => {
        const table = tables.find(t => t.id === tableId);
        if (table) {
          updateTable({
            ...table,
            status: 'occupied'
          });
        }
      });
    } else if (newStatus === 'completed' || newStatus === 'cancelled' || newStatus === 'no-show') {
      reservation.tableIds.forEach(tableId => {
        const table = tables.find(t => t.id === tableId);
        if (table) {
          updateTable({
            ...table,
            status: 'available'
          });
        }
      });
    }
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
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Tabs defaultValue={today} className="w-full">
          <TabsList className="grid grid-cols-3 max-w-md mb-4">
            <TabsTrigger value={today} onClick={() => setSelectedDate(today)}>
              Today
            </TabsTrigger>
            <TabsTrigger value={tomorrow} onClick={() => setSelectedDate(tomorrow)}>
              Tomorrow
            </TabsTrigger>
            <TabsTrigger value={dayAfter} onClick={() => setSelectedDate(dayAfter)}>
              {formatDate(dayAfter)}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <ViewSelector currentView={currentView} onViewChange={setCurrentView} />
      </div>
      
      {/* View content */}
      <div>
        {currentView === 'list' && (
          <ListView 
            reservations={reservations}
            tables={tables}
            selectedDate={selectedDate}
            updateReservation={updateReservation}
            updateStatus={updateStatus}
            updateTable={updateTable}
            assignTable={assignTable}
            unassignTable={unassignTable}
            getAvailableTables={getAvailableTables}
          />
        )}
        
        {currentView === 'calendar' && (
          <CalendarView 
            selectedDate={selectedDate} 
            onDateChange={setSelectedDate} 
          />
        )}
        
        {currentView === 'floor-plan' && (
          <FloorPlanView selectedDate={selectedDate} />
        )}
      </div>
    </div>
  );
};

export default Reservations;
