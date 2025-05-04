
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

export type ReservationStatus = 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no-show';

export interface Reservation {
  id: string;
  customerName: string;
  date: string;
  time: string;
  partySize: number;
  phone?: string;
  email?: string;
  notes?: string;
  status: ReservationStatus;
  tableIds: string[];
  createdAt: string;
}

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'unavailable';

export interface Table {
  id: string;
  number: string;
  capacity: number;
  status: TableStatus;
  section: string;
  shape: 'round' | 'square' | 'rectangle';
  position?: {
    x: number;
    y: number;
  };
}
