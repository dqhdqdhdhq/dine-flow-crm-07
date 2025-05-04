import { Event, EventTask, EventGuest, EventType, EventStatus } from '@/types';

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();

// Helper to generate date strings
const formatDate = (year: number, month: number, day: number) => {
  return new Date(year, month, day).toISOString().split('T')[0];
};

export const eventTypes: Record<EventType, { label: string, color: string }> = {
  'private-party': { label: 'Private Party', color: 'bg-blue-500' },
  'public-ticketed': { label: 'Public Ticketed', color: 'bg-green-500' },
  'holiday-special': { label: 'Holiday Special', color: 'bg-red-500' },
  'live-music': { label: 'Live Music', color: 'bg-purple-500' },
  'corporate': { label: 'Corporate', color: 'bg-orange-500' },
  'other': { label: 'Other', color: 'bg-gray-500' }
};

export const eventStatuses: Record<EventStatus, { label: string, color: string }> = {
  'planning': { label: 'Planning', color: 'bg-amber-500' },
  'confirmed': { label: 'Confirmed', color: 'bg-green-500' },
  'ongoing': { label: 'Ongoing', color: 'bg-blue-500' },
  'completed': { label: 'Completed', color: 'bg-gray-500' },
  'cancelled': { label: 'Cancelled', color: 'bg-red-500' }
};

export const getEventTypeLabel = (type: EventType): string => {
  return eventTypes[type]?.label || 'Unknown Type';
};

export const getEventStatusLabel = (status: EventStatus): string => {
  return eventStatuses[status]?.label || 'Unknown Status';
};

export const mockEventTasks: EventTask[] = [
  {
    id: '1',
    eventId: '1',
    title: 'Confirm final headcount',
    description: 'Contact client for final guest count',
    dueDate: formatDate(currentYear, currentMonth, 20),
    assignedTo: 'user2',
    assignedToName: 'Jane Smith',
    status: 'pending',
    createdAt: formatDate(currentYear, currentMonth - 1, 15),
    updatedAt: formatDate(currentYear, currentMonth - 1, 15)
  },
  {
    id: '2',
    eventId: '1',
    title: 'Setup Audio/Visual Equipment',
    description: 'Test projector and microphone setup',
    dueDate: formatDate(currentYear, currentMonth, 22),
    assignedTo: 'user3',
    assignedToName: 'Mike Johnson',
    status: 'pending',
    createdAt: formatDate(currentYear, currentMonth - 1, 15),
    updatedAt: formatDate(currentYear, currentMonth - 1, 15)
  },
  {
    id: '3',
    eventId: '2',
    title: 'Prepare stage for band',
    description: 'Setup stage with necessary equipment',
    dueDate: formatDate(currentYear, currentMonth, 15),
    assignedTo: 'user3',
    assignedToName: 'Mike Johnson',
    status: 'completed',
    completedAt: formatDate(currentYear, currentMonth, 14),
    createdAt: formatDate(currentYear, currentMonth - 1, 5),
    updatedAt: formatDate(currentYear, currentMonth, 14)
  },
  {
    id: '4',
    eventId: '3',
    title: 'Print menus for holiday dinner',
    description: 'Print special holiday menus and place at each table setting',
    dueDate: formatDate(currentYear, currentMonth, 23),
    assignedTo: 'user1',
    assignedToName: 'John Doe',
    status: 'pending',
    createdAt: formatDate(currentYear, currentMonth - 1, 10),
    updatedAt: formatDate(currentYear, currentMonth - 1, 10)
  }
];

