// User-related types
export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  image?: string;
  avatarUrl?: string; // Added for backward compatibility
  isActive?: boolean; // Adding isActive property
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
  tags?: string[];
  allergies?: string[];
  loyaltyPoints?: number;
  createdAt?: string;
  updatedAt?: string;
  avatarUrl?: string;
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
  location: string; // Added this field to fix errors
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
  defaultSupplierId?: string; // Added for backward compatibility
  defaultSupplierName?: string; // Added for backward compatibility
  currentStock?: number; // Added for backward compatibility
  lowStockThreshold?: number; // Added for backward compatibility
  cost?: number; // Added for backward compatibility
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
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'pending-approval' | 'approved' | 'partially-paid' | 'disputed';
export type InvoiceCategory = 'food' | 'beverage' | 'equipment' | 'maintenance' | 'utilities' | 'rent' | 'other' | 'food-supplies' | 'marketing' | 'payroll';

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
  paymentDate?: string; // Added field
  fileUrl?: string; // Added field
  notes?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

// Event-related types
export type EventType = 'private-party' | 'public-ticketed' | 'holiday-special' | 'live-music' | 'corporate' | 'other';
export type EventStatus = 'planning' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled';

export interface Event {
  id: string;
  name: string;
  type: EventType;
  status: EventStatus;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  isMultiDay: boolean;
  capacity: number;
  bookedCount: number;
  locationDetails: string;
  description?: string;
  publicDescription?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  menu?: {
    id: string;
    name: string;
    description: string;
    items: Array<{
      name: string;
      description: string;
      price: number;
    }>;
  };
  resources: Array<{
    id: string;
    name: string;
    type: string;
    quantity: number;
    notes?: string;
  }>;
  staffingRequirements?: Array<{
    role: string;
    count: number;
    assignedStaff?: string[];
  }>;
  minimumSpend?: number;
  ticketPrice?: number;
  ticketSalesStart?: string;
  ticketSalesEnd?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventTask {
  id: string;
  eventId: string;
  title: string;
  description?: string;
  assignedTo?: string;
  assignedToName?: string; // Added to fix error
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue'; // Added status field
  completedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface EventGuest {
  id: string;
  eventId: string;
  customerId?: string;
  name: string;
  email?: string;
  phone?: string;
  status: 'invited' | 'confirmed' | 'declined' | 'cancelled' | 'checked-in' | 'pending'; // Added pending status
  attendees: number; // Added attendees field
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

// Note-related types
export type NoteCategory = 'customer' | 'reservation' | 'staff' | 'incident' | 'other';

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
