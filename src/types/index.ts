
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

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  productsSupplied: string[];
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'draft' | 'ordered' | 'shipped' | 'partially-received' | 'received' | 'cancelled';

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  unit: string; // e.g., kg, bottle, case
  defaultSupplierId: string;
  defaultSupplierName: string;
  cost: number;
  currentStock: number;
  lowStockThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  inventoryItemId: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  receivedQuantity: number;
  notes: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  status: OrderStatus;
  orderDate: string;
  expectedDeliveryDate: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  notes: string;
  receivedBy?: string;
  receivedAt?: string;
  createdAt: string;
  updatedAt: string;
}
