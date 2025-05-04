import { 
  Customer, 
  Table, 
  Reservation, 
  Note, 
  Feedback, 
  DailySummary,
  User
} from '@/types';

export const mockUsers: User[] = [
  {
    id: 'user-001',
    name: 'John Smith',
    email: 'john@dineflow.com',
    role: 'admin',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    isActive: true
  },
  {
    id: 'user-002',
    name: 'Sarah Davis',
    email: 'sarah@dineflow.com',
    role: 'manager',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    isActive: true
  },
  {
    id: 'user-003',
    name: 'Miguel Lopez',
    email: 'miguel@dineflow.com',
    role: 'staff',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel',
    isActive: true
  }
];

export const mockCustomers: Customer[] = [
  {
    id: 'customer-001',
    firstName: 'Emily',
    lastName: 'Johnson',
    email: 'emily.johnson@example.com',
    phone: '555-123-4567',
    visits: 8,
    lastVisit: '2025-04-15',
    totalSpent: 1250.75,
    vip: true,
    tags: ['VIP', 'Regular'],
    preferences: ['Window seat', 'Sparkling water'],
    allergies: ['Peanuts', 'Shellfish'],
    notes: 'Prefers quiet areas of the restaurant.',
    loyaltyPoints: 450,
    createdAt: '2024-06-10T00:00:00Z',
    updatedAt: '2025-04-15T00:00:00Z'
  },
  {
    id: 'customer-002',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@example.com',
    phone: '555-987-6543',
    visits: 3,
    lastVisit: '2025-04-26',
    totalSpent: 350.50,
    vip: false,
    tags: ['Regular'],
    preferences: ['Booth', 'Still water'],
    allergies: [],
    notes: '',
    loyaltyPoints: 150,
    createdAt: '2024-12-05T00:00:00Z',
    updatedAt: '2025-04-26T00:00:00Z'
  },
  {
    id: 'customer-003',
    firstName: 'Sophia',
    lastName: 'Garcia',
    email: 'sophia.garcia@example.com',
    phone: '555-222-3333',
    visits: 12,
    lastVisit: '2025-04-30',
    totalSpent: 2150.25,
    vip: true,
    tags: ['VIP', 'Regular', 'Wine Enthusiast'],
    preferences: ['Corner table', 'Wine pairing'],
    allergies: ['Dairy'],
    notes: 'Has a sophisticated palate, appreciates wine recommendations.',
    loyaltyPoints: 780,
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2025-04-30T00:00:00Z'
  },
  {
    id: 'customer-004',
    firstName: 'David',
    lastName: 'Smith',
    email: 'david.smith@example.com',
    phone: '555-444-5555',
    visits: 1,
    lastVisit: '2025-05-01',
    totalSpent: 175.80,
    vip: false,
    tags: ['New Customer'],
    preferences: [],
    allergies: [],
    notes: 'First time visitor, mentioned it was for a business meeting.',
    loyaltyPoints: 50,
    createdAt: '2025-05-01T00:00:00Z',
    updatedAt: '2025-05-01T00:00:00Z'
  },
  {
    id: 'customer-005',
    firstName: 'Olivia',
    lastName: 'Wilson',
    email: 'olivia.wilson@example.com',
    phone: '555-666-7777',
    visits: 5,
    lastVisit: '2025-04-20',
    totalSpent: 825.50,
    vip: false,
    tags: ['Regular', 'Birthday Special'],
    preferences: ['Outdoor seating', 'Desserts'],
    allergies: ['Gluten'],
    notes: 'Celebrates birthday at our restaurant annually.',
    loyaltyPoints: 320,
    createdAt: '2024-09-30T00:00:00Z',
    updatedAt: '2025-04-20T00:00:00Z'
  }
];

export const mockTables: Table[] = [
  { id: 'table-001', number: 1, capacity: 2, status: 'available', section: 'main', location: 'Window' },
  { id: 'table-002', number: 2, capacity: 2, status: 'occupied', section: 'main', location: 'Window' },
  { id: 'table-003', number: 3, capacity: 4, status: 'available', section: 'main', location: 'Center' },
  { id: 'table-004', number: 4, capacity: 4, status: 'reserved', section: 'main', location: 'Center' },
  { id: 'table-005', number: 5, capacity: 6, status: 'available', section: 'main', location: 'Corner' },
  { id: 'table-006', number: 6, capacity: 6, status: 'occupied', section: 'main', location: 'Corner' },
  { id: 'table-007', number: 7, capacity: 2, status: 'available', section: 'bar', location: 'Bar' },
  { id: 'table-008', number: 8, capacity: 2, status: 'available', section: 'bar', location: 'Bar' },
  { id: 'table-009', number: 9, capacity: 8, status: 'reserved', section: 'private', location: 'Private Room' },
  { id: 'table-010', number: 10, capacity: 4, status: 'unavailable', section: 'outdoor', location: 'Patio' },
  { id: 'table-011', number: 11, capacity: 4, status: 'available', section: 'outdoor', location: 'Patio' },
  { id: 'table-012', number: 12, capacity: 4, status: 'available', section: 'outdoor', location: 'Patio' },
];