export const mockEventGuests: EventGuest[] = [
  {
    id: '1',
    eventId: '1',
    customerId: 'cust1',
    name: 'Robert Williams',
    email: 'robert@example.com',
    phone: '555-123-4567',
    attendees: 4,
    status: 'confirmed',
    createdAt: formatDate(currentYear, currentMonth - 1, 15),
    updatedAt: formatDate(currentYear, currentMonth - 1, 15)
  },
  {
    id: '2',
    eventId: '1',
    customerId: 'cust2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '555-234-5678',
    attendees: 2,
    status: 'confirmed',
    createdAt: formatDate(currentYear, currentMonth - 1, 16),
    updatedAt: formatDate(currentYear, currentMonth - 1, 16)
  },
  {
    id: '3',
    eventId: '1',
    name: 'Lisa Brown',
    email: 'lisa@example.com',
    phone: '555-345-6789',
    attendees: 5,
    status: 'pending',
    createdAt: formatDate(currentYear, currentMonth - 1, 18),
    updatedAt: formatDate(currentYear, currentMonth - 1, 18)
  },
  {
    id: '4',
    eventId: '3',
    customerId: 'cust5',
    name: 'David Miller',
    email: 'david@example.com',
    phone: '555-456-7890',
    attendees: 8,
    status: 'confirmed',
    createdAt: formatDate(currentYear, currentMonth - 1, 12),
    updatedAt: formatDate(currentYear, currentMonth - 1, 12)
  }
];

