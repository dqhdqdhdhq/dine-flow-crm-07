
import React, { useState } from 'react';
import { Table } from '@/types';
import { useRealtime } from '@/context/RealtimeContext';
import { Badge } from '@/components/ui/badge';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FloorPlanViewProps {
  selectedDate: string;
}

const FloorPlanView: React.FC<FloorPlanViewProps> = ({ selectedDate }) => {
  const { tables, reservations, assignTable, updateTable } = useRealtime();
  const [draggedReservation, setDraggedReservation] = useState<string | null>(null);
  
  // Group tables by location
  const tablesByLocation: Record<string, Table[]> = tables.reduce((acc, table) => {
    if (!acc[table.location]) {
      acc[table.location] = [];
    }
    acc[table.location].push(table);
    return acc;
  }, {} as Record<string, Table[]>);

  // Get reservations for selected date that don't have tables assigned
  const unassignedReservations = reservations
    .filter(res => 
      res.date === selectedDate && 
      res.tableIds.length === 0 &&
      (res.status === 'pending' || res.status === 'confirmed')
    )
    .sort((a, b) => a.time.localeCompare(b.time));

  // Handle drag start
  const handleDragStart = (reservationId: string) => {
    setDraggedReservation(reservationId);
  };

  // Handle drop on table
  const handleDrop = (tableId: string) => {
    if (!draggedReservation) return;
    
    const reservation = reservations.find(res => res.id === draggedReservation);
    const table = tables.find(t => t.id === tableId);
    
    if (reservation && table) {
      if (table.capacity < reservation.partySize) {
        toast.error(`Table ${table.number} is too small for this party of ${reservation.partySize}`);
        return;
      }
      
      if (table.status !== 'available' && table.status !== 'reserved') {
        toast.error(`Table ${table.number} is not available`);
        return;
      }
      
      assignTable(draggedReservation, tableId);
      toast.success(`Assigned ${reservation.customerName} to Table ${table.number}`);
    }
    
    setDraggedReservation(null);
  };
  
  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Get table color based on status
  const getTableColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-[#F2FCE2] border-emerald-200';
      case 'occupied':
        return 'bg-[#FEC6A1] border-orange-300';
      case 'reserved':
        return 'bg-[#FEF7CD] border-yellow-300';
      case 'unavailable':
        return 'bg-[#F1F0FB] border-gray-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  // Find reservations for a specific table on the selected date
  const findTableReservations = (tableId: string) => {
    return reservations.filter(res => 
      res.date === selectedDate && 
      res.tableIds.includes(tableId)
    );
  };

  // Update table status
  const handleTableStatusChange = (table: Table, newStatus: 'available' | 'occupied' | 'reserved' | 'unavailable') => {
    updateTable({
      ...table,
      status: newStatus
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Unassigned reservations */}
      {unassignedReservations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Unassigned Reservations</h3>
          <div className="flex flex-wrap gap-2">
            {unassignedReservations.map(reservation => (
              <div 
                key={reservation.id}
                draggable
                onDragStart={() => handleDragStart(reservation.id)}
                className="bg-white border rounded-md p-2 shadow-sm cursor-move hover:shadow-md transition-shadow"
              >
                <div className="font-medium">{reservation.customerName}</div>
                <div className="text-xs text-muted-foreground">
                  {reservation.time} · {reservation.partySize} {reservation.partySize === 1 ? 'guest' : 'guests'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Floor plan layout */}
      {Object.entries(tablesByLocation).map(([location, locationTables]) => (
        <div key={location} className="space-y-3">
          <h3 className="text-lg font-medium">{location}</h3>
          <div className="relative bg-gray-50 border rounded-lg p-6 min-h-[300px]">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {locationTables.map((table) => {
                const tableReservations = findTableReservations(table.id);
                
                return (
                  <div 
                    key={table.id}
                    onDrop={() => handleDrop(table.id)}
                    onDragOver={handleDragOver}
                    className={`${getTableColor(table.status)} border-2 rounded-lg p-3 
                      flex flex-col items-center justify-center text-center min-h-[100px] 
                      transition-all ${draggedReservation ? 'ring-2 ring-brand hover:ring-4' : ''}`}
                  >
                    <div className="font-bold mb-1">Table {table.number}</div>
                    <div className="text-xs mb-2">Seats {table.capacity}</div>
                    
                    {tableReservations.length > 0 && (
                      <div className="w-full mt-1">
                        <Badge variant="outline" className="w-full truncate text-xs">
                          {tableReservations[0].customerName} · {tableReservations[0].time}
                        </Badge>
                      </div>
                    )}
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 mt-1">
                          Options
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-52 p-2">
                        <div className="space-y-1">
                          <div className="text-xs font-medium mb-2">Update Status</div>
                          <div className="grid grid-cols-2 gap-1">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 bg-[#F2FCE2]"
                              onClick={() => handleTableStatusChange(table, 'available')}
                            >
                              Available
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 bg-[#FEC6A1]"
                              onClick={() => handleTableStatusChange(table, 'occupied')}
                            >
                              Occupied
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 bg-[#FEF7CD]"
                              onClick={() => handleTableStatusChange(table, 'reserved')}
                            >
                              Reserved
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 bg-[#F1F0FB]"
                              onClick={() => handleTableStatusChange(table, 'unavailable')}
                            >
                              Blocked
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FloorPlanView;