export const mockReservations: Reservation[] = [
  {
    id: 'res-001',
    customerId: 'customer-001',
    customerName: 'Emily Johnson',
    date: '2025-05-03',
    time: '19:00',
    partySize: 2,
    tableIds: ['table-001'],
    status: 'confirmed',
    notes: '',
    specialRequests: 'Window table if possible',
    createdAt: '2025-04-25T14:30:00Z',
    updatedAt: '2025-04-25T14:30:00Z'
  },
  {
    id: 'res-002',
    customerId: 'customer-003',
    customerName: 'Sophia Garcia',
    date: '2025-05-03',
    time: '20:00',
    partySize: 4,
    tableIds: ['table-004'],
    status: 'confirmed',
    notes: 'Regular customer, prefers corner tables',
    specialRequests: 'Wine recommendation needed',
    createdAt: '2025-04-27T09:45:00Z',
    updatedAt: '2025-04-27T09:45:00Z'
  },
  {
    id: 'res-003',
    customerId: 'customer-005',
    customerName: 'Olivia Wilson',
    date: '2025-05-03',
    time: '18:30',
    partySize: 6,
    tableIds: ['table-006'],
    status: 'seated',
    notes: '',
    specialRequests: 'Celebrating anniversary - special dessert arranged',
    createdAt: '2025-04-26T16:20:00Z',
    updatedAt: '2025-05-03T18:35:00Z'
  },
  {
    id: 'res-004',
    customerId: 'customer-002',
    customerName: 'Michael Chen',
    date: '2025-05-03',
    time: '19:30',
    partySize: 2,
    tableIds: ['table-002'],
    status: 'seated',
    notes: '',
    specialRequests: '',
    createdAt: '2025-05-02T10:15:00Z',
    updatedAt: '2025-05-03T19:35:00Z'
  },
  {
    id: 'res-005',
    customerId: 'customer-004',
    customerName: 'David Smith',
    date: '2025-05-04',
    time: '12:30',
    partySize: 8,
    tableIds: ['table-009'],
    status: 'confirmed',
    notes: 'Business lunch, might need AV setup',
    specialRequests: 'Private room required',
    createdAt: '2025-05-01T11:00:00Z',
    updatedAt: '2025-05-01T11:00:00Z'
  },
  {
    id: 'res-006',
    customerId: '',
    customerName: 'Alex Turner',
    date: '2025-05-03',
    time: '17:00',
    partySize: 3,
    tableIds: [],
    status: 'pending',
    notes: 'Walk-in customer',
    specialRequests: '',
    createdAt: '2025-05-03T17:00:00Z',
    updatedAt: '2025-05-03T17:00:00Z'
  }
];

export const mockNotes: Note[] = [
  {
    id: 'note-001',
    title: 'Special wine preference',
    content: 'Ms. Garcia really enjoyed the 2018 Cabernet Sauvignon. Make sure to recommend it when she visits next.',
    category: 'customer',
    isStarred: true,
    customerId: 'customer-003',
    createdAt: '2025-04-30T21:45:00Z',
    updatedBy: 'Sarah Davis'
  },
  {
    id: 'note-002',
    title: 'Reservation follow-up needed',
    content: 'Need to confirm if we can accommodate the private room request for 8 people on May 4th.',
    category: 'reservation',
    isStarred: true,
    reservationId: 'res-005',
    createdAt: '2025-05-01T14:30:00Z',
    updatedBy: 'Miguel Lopez'
  },
  {
    id: 'note-003',
    title: 'Staff meeting notes',
    content: 'Discussed new menu items and service improvements. Starting new table turnover process next week.',
    category: 'staff',
    isStarred: false,
    createdAt: '2025-05-02T10:00:00Z',
    updatedBy: 'John Smith'
  },
  {
    id: 'note-004',
    title: 'Payment system issue',
    content: 'Credit card terminal at station 2 is having connectivity issues. IT has been notified.',
    category: 'incident',
    isStarred: true,
    createdAt: '2025-05-03T19:20:00Z',
    updatedBy: 'Sarah Davis'
  },
  {
    id: 'note-005',
    title: 'New customer details',
    content: 'David Smith mentioned he might bring clients for regular business lunches if today goes well.',
    category: 'customer',
    isStarred: false,
    customerId: 'customer-004',
    createdAt: '2025-05-01T13:15:00Z',
    updatedBy: 'Miguel Lopez'
  }
];