export const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Smith Family Reunion',
    description: 'Annual Smith family gathering with special menu.',
    type: 'private-party',
    status: 'confirmed',
    startDate: formatDate(currentYear, currentMonth, 22),
    endDate: formatDate(currentYear, currentMonth, 22),
    startTime: '18:00',
    endTime: '22:00',
    isMultiDay: false,
    capacity: 25,
    bookedCount: 18,
    locationDetails: 'Main Dining Room + Private Room',
    resources: [
      { id: 'r1', name: 'Private Room', type: 'room', quantity: 1, notes: 'Setup for 25 people' },
      { id: 'r2', name: 'Projector', type: 'equipment', quantity: 1 }
    ],
    minimumSpend: 1500,
    staffingRequirements: [
      { role: 'Server', count: 3, assignedStaff: ['staff1', 'staff2', 'staff3'] },
      { role: 'Bartender', count: 1, assignedStaff: ['staff4'] }
    ],
    menu: {
      id: 'menu1',
      name: 'Family Style Dinner',
      description: 'Shared plates with family favorites',
      items: [
        { name: 'Bruschetta', description: 'Fresh tomatoes and basil on grilled bread', price: 12 },
        { name: 'Lasagna', description: 'Homemade with beef and four cheeses', price: 24 },
        { name: 'Tiramisu', description: 'Classic Italian dessert', price: 10 }
      ]
    },
    createdBy: 'user1',
    createdAt: formatDate(currentYear, currentMonth - 1, 15),
    updatedAt: formatDate(currentYear, currentMonth - 1, 15)
  },
  {
    id: '2',
    name: 'Jazz Night',
    description: 'Weekly jazz performance featuring local artists',
    publicDescription: 'Join us for an evening of smooth jazz with the renowned local quartet "Blue Notes"',
    type: 'live-music',
    status: 'planning',
    startDate: formatDate(currentYear, currentMonth, 15),
    endDate: formatDate(currentYear, currentMonth, 15),
    startTime: '20:00',
    endTime: '23:00',
    isMultiDay: false,
    capacity: 50,
    bookedCount: 32,
    locationDetails: 'Bar Area + Lounge',
    resources: [
      { id: 'r3', name: 'Stage', type: 'section', quantity: 1 },
      { id: 'r4', name: 'Sound System', type: 'equipment', quantity: 1 }
    ],
    ticketPrice: 15,
    ticketSalesStart: formatDate(currentYear, currentMonth - 1, 15),
    ticketSalesEnd: formatDate(currentYear, currentMonth, 15),
    staffingRequirements: [
      { role: 'Server', count: 4 },
      { role: 'Bartender', count: 2 },
      { role: 'Host', count: 1 }
    ],
    createdBy: 'user1',
    createdAt: formatDate(currentYear, currentMonth - 2, 1),
    updatedAt: formatDate(currentYear, currentMonth - 1, 5)
  },
  {
    id: '3',
    name: 'Holiday Dinner Special',
    description: 'Special Christmas Eve dinner event',
    publicDescription: 'Celebrate Christmas Eve with our special holiday menu featuring seasonal favorites and festive cocktails',
    type: 'holiday-special',
    status: 'planning',
    startDate: formatDate(currentYear, currentMonth, 24),
    endDate: formatDate(currentYear, currentMonth, 24),
    startTime: '17:00',
    endTime: '23:00',
    isMultiDay: false,
    capacity: 80,
    bookedCount: 45,
    locationDetails: 'Entire Restaurant',
    resources: [
      { id: 'r5', name: 'Dining Room', type: 'room', quantity: 1 },
      { id: 'r6', name: 'Bar Area', type: 'section', quantity: 1 },
      { id: 'r7', name: 'Holiday Decorations', type: 'equipment', quantity: 1 }
    ],
    menu: {
      id: 'menu2',
      name: 'Christmas Eve Menu',
      description: 'Special holiday prix fixe menu',
      items: [
        { name: 'Winter Salad', description: 'Seasonal greens with cranberries and walnuts', price: 14 },
        { name: 'Prime Rib', description: '12oz prime rib with garlic mashed potatoes', price: 38 },
        { name: 'Yule Log Cake', description: 'Traditional holiday dessert', price: 12 }
      ]
    },
    staffingRequirements: [
      { role: 'Server', count: 8 },
      { role: 'Bartender', count: 2 },
      { role: 'Host', count: 2 },
      { role: 'Kitchen Staff', count: 6 }
    ],
    createdBy: 'user2',
    createdAt: formatDate(currentYear, currentMonth - 2, 15),
    updatedAt: formatDate(currentYear, currentMonth - 1, 10)
  },
  {
    id: '4',
    name: 'New Year\'s Eve Gala',
    description: 'Annual NYE celebration with special menu, live band, and champagne toast',
    publicDescription: 'Ring in the New Year with our exclusive gala featuring a five-course meal, live entertainment, and midnight champagne toast',
    type: 'public-ticketed',
    status: 'confirmed',
    startDate: formatDate(currentYear, currentMonth, 31),
    endDate: formatDate(currentYear, currentMonth + 1, 1),
    startTime: '20:00',
    endTime: '02:00',
    isMultiDay: true,
    capacity: 100,
    bookedCount: 82,
    locationDetails: 'Entire Restaurant',
    resources: [
      { id: 'r8', name: 'Dining Room', type: 'room', quantity: 1 },
      { id: 'r9', name: 'Bar Area', type: 'section', quantity: 1 },
      { id: 'r10', name: 'Lounge', type: 'section', quantity: 1 },
      { id: 'r11', name: 'DJ Equipment', type: 'equipment', quantity: 1 },
      { id: 'r12', name: 'Dance Floor', type: 'equipment', quantity: 1 }
    ],
    ticketPrice: 150,
    ticketSalesStart: formatDate(currentYear, currentMonth - 2, 1),
    ticketSalesEnd: formatDate(currentYear, currentMonth, 30),
    menu: {
      id: 'menu3',
      name: 'New Year\'s Eve Menu',
      description: 'Five-course gala dinner',
      items: [
        { name: 'Oysters', description: 'Fresh oysters with champagne mignonette', price: 18 },
        { name: 'Lobster Bisque', description: 'Creamy soup with brandy and cream', price: 16 },
        { name: 'Filet Mignon', description: '8oz filet with truffle mashed potatoes', price: 42 },
        { name: 'Chocolate Soufflé', description: 'With gold leaf and Grand Marnier', price: 14 }
      ]
    },
    staffingRequirements: [
      { role: 'Server', count: 10 },
      { role: 'Bartender', count: 4 },
      { role: 'Host', count: 3 },
      { role: 'Kitchen Staff', count: 8 },
      { role: 'Security', count: 2 }
    ],
    createdBy: 'user1',
    createdAt: formatDate(currentYear, currentMonth - 3, 1),
    updatedAt: formatDate(currentYear, currentMonth - 1, 15)
  },
  {
    id: '5',
    name: 'Corporate Lunch Meeting',
    description: 'Tech Corp quarterly planning lunch',
    type: 'corporate',
    status: 'confirmed',
    startDate: formatDate(currentYear, currentMonth, 10),
    endDate: formatDate(currentYear, currentMonth, 10),
    startTime: '12:00',
    endTime: '15:00',
    isMultiDay: false,
    capacity: 20,
    bookedCount: 18,
    locationDetails: 'Private Dining Room',
    resources: [
      { id: 'r13', name: 'Private Room', type: 'room', quantity: 1 },
      { id: 'r14', name: 'Projector', type: 'equipment', quantity: 1 },
      { id: 'r15', name: 'Conference Phone', type: 'equipment', quantity: 1 }
    ],
    minimumSpend: 800,
    menu: {
      id: 'menu4',
      name: 'Corporate Lunch',
      description: 'Business lunch menu',
      items: [
        { name: 'Sandwich Platter', description: 'Assorted gourmet sandwiches', price: 120 },
        { name: 'Garden Salad', description: 'Mixed greens with house dressing', price: 60 },
        { name: 'Fresh Fruit', description: 'Seasonal fruit platter', price: 45 }
      ]
    },
    staffingRequirements: [
      { role: 'Server', count: 2 },
      { role: 'Host', count: 1 }
    ],
    createdBy: 'user2',
    createdAt: formatDate(currentYear, currentMonth - 1, 20),
    updatedAt: formatDate(currentYear, currentMonth - 1, 20)
  }
];

