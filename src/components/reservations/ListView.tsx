
import React, { useState } from 'react';
import { Reservation, ReservationStatus, Table } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Check, X, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface ListViewProps {
  reservations: Reservation[];
  tables: Table[];
  selectedDate: string;
  updateReservation: (updatedReservation: Reservation) => void;
  updateStatus: (reservation: Reservation, status: ReservationStatus) => void;
  updateTable: (updatedTable: Table) => void;
  assignTable: (reservationId: string, tableId: string) => void;
  unassignTable: (reservationId: string, tableId: string) => void;
  getAvailableTables: (partySize: number, date: string, time: string) => Table[];
}

const ListView: React.FC<ListViewProps> = ({ 
  reservations, 
  tables, 
  selectedDate,
  updateReservation,
  updateStatus,
  updateTable,
  assignTable,
  unassignTable, 
  getAvailableTables 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingReservation, setEditingReservation] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Reservation>>({});

  const filteredReservations = reservations.filter(reservation => 
    (reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.id.includes(searchTerm)) &&
    reservation.date === selectedDate
  );

  // Group reservations by time slot
  const groupedReservations: Record<string, Reservation[]> = {};
  filteredReservations.forEach(reservation => {
    if (!groupedReservations[reservation.time]) {
      groupedReservations[reservation.time] = [];
    }
    groupedReservations[reservation.time].push(reservation);
  });
  
  // Sort time slots
  const sortedTimeSlots = Object.keys(groupedReservations).sort();

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

  const startInlineEdit = (reservation: Reservation) => {
    setEditingReservation(reservation.id);
    setEditData({
      partySize: reservation.partySize,
      status: reservation.status,
      specialRequests: reservation.specialRequests
    });
  };

  const cancelInlineEdit = () => {
    setEditingReservation(null);
    setEditData({});
  };

  const saveInlineEdit = (reservation: Reservation) => {
    const updatedReservation = {
      ...reservation,
      ...editData
    };
    
    updateReservation(updatedReservation);
    
    // If status changed to seated, update table status
    if (editData.status === 'seated' && reservation.status !== 'seated') {
      reservation.tableIds.forEach(tableId => {
        const table = tables.find(t => t.id === tableId);
        if (table) {
          updateTable({
            ...table,
            status: 'occupied'
          });
        }
      });
    }
    
    // If status changed to completed, update table status
    if (editData.status === 'completed' && reservation.status !== 'completed') {
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
    
    cancelInlineEdit();
    toast.success("Reservation updated successfully");
  };

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="relative max-w-sm">
        <Input
          type="search"
          placeholder="Search reservations..."
          className="pl-8 w-[250px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {sortedTimeSlots.length > 0 ? (
        <div className="space-y-8">
          {sortedTimeSlots.map((timeSlot) => (
            <div key={timeSlot} className="space-y-3">
              <h3 className="font-medium">
                {parseInt(timeSlot.split(':')[0]) % 12 || 12}:{timeSlot.split(':')[1]} {parseInt(timeSlot.split(':')[0]) >= 12 ? 'PM' : 'AM'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedReservations[timeSlot].map((reservation) => (
                  <ReservationCard 
                    key={reservation.id} 
                    reservation={reservation}
                    getStatusBadgeVariant={getStatusBadgeVariant}
                    isEditing={editingReservation === reservation.id}
                    editData={editData}
                    setEditData={setEditData}
                    startEdit={() => startInlineEdit(reservation)}
                    cancelEdit={cancelInlineEdit}
                    saveEdit={() => saveInlineEdit(reservation)}
                    updateStatus={updateStatus}
                    tables={tables}
                    getAvailableTables={getAvailableTables}
                    assignTable={assignTable}
                    unassignTable={unassignTable}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-lg font-medium">No reservations found</h3>
          <p className="text-muted-foreground mt-1">
            {searchTerm ? 'Try adjusting your search' : `No reservations for ${selectedDate}`}
          </p>
        </div>
      )}
    </div>
  );
};

interface ReservationCardProps {
  reservation: Reservation;
  getStatusBadgeVariant: (status: ReservationStatus) => string;
  isEditing: boolean;
  editData: Partial<Reservation>;
  setEditData: React.Dispatch<React.SetStateAction<Partial<Reservation>>>;
  startEdit: () => void;
  cancelEdit: () => void;
  saveEdit: () => void;
  updateStatus: (reservation: Reservation, status: ReservationStatus) => void;
  tables: Table[];
  getAvailableTables: (partySize: number, date: string, time: string) => Table[];
  assignTable: (reservationId: string, tableId: string) => void;
  unassignTable: (reservationId: string, tableId: string) => void;
}

const ReservationCard: React.FC<ReservationCardProps> = ({ 
  reservation, 
  getStatusBadgeVariant,
  isEditing,
  editData,
  setEditData,
  startEdit,
  cancelEdit,
  saveEdit,
  updateStatus,
  tables,
  getAvailableTables,
  assignTable,
  unassignTable
}) => {
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  // Get assigned tables
  const assignedTables = tables.filter(table => 
    reservation.tableIds.includes(table.id)
  );
  
  // Get available tables that could be assigned
  const availableTables = getAvailableTables(
    reservation.partySize,
    reservation.date,
    reservation.time
  );
  
  const handleAssignTable = (tableId: string) => {
    assignTable(reservation.id, tableId);
    toast.success(`Table assigned to ${reservation.customerName}`);
  };
  
  const handleUnassignTable = (tableId: string) => {
    unassignTable(reservation.id, tableId);
    toast.info(`Table unassigned from reservation`);
  };
  
  // Quick status update buttons based on current status
  const getQuickActions = () => {
    switch(reservation.status) {
      case 'pending':
        return (
          <>
            <Button 
              size="sm" 
              className="bg-emerald-500 hover:bg-emerald-600"
              onClick={() => updateStatus(reservation, 'confirmed')}
            >
              <Check className="mr-1 h-3 w-3" /> Confirm
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => updateStatus(reservation, 'cancelled')}
            >
              <X className="mr-1 h-3 w-3" /> Cancel
            </Button>
          </>
        );
      case 'confirmed':
        return (
          <>
            <Button 
              size="sm" 
              className="bg-brand hover:bg-brand-muted"
              onClick={() => updateStatus(reservation, 'seated')}
            >
              <Check className="mr-1 h-3 w-3" /> Seat
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => updateStatus(reservation, 'no-show')}
            >
              <X className="mr-1 h-3 w-3" /> No-Show
            </Button>
          </>
        );
      case 'seated':
        return (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => updateStatus(reservation, 'completed')}
          >
            <Check className="mr-1 h-3 w-3" /> Complete
          </Button>
        );
      case 'completed':
      case 'cancelled':
      case 'no-show':
        return (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => updateStatus(reservation, 'pending')}
          >
            <RefreshCw className="mr-1 h-3 w-3" /> Reopen
          </Button>
        );
    }
  };

  // Show inline edit form if editing
  if (isEditing) {
    return (
      <Card className="reservation-card h-full border-2 border-brand">
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{reservation.customerName}</h4>
              <div className="flex items-center gap-2 mt-1">
                <Input 
                  type="number" 
                  className="w-20 h-8"
                  value={editData.partySize || reservation.partySize}
                  onChange={(e) => setEditData({...editData, partySize: parseInt(e.target.value)})}
                />
                <span className="text-sm">guests</span>
              </div>
            </div>
            
            <Select 
              value={editData.status || reservation.status} 
              onValueChange={(value) => setEditData({...editData, status: value as ReservationStatus})}
            >
              <SelectTrigger className={`h-8 w-[110px] ${getStatusBadgeVariant(editData.status as ReservationStatus || reservation.status)}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="seated">Seated</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no-show">No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="pt-1">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Special Requests:</label>
            <Input
              value={editData.specialRequests || reservation.specialRequests}
              onChange={(e) => setEditData({...editData, specialRequests: e.target.value})}
              className="text-xs h-8"
              placeholder="Add special requests..."
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" size="sm" onClick={cancelEdit}>
              <X className="mr-1 h-3 w-3" /> Cancel
            </Button>
            <Button className="bg-brand hover:bg-brand-muted" size="sm" onClick={saveEdit}>
              <Save className="mr-1 h-3 w-3" /> Save
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Regular card
  return (
    <Card 
      className={`reservation-card h-full hover:shadow-md transition-all ${showQuickActions ? 'ring-1 ring-brand' : ''}`}
      onMouseEnter={() => setShowQuickActions(true)}
      onMouseLeave={() => setShowQuickActions(false)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium">{reservation.customerName}</h4>
            <p className="text-sm text-muted-foreground">
              {reservation.partySize} {reservation.partySize === 1 ? 'guest' : 'guests'}
            </p>
          </div>
          <Badge className={`${getStatusBadgeVariant(reservation.status)} capitalize`}>
            {reservation.status}
          </Badge>
        </div>
        
        {/* Table information */}
        <div className="mt-3">
          {assignedTables.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {assignedTables.map(table => (
                <Badge key={table.id} variant="outline" className="flex gap-1 items-center">
                  Table {table.number}
                  <button 
                    onClick={(e) => {
                      e.preventDefault(); // Prevent navigation
                      handleUnassignTable(table.id);
                    }}
                    className="hover:bg-gray-100 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-xs text-amber-600 font-medium">No tables assigned</p>
          )}
        </div>
        
        {/* Special requests */}
        {reservation.specialRequests && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
            <span className="font-medium">Request:</span> {reservation.specialRequests}
          </p>
        )}
        
        {/* Quick actions toolbar */}
        {showQuickActions && (
          <div className="mt-3 pt-2 border-t flex flex-wrap gap-2 justify-between items-center">
            <div className="flex gap-1">
              {getQuickActions()}
            </div>
            
            <div className="flex gap-1">
              {/* Table assignment popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 px-2">
                    Assign Table
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2">
                  <p className="text-xs font-medium mb-2">Available Tables:</p>
                  {availableTables.length > 0 ? (
                    <div className="grid grid-cols-2 gap-1">
                      {availableTables.map(table => (
                        <Button 
                          key={table.id} 
                          variant="outline" 
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleAssignTable(table.id)}
                        >
                          Table {table.number} ({table.capacity})
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No tables available</p>
                  )}
                </PopoverContent>
              </Popover>
              
              <Button variant="outline" size="sm" className="h-7 px-2" onClick={startEdit}>
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ListView;
