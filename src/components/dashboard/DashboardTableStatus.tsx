
import React from 'react';
import { Table } from '@/types';
import { Badge } from '@/components/ui/badge';

interface DashboardTableStatusProps {
  tables: Table[];
}

const DashboardTableStatus: React.FC<DashboardTableStatusProps> = ({ tables }) => {
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
  
  return (
    <div className="space-y-6">
      {Object.entries(tablesByLocation).map(([location, locationTables]) => (
        <div key={location} className="space-y-2">
          <h3 className="font-medium text-sm text-muted-foreground">{location}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {locationTables.map((table) => (
              <div 
                key={table.id} 
                className={`p-3 rounded-lg border ${getStatusColor(table.status)} text-center shadow-sm`}
              >
                <div className="font-bold">Table {table.number}</div>
                <div className="text-xs">Seats {table.capacity}</div>
                <Badge variant="outline" className="mt-1 capitalize bg-white/20">
                  {table.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardTableStatus;