// Generates events spread throughout the year for calendar view testing
export const generateYearEvents = (): Event[] => {
  const baseEvents = [...mockEvents];
  const yearEvents: Event[] = [];
  
  // Keep original events
  yearEvents.push(...baseEvents);
  
  // Generate recurring events throughout the year
  for (let month = 0; month < 12; month++) {
    if (month !== currentMonth) { // Skip current month as we already have those
      // Weekly jazz night on Fridays
      const firstFriday = new Date(currentYear, month, 1);
      while (firstFriday.getDay() !== 5) { // 5 is Friday
        firstFriday.setDate(firstFriday.getDate() + 1);
      }
      
      for (let i = 0; i < 4; i++) { // 4 Fridays per month
        const eventDate = new Date(firstFriday);
        eventDate.setDate(eventDate.getDate() + (i * 7));
        
        if (eventDate.getMonth() === month) {
          yearEvents.push({
            ...baseEvents[1], // Jazz Night template
            id: `jazz-${month}-${i}`,
            startDate: formatDate(currentYear, month, eventDate.getDate()),
            endDate: formatDate(currentYear, month, eventDate.getDate()),
            status: 'confirmed',
            createdAt: formatDate(currentYear, month - 1, 1),
            updatedAt: formatDate(currentYear, month - 1, 1)
          });
        }
      }
      
      // Monthly corporate lunch - first Wednesday
      const firstWed = new Date(currentYear, month, 1);
      while (firstWed.getDay() !== 3) { // 3 is Wednesday
        firstWed.setDate(firstWed.getDate() + 1);
      }
      
      yearEvents.push({
        ...baseEvents[4], // Corporate Lunch template
        id: `corp-${month}`,
        startDate: formatDate(currentYear, month, firstWed.getDate()),
        endDate: formatDate(currentYear, month, firstWed.getDate()),
        status: 'confirmed',
        createdAt: formatDate(currentYear, month - 1, 1),
        updatedAt: formatDate(currentYear, month - 1, 1)
      });
    }
  }
  
  return yearEvents;
};

// All events including recurring ones for the calendar view
export const allEvents = generateYearEvents();