export const mockFeedback: Feedback[] = [
  {
    id: 'feedback-001',
    customerId: 'customer-001',
    customerName: 'Emily Johnson',
    reservationId: 'res-001',
    type: 'positive',
    content: 'The service was exceptional today. Our server was attentive and made excellent recommendations.',
    rating: 5,
    followUpRequired: false,
    followUpDone: false,
    followUpNotes: '',
    createdAt: '2025-04-15T21:30:00Z'
  },
  {
    id: 'feedback-002',
    customerId: 'customer-002',
    customerName: 'Michael Chen',
    reservationId: 'res-004',
    type: 'negative',
    content: 'The food took longer than expected to arrive, and my steak was overcooked.',
    rating: 2,
    followUpRequired: true,
    followUpDone: true,
    followUpNotes: 'Manager called to apologize and offered a complimentary dessert on next visit.',
    createdAt: '2025-04-26T20:45:00Z'
  },
  {
    id: 'feedback-003',
    customerId: 'customer-003',
    customerName: 'Sophia Garcia',
    reservationId: 'res-002',
    type: 'positive',
    content: 'The wine pairing with my meal was perfect. I appreciate the sommelier taking time to explain each selection.',
    rating: 5,
    followUpRequired: false,
    followUpDone: false,
    followUpNotes: '',
    createdAt: '2025-04-30T22:00:00Z'
  },
  {
    id: 'feedback-004',
    customerId: 'customer-005',
    customerName: 'Olivia Wilson',
    reservationId: 'res-003',
    type: 'suggestion',
    content: 'Would love to see more gluten-free dessert options on the menu.',
    rating: 4,
    followUpRequired: true,
    followUpDone: false,
    followUpNotes: '',
    createdAt: '2025-04-20T21:15:00Z'
  }
];

export const mockDailySummaries: DailySummary[] = [
  {
    date: '2025-05-03',
    totalReservations: 12,
    completedReservations: 8,
    cancelledReservations: 1,
    noShowReservations: 0,
    totalCustomers: 42,
    newCustomers: 3,
    positiveReviews: 6,
    negativeReviews: 1,
    avgRating: 4.3
  },
  {
    date: '2025-05-02',
    totalReservations: 15,
    completedReservations: 12,
    cancelledReservations: 2,
    noShowReservations: 1,
    totalCustomers: 48,
    newCustomers: 5,
    positiveReviews: 8,
    negativeReviews: 2,
    avgRating: 4.1
  },
  {
    date: '2025-05-01',
    totalReservations: 10,
    completedReservations: 9,
    cancelledReservations: 0,
    noShowReservations: 1,
    totalCustomers: 35,
    newCustomers: 2,
    positiveReviews: 5,
    negativeReviews: 0,
    avgRating: 4.6
  },
  {
    date: '2025-04-30',
    totalReservations: 14,
    completedReservations: 11,
    cancelledReservations: 3,
    noShowReservations: 0,
    totalCustomers: 45,
    newCustomers: 6,
    positiveReviews: 7,
    negativeReviews: 1,
    avgRating: 4.2
  },
  {
    date: '2025-04-29',
    totalReservations: 8,
    completedReservations: 7,
    cancelledReservations: 1,
    noShowReservations: 0,
    totalCustomers: 25,
    newCustomers: 1,
    positiveReviews: 4,
    negativeReviews: 1,
    avgRating: 4.0
  },
  {
    date: '2025-04-28',
    totalReservations: 13,
    completedReservations: 11,
    cancelledReservations: 1,
    noShowReservations: 1,
    totalCustomers: 40,
    newCustomers: 4,
    positiveReviews: 6,
    negativeReviews: 0,
    avgRating: 4.4
  },
  {
    date: '2025-04-27',
    totalReservations: 16,
    completedReservations: 14,
    cancelledReservations: 2,
    noShowReservations: 0,
    totalCustomers: 50,
    newCustomers: 7,
    positiveReviews: 9,
    negativeReviews: 2,
    avgRating: 4.2
  }
];
