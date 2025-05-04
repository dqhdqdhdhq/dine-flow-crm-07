
// User-related types
export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  image?: string;
  avatarUrl?: string; // Added for backward compatibility
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
  tags?: string[]; // Added missing field
  allergies?: string[];
  loyaltyPoints?: number;
  createdAt?: string;
  updatedAt?: string;
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

export type ReservationStatus = 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no-show' | 'pending';

export interface Reservation {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  time: string;
  partySize: number;
  tableIds: string[];
  status: ReservationStatus;
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
  location: string; // Added missing field
  position?: {
    x: number;
    y: number;
  };
}

// Inventory-related types
export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  unit: string;
  unitCost: number;
  quantityOnHand: number;
  reorderPoint: number;
  reorderQuantity: number;
  supplierId: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'draft' | 'ordered' | 'shipped' | 'partially-received' | 'received' | 'cancelled';

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

// Invoice-related types
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type InvoiceCategory = 'food' | 'beverage' | 'equipment' | 'maintenance' | 'utilities' | 'rent' | 'other';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  status: InvoiceStatus;
  category: InvoiceCategory;
  issueDate: string;
  dueDate: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  notes?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

// Event-related types
export type EventType = 'wedding' | 'corporate' | 'birthday' | 'anniversary' | 'holiday' | 'other';
export type EventStatus = 'upcoming' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

export interface Event {
  id: string;
  title: string;
  type: EventType;
  status: EventStatus;
  startDate: string;
  endDate: string;
  location: string;
  description?: string;
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  attendeeCount: number;
  tasks?: EventTask[];
  guests?: EventGuest[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventTask {
  id: string;
  eventId: string;
  title: string;
  description?: string;
  assignedTo?: string;
  dueDate?: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface EventGuest {
  id: string;
  eventId: string;
  name: string;
  email?: string;
  phone?: string;
  status: 'invited' | 'confirmed' | 'declined' | 'cancelled';
  notes?: string;
}

// Note-related types
export interface Note {
  id: string;
  title: string;
  content: string;
  category: 'customer' | 'reservation' | 'staff' | 'incident' | 'other';
  isStarred: boolean;
  customerId?: string;
  reservationId?: string;
  createdAt: string;
  updatedBy: string;
}

// Dashboard-related types
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
