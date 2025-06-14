import { Supplier, PurchaseOrder, OrderTemplate, OrderTemplateItem } from '@/types';

export const mockSuppliers: Supplier[] = [
  {
    id: 'supplier-1',
    name: 'Italian Imports Co.',
    contactPerson: 'Marco Rossi',
    phone: '+1 (555) 123-4567',
    email: 'marco@italianimports.com',
    address: '123 Cheese Lane, San Francisco, CA 94110',
    productsSupplied: ['Parmigiano Reggiano', 'Truffle Oil', 'Balsamic Vinegar'],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'supplier-2',
    name: 'Premium Wines',
    contactPerson: 'Sophia Laurent',
    phone: '+1 (555) 987-6543',
    email: 'sophia@premiumwines.com',
    address: '456 Vineyard Road, Napa Valley, CA 94558',
    productsSupplied: ['Cabernet Sauvignon', 'Pinot Noir', 'Chardonnay'],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'supplier-3',
    name: 'Local Produce',
    contactPerson: 'David Kim',
    phone: '+1 (555) 456-7890',
    email: 'david@localproduce.com',
    address: '789 Farm Road, Berkeley, CA 94710',
    productsSupplied: ['Organic Vegetables', 'Fresh Herbs', 'Specialty Mushrooms'],
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'supplier-4',
    name: 'Seafood Direct',
    contactPerson: 'Emily Chen',
    phone: '+1 (555) 222-3333',
    email: 'emily@seafooddirect.com',
    address: '101 Harbor Drive, San Francisco, CA 94111',
    productsSupplied: ['Fresh Salmon', 'Oysters', 'Scallops'],
    status: 'inactive',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'supplier-5',
    name: 'Artisan Bakery',
    contactPerson: 'Jean-Pierre Dubois',
    phone: '+1 (555) 444-5678',
    email: 'jp@artisanbakery.com',
    address: '202 Bread Street, Oakland, CA 94612',
    productsSupplied: ['Sourdough Bread', 'Croissants', 'Specialty Pastries'],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'supplier-6',
    name: 'Specialty Meats',
    contactPerson: 'Robert Johnson',
    phone: '+1 (555) 789-0123',
    email: 'robert@specialtymeats.com',
    address: '303 Butcher Avenue, San Francisco, CA 94107',
    productsSupplied: ['Wagyu Beef', 'Prosciutto', 'Artisanal Sausages'],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'supplier-7',
    name: 'Organic Dairy',
    contactPerson: 'Sarah Williams',
    phone: '+1 (555) 234-5678',
    email: 'sarah@organicdairy.com',
    address: '404 Milk Road, Petaluma, CA 94952',
    productsSupplied: ['Organic Milk', 'Artisanal Cheese', 'Grass-fed Butter'],
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    supplierId: 'supplier-1',
    supplierName: 'Italian Imports Co.',
    status: 'ordered',
    orderDate: new Date().toISOString(),
    expectedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    items: [
      {
        id: 'item-1',
        inventoryItemId: '1',
        name: 'Parmigiano Reggiano',
        quantity: 10,
        unit: 'kg',
        unitPrice: 28.5,
        receivedQuantity: 0,
        notes: ''
      },
      {
        id: 'item-2',
        inventoryItemId: '3',
        name: 'Truffle Oil',
        quantity: 5,
        unit: 'bottle',
        unitPrice: 18.75,
        receivedQuantity: 0,
        notes: ''
      }
    ],
    totalAmount: 285 + 93.75,
    notes: 'Regular monthly order',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    supplierId: 'supplier-2',
    supplierName: 'Premium Wines',
    status: 'partially-received',
    orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    expectedDeliveryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    items: [
      {
        id: 'item-3',
        inventoryItemId: '2',
        name: 'Cabernet Sauvignon',
        quantity: 12,
        unit: 'bottle',
        unitPrice: 35.0,
        receivedQuantity: 8,
        notes: '4 bottles on backorder'
      }
    ],
    totalAmount: 12 * 35,
    notes: '',
    receivedBy: 'John Smith',
    receivedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    supplierId: 'supplier-3',
    supplierName: 'Local Produce',
    status: 'received',
    orderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    expectedDeliveryDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    items: [
      {
        id: 'item-4',
        inventoryItemId: '4',
        name: 'Organic Tomatoes',
        quantity: 20,
        unit: 'kg',
        unitPrice: 4.5,
        receivedQuantity: 20,
        notes: 'Excellent quality'
      }
    ],
    totalAmount: 20 * 4.5,
    notes: '',
    receivedBy: 'Jane Doe',
    receivedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    supplierId: 'supplier-4',
    supplierName: 'Seafood Direct',
    status: 'shipped',
    orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    expectedDeliveryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // tomorrow
    items: [
      {
        id: 'item-5',
        inventoryItemId: '5',
        name: 'Fresh Salmon',
        quantity: 15,
        unit: 'kg',
        unitPrice: 22.5,
        receivedQuantity: 0,
        notes: ''
      },
      {
        id: 'item-6',
        inventoryItemId: '6',
        name: 'Oysters',
        quantity: 100,
        unit: 'piece',
        unitPrice: 1.75,
        receivedQuantity: 0,
        notes: ''
      }
    ],
    totalAmount: 15 * 22.5 + 100 * 1.75,
    notes: 'Weekend special event order',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    supplierId: 'supplier-5',
    supplierName: 'Artisan Bakery',
    status: 'draft',
    orderDate: new Date().toISOString(),
    expectedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    items: [
      {
        id: 'item-7',
        inventoryItemId: '7',
        name: 'Sourdough Bread',
        quantity: 30,
        unit: 'loaf',
        unitPrice: 5.25,
        receivedQuantity: 0,
        notes: ''
      }
    ],
    totalAmount: 30 * 5.25,
    notes: 'Draft order for next week',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    supplierId: 'supplier-6',
    supplierName: 'Specialty Meats',
    status: 'cancelled',
    orderDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    expectedDeliveryDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    items: [
      {
        id: 'item-8',
        inventoryItemId: '8',
        name: 'Wagyu Beef',
        quantity: 10,
        unit: 'kg',
        unitPrice: 85.0,
        receivedQuantity: 0,
        notes: ''
      }
    ],
    totalAmount: 10 * 85.0,
    notes: 'Cancelled due to pricing issue',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockOrderTemplates: OrderTemplate[] = [
  {
    id: 'template-1',
    name: 'Weekly Veggie Stock-up',
    supplierId: 'supplier-3',
    supplierName: 'Local Produce',
    items: [
      {
        inventoryItemId: '4',
        name: 'Organic Tomatoes',
        quantity: 20,
        unit: 'kg',
        unitPrice: 4.5,
      },
      {
        inventoryItemId: 'some-item-id-1',
        name: 'Fresh Herbs',
        quantity: 5,
        unit: 'bunch',
        unitPrice: 2.0,
      }
    ],
    recurrence: {
      pattern: 'weekly',
      dayOfWeek: 1, // Monday
    },
    nextGenerationDate: new Date(new Date().setDate(new Date().getDate() + (1 + 7 - new Date().getDay()) % 7)).toISOString(),
    autoGenerate: true,
    notes: 'Standard weekly order for vegetables.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'template-2',
    name: 'Monthly Wine Restock',
    supplierId: 'supplier-2',
    supplierName: 'Premium Wines',
    items: [
      {
        inventoryItemId: '2',
        name: 'Cabernet Sauvignon',
        quantity: 24,
        unit: 'bottle',
        unitPrice: 35.0,
      },
      {
        inventoryItemId: 'some-item-id-2',
        name: 'Chardonnay',
        quantity: 12,
        unit: 'bottle',
        unitPrice: 30.0,
      }
    ],
    recurrence: {
      pattern: 'monthly',
      dayOfMonth: 1,
    },
    nextGenerationDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
    autoGenerate: false,
    notes: 'Check inventory before generating this order.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
