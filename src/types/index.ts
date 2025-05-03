
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  visits: number;
  lastVisit: string | null;
  tags: string[];
  preferences: string[];
  allergies: string[];
  notes: string;
  loyaltyPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'unavailable';
  location: string;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no-show';

export interface Reservation {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  time: string;
  partySize: number;
  tableIds: string[];
  status: ReservationStatus;
  notes: string;
  specialRequests: string;
  createdAt: string;
  updatedAt: string;
}

export type NoteCategory = 'reservation' | 'customer' | 'staff' | 'incident' | 'other';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  isStarred: boolean;
  customerId?: string;
  reservationId?: string;
  createdAt: string;
  updatedBy: string;
}

export type FeedbackType = 'positive' | 'negative' | 'suggestion';

export interface Feedback {
  id: string;
  customerId: string;
  customerName: string;
  reservationId?: string;
  type: FeedbackType;
  content: string;
  rating: number; // 1-5
  followUpRequired: boolean;
  followUpDone: boolean;
  followUpNotes: string;
  createdAt: string;
}

export interface DailySummary {
  date: string;
  totalReservations: number;
  completedReservations: number;
  cancelledReservations: number;
  noShowReservations: number;
  totalCustomers: number;
  newCustomers: number;
  positiveReviews: number;
  negativeReviews: number;
  avgRating: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  avatarUrl?: string;
}
