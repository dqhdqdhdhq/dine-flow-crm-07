
export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  image?: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  visits: number;
  lastVisit: string;
  totalSpent: number;
  notes: string;
  preferences: string[];
  vip: boolean;
}

export type FeedbackType = 'positive' | 'negative' | 'suggestion';

export interface Feedback {
  id: string;
  customerId: string;
  customerName: string;
  reservationId?: string;
  type: FeedbackType;
  rating: number;
  content: string;
  createdAt: string;
  followUpRequired: boolean;
  followUpDone: boolean;
  followUpNotes?: string;
  assignedTo?: string;
}

export interface TableStatus {
  id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'unavailable';
}

export interface Reservation {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  time: string;
  partySize: number;
  tableIds: string[];
  status: 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'unavailable';
  section: 'main' | 'bar' | 'outdoor' | 'private';
  position: {
    x: number;
    y: number;
  };
}
