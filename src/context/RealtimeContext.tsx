
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Reservation, Table } from '@/types';
import { mockReservations, mockTables } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';
import { toast } from 'sonner';

interface RealtimeContextType {
  reservations: Reservation[];
  tables: Table[];
  updateReservation: (updatedReservation: Reservation) => void;
  updateTable: (updatedTable: Table) => void;
  detectConflicts: (reservation: Reservation) => {hasConflict: boolean, message: string};
  assignTable: (reservationId: string, tableId: string) => void;
  unassignTable: (reservationId: string, tableId: string) => void;
  getAvailableTables: (partySize: number, date: string, time: string) => Table[];
  addReservation: (newReservation: Reservation) => void; // Added the missing function
}

const RealtimeContext = createContext<RealtimeContextType | null>(null);

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [tables, setTables] = useState<Table[]>(mockTables);
  const { toast: uiToast } = useToast();

  // Add a new reservation
  const addReservation = (newReservation: Reservation) => {
    setReservations(prev => {
      const updatedReservations = [...prev, newReservation];
      
      // Simulate a WebSocket notification
      toast.success("Reservation created", {
        description: `${newReservation.customerName} - ${newReservation.time}`,
        duration: 3000,
      });
      
      return updatedReservations;
    });
  };

  // Update a reservation
  const updateReservation = (updatedReservation: Reservation) => {
    setReservations(prev => {
      const newReservations = prev.map(res => 
        res.id === updatedReservation.id ? updatedReservation : res
      );
      
      // Simulate a WebSocket notification
      toast.success("Reservation updated", {
        description: `${updatedReservation.customerName} - ${updatedReservation.time}`,
        duration: 3000,
      });
      
      return newReservations;
    });
  };

  // Update a table
  const updateTable = (updatedTable: Table) => {
    setTables(prev => {
      const newTables = prev.map(table => 
        table.id === updatedTable.id ? updatedTable : table
      );
      
      // Simulate a WebSocket notification
      toast.success(`Table ${updatedTable.number} status changed`, {
        description: `Now ${updatedTable.status}`,
        duration: 3000,
      });
      
      return newTables;
    });
  };

  // Check for conflicts (double-booking, etc)
  const detectConflicts = (reservation: Reservation) => {
    // Check if any table is double-booked
    const conflictingReservation = reservations.find(res => 
      res.id !== reservation.id && 
      res.date === reservation.date && 
      res.time === reservation.time &&
      res.tableIds.some(tableId => reservation.tableIds.includes(tableId))
    );

    if (conflictingReservation) {
      return {
        hasConflict: true,
        message: `Table already assigned to ${conflictingReservation.customerName} at ${reservation.time}`
      };
    }

    return { hasConflict: false, message: '' };
  };

  // Assign table to reservation
  const assignTable = (reservationId: string, tableId: string) => {
    // First find the reservation
    const reservation = reservations.find(res => res.id === reservationId);
    if (!reservation) return;

    // Check if table is already assigned to this reservation
    if (reservation.tableIds.includes(tableId)) return;

    // Add table to reservation
    const updatedReservation = {
      ...reservation,
      tableIds: [...reservation.tableIds, tableId]
    };

    // Check for conflicts
    const conflict = detectConflicts(updatedReservation);
    if (conflict.hasConflict) {
      toast.error("Table assignment conflict", {
        description: conflict.message,
      });
      return;
    }

    // Update reservation
    updateReservation(updatedReservation);

    // Update table status
    const table = tables.find(t => t.id === tableId);
    if (table) {
      updateTable({
        ...table,
        status: 'reserved'
      });
    }
  };

  // Remove table from reservation
  const unassignTable = (reservationId: string, tableId: string) => {
    // Find the reservation
    const reservation = reservations.find(res => res.id === reservationId);
    if (!reservation) return;

    // Remove table from reservation
    const updatedReservation = {
      ...reservation,
      tableIds: reservation.tableIds.filter(id => id !== tableId)
    };

    // Update reservation
    updateReservation(updatedReservation);

    // Update table status
    const table = tables.find(t => t.id === tableId);
    if (table) {
      updateTable({
        ...table,
        status: 'available'
      });
    }
  };

  // Get available tables for a specific time and party size
  const getAvailableTables = (partySize: number, date: string, time: string) => {
    // Find all tables that are big enough
    const suitableTables = tables.filter(table => 
      table.capacity >= partySize && 
      (table.status === 'available' || table.status === 'reserved')
    );

    // Filter out tables that are already assigned at this time
    return suitableTables.filter(table => {
      const isAssigned = reservations.some(res => 
        res.date === date && 
        res.time === time && 
        res.tableIds.includes(table.id)
      );
      return !isAssigned;
    });
  };

  // You can add simulated "real-time" updates here to demonstrate
  useEffect(() => {
    const simulatedUpdateInterval = setInterval(() => {
      // Randomly update a table status occasionally for demo purposes
      if (Math.random() > 0.97) {
        const randomTableIndex = Math.floor(Math.random() * tables.length);
        const randomTable = tables[randomTableIndex];
        
        // Only update tables that aren't reserved
        if (randomTable.status !== 'reserved') {
          const newStatus = randomTable.status === 'available' ? 'occupied' : 'available';
          
          updateTable({
            ...randomTable,
            status: newStatus as 'available' | 'occupied' | 'reserved' | 'unavailable'
          });
        }
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(simulatedUpdateInterval);
  }, [tables]);

  const contextValue = {
    reservations,
    tables,
    updateReservation,
    updateTable,
    detectConflicts,
    assignTable,
    unassignTable,
    getAvailableTables,
    addReservation, // Added the missing function to the context value
  };

  return (
    <RealtimeContext.Provider value={contextValue}>
      {children}
    </RealtimeContext.Provider>
  );
};
