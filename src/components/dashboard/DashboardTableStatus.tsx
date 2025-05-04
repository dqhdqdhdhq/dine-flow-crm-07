
import React, { useState, useEffect } from 'react';
import { Table } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useRealtime } from '@/context/RealtimeContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DashboardTableStatusProps {
  tables: Table[];
}

interface AddTableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTable: (table: Partial<Table>) => void;
  locations: string[];
}

const AddTableDialog: React.FC<AddTableDialogProps> = ({ isOpen, onClose, onAddTable, locations }) => {
  const [number, setNumber] = useState<string>('');
  const [capacity, setCapacity] = useState<string>('4');
  const [location, setLocation] = useState<string>(locations[0] || 'Main Dining');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTable({
      number: parseInt(number),
      capacity: parseInt(capacity),
      status: 'available',
      location
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setNumber('');
    setCapacity('4');
    setLocation(locations[0] || 'Main Dining');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Table</DialogTitle>
          <DialogDescription>
            Create a new table with the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="table-number">Table Number</Label>
              <Input
                id="table-number"
                type="number"
                min="1"
                required
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Table number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="table-capacity">Capacity</Label>
              <select
                id="table-capacity"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              >
                {[1, 2, 3, 4, 6, 8, 10, 12].map(size => (
                  <option key={size} value={size}>{size} {size === 1 ? 'seat' : 'seats'}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="table-location">Location</Label>
              <select
                id="table-location"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Add Table</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface EditTableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateTable: (tableId: string, updates: Partial<Table>) => void;
  table: Table | null;
  locations: string[];
}

const EditTableDialog: React.FC<EditTableDialogProps> = ({ isOpen, onClose, onUpdateTable, table, locations }) => {
  const [number, setNumber] = useState<string>('');
  const [capacity, setCapacity] = useState<string>('');
  const [location, setLocation] = useState<string>('');

  useEffect(() => {
    if (table) {
      setNumber(table.number.toString());
      setCapacity(table.capacity.toString());
      setLocation(table.location);
    }
  }, [table]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (table) {
      onUpdateTable(table.id, {
        number: parseInt(number),
        capacity: parseInt(capacity),
        location
      });
    }
    onClose();
  };

  if (!table) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Table {table.number}</DialogTitle>
          <DialogDescription>
            Update table details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-table-number">Table Number</Label>
              <Input
                id="edit-table-number"
                type="number"
                min="1"
                required
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-table-capacity">Capacity</Label>
              <select
                id="edit-table-capacity"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              >
                {[1, 2, 3, 4, 6, 8, 10, 12].map(size => (
                  <option key={size} value={size}>{size} {size === 1 ? 'seat' : 'seats'}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-table-location">Location</Label>
              <select
                id="edit-table-location"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
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

const DashboardTableStatus: React.FC<DashboardTableStatusProps> = ({ tables }) => {
  const { updateTable } = useRealtime();
  const [lastUpdatedTableId, setLastUpdatedTableId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  
  // Get unique locations
  const locations = Array.from(new Set(tables.map(table => table.location)));
  
  // Group tables by location
  const tablesByLocation: Record<string, Table[]> = tables.reduce((acc, table) => {
    if (!acc[table.location]) {
      acc[table.location] = [];
    }
    acc[table.location].push(table);
    return acc;
  }, {} as Record<string, Table[]>);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'occupied':
        return 'bg-brand-accent text-white';
      case 'reserved':
        return 'bg-brand text-white';
      case 'unavailable':
        return 'bg-gray-200 text-gray-600 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (table: Table, newStatus: 'available' | 'occupied' | 'reserved' | 'unavailable') => {
    updateTable({
      ...table,
      status: newStatus
    });
    setLastUpdatedTableId(table.id);
  };
  
  const handleAddTable = (newTable: Partial<Table>) => {
    // Generate a unique ID
    const id = `table-${Date.now()}`;
    
    updateTable({
      id,
      number: newTable.number || tables.length + 1,
      capacity: newTable.capacity || 4,
      status: 'available',
      section: 'main',
      location: newTable.location || 'Main Dining'
    } as Table);
  };
  
  const handleUpdateTable = (tableId: string, updates: Partial<Table>) => {
    const table = tables.find(t => t.id === tableId);
    if (table) {
      updateTable({
        ...table,
        ...updates
      });
      setLastUpdatedTableId(tableId);
    }
  };
  
  const openEditDialog = (table: Table) => {
    setEditingTable(table);
    setIsEditDialogOpen(true);
  };

  // Reset animation trigger after a timeout
  useEffect(() => {
    if (lastUpdatedTableId) {
      const timer = setTimeout(() => {
        setLastUpdatedTableId(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [lastUpdatedTableId]);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Table Layout</h3>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Table
        </Button>
      </div>
      
      {Object.entries(tablesByLocation).map(([location, locationTables]) => (
        <div key={location} className="space-y-2">
          <h3 className="font-medium text-sm text-muted-foreground">{location}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {locationTables.map((table) => (
              <motion.div 
                key={table.id} 
                className={`p-4 rounded-lg border ${getStatusColor(table.status)} hover:shadow-md transition-all relative`}
                animate={lastUpdatedTableId === table.id ? 
                  { scale: [1, 1.05, 1], backgroundColor: ['rgba(155, 135, 245, 0.3)', 'rgba(155, 135, 245, 0)', 'rgba(155, 135, 245, 0)'] } : 
                  {}
                }
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-bold">Table {table.number}</div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2">
                      <div className="space-y-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start text-sm"
                          onClick={() => openEditDialog(table)}
                        >
                          Edit Table
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start text-destructive text-sm hover:bg-destructive/10"
                          onClick={() => {
                            // Handle delete table logic here
                            // This would need to be implemented in the RealtimeContext
                          }}
                        >
                          Remove Table
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="text-center mb-3">
                  <div className="text-sm">Seats {table.capacity}</div>
                </div>
                
                <Select 
                  value={table.status} 
                  onValueChange={(value) => handleStatusChange(table, value as any)}
                >
                  <SelectTrigger className="h-8 text-xs bg-white/20 border-white/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="mt-2 grid grid-cols-2 gap-1">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-7 text-xs bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                    onClick={() => handleStatusChange(table, 'available')}
                  >
                    Available
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-7 text-xs bg-brand-accent/20 border-brand-accent/30 hover:bg-brand-accent/30 text-brand-accent" 
                    onClick={() => handleStatusChange(table, 'occupied')}
                  >
                    Occupied
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
      
      {/* Add Table Dialog */}
      <AddTableDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddTable={handleAddTable}
        locations={locations}
      />
      
      {/* Edit Table Dialog */}
      <EditTableDialog 
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onUpdateTable={handleUpdateTable}
        table={editingTable}
        locations={locations}
      />
    </div>
  );
};

export default DashboardTableStatus;
