
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

interface DashboardTableStatusProps {
  tables: Table[];
}

const DashboardTableStatus: React.FC<DashboardTableStatusProps> = ({ tables }) => {
  const { updateTable } = useRealtime();
  const [lastUpdatedTableId, setLastUpdatedTableId] = useState<string | null>(null);
  
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

  // Reset animation trigger after a timeout
  useEffect(() => {
    if (lastUpdatedTableId) {
      const timer = setTimeout(() => {
        setLastUpdatedTableId(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [lastUpdatedTableId]);
  
  // Quick actions for table
  const QuickActions = ({ table }: { table: Table }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="absolute right-2 top-2 h-6 px-2 text-xs">
          •••
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-1">
            <Button 
              size="sm" 
              variant="outline" 
              className="h-7 text-xs bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
              onClick={() => handleStatusChange(table, 'available')}
            >
              Mark Available
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="h-7 text-xs bg-brand-accent/20 border-brand-accent/30 hover:bg-brand-accent/30 text-brand-accent" 
              onClick={() => handleStatusChange(table, 'occupied')}
            >
              Seat Walk-in
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="h-7 text-xs bg-gray-50 border-gray-200 hover:bg-gray-100" 
              onClick={() => handleStatusChange(table, 'unavailable')}
            >
              Needs Cleaning
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="h-7 text-xs bg-red-50 border-red-200 hover:bg-red-100 text-red-700"
              onClick={() => handleStatusChange(table, 'unavailable')}
            >
              Block Table
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
  
  return (
    <div className="space-y-6">
      {Object.entries(tablesByLocation).map(([location, locationTables]) => (
        <div key={location} className="space-y-2">
          <h3 className="font-medium text-sm text-muted-foreground">{location}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {locationTables.map((table) => (
              <motion.div 
                key={table.id} 
                className={`p-3 rounded-lg border ${getStatusColor(table.status)} text-center shadow-sm hover:shadow-md transition-all relative`}
                animate={lastUpdatedTableId === table.id ? 
                  { scale: [1, 1.05, 1], backgroundColor: ['rgba(155, 135, 245, 0.3)', 'rgba(155, 135, 245, 0)', 'rgba(155, 135, 245, 0)'] } : 
                  {}
                }
                transition={{ duration: 0.5 }}
              >
                <div className="font-bold">Table {table.number}</div>
                <div className="text-xs">Seats {table.capacity}</div>
                
                <Select 
                  value={table.status} 
                  onValueChange={(value) => handleStatusChange(table, value as any)}
                >
                  <SelectTrigger className="mt-2 h-7 text-xs bg-white/20 border-white/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
                
                <QuickActions table={table} />
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardTableStatus;
