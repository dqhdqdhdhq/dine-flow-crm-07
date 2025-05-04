
import { Invoice } from '@/types';
import { addDays, subDays } from 'date-fns';

const today = new Date();

export const mockInvoices: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2025-001',
    vendorId: 'supplier-1',
    vendorName: 'Italian Imports Co.',
    category: 'food-supplies',
    issueDate: subDays(today, 20).toISOString(),
    dueDate: addDays(today, 10).toISOString(),
    amount: 1250.75,
    status: 'pending-approval',
    notes: 'Monthly food supply order',
    createdAt: subDays(today, 20).toISOString(),
    updatedAt: subDays(today, 20).toISOString(),
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2025-002',
    vendorId: 'supplier-2',
    vendorName: 'Premium Wines',
    category: 'food-supplies',
    issueDate: subDays(today, 15).toISOString(),
    dueDate: subDays(today, 5).toISOString(),
    amount: 3150.00,
    status: 'overdue',
    notes: 'Wine supply for May',
    createdAt: subDays(today, 15).toISOString(),
    updatedAt: subDays(today, 15).toISOString(),
  },
  {
    id: 'inv-003',
    invoiceNumber: 'UTIL-2025-042',
    vendorId: 'util-001',
    vendorName: 'City Power & Water',
    category: 'utilities',
    issueDate: subDays(today, 25).toISOString(),
    dueDate: subDays(today, 10).toISOString(),
    amount: 875.50,
    status: 'paid',
    paymentDate: subDays(today, 12).toISOString(),
    notes: 'April utility bill',
    createdAt: subDays(today, 25).toISOString(),
    updatedAt: subDays(today, 12).toISOString(),
  },
  {
    id: 'inv-004',
    invoiceNumber: 'RENT-2025-05',
    vendorId: 'prop-001',
    vendorName: 'Downtown Properties LLC',
    category: 'rent',
    issueDate: subDays(today, 7).toISOString(),
    dueDate: addDays(today, 8).toISOString(),
    amount: 5200.00,
    status: 'approved',
    notes: 'May rent',
    createdAt: subDays(today, 7).toISOString(),
    updatedAt: subDays(today, 5).toISOString(),
  },
  {
    id: 'inv-005',
    invoiceNumber: 'MNT-2025-013',
    vendorId: 'maint-001',
    vendorName: 'AllFix Maintenance',
    category: 'maintenance',
    issueDate: subDays(today, 3).toISOString(),
    dueDate: addDays(today, 27).toISOString(),
    amount: 450.75,
    status: 'pending-approval',
    notes: 'Emergency plumbing repair',
    createdAt: subDays(today, 3).toISOString(),
    updatedAt: subDays(today, 3).toISOString(),
  },
  {
    id: 'inv-006',
    invoiceNumber: 'MKT-2025-007',
    vendorId: 'mkt-001',
    vendorName: 'Digital Marketing Solutions',
    category: 'marketing',
    issueDate: subDays(today, 45).toISOString(),
    dueDate: subDays(today, 15).toISOString(),
    amount: 1800.00,
    status: 'partially-paid',
    paymentDate: subDays(today, 20).toISOString(),
    notes: 'First installment paid',
    createdAt: subDays(today, 45).toISOString(),
    updatedAt: subDays(today, 20).toISOString(),
  },
  {
    id: 'inv-007',
    invoiceNumber: 'PAY-2025-042',
    vendorId: 'pay-001',
    vendorName: 'PayrollPro Services',
    category: 'payroll',
    issueDate: subDays(today, 10).toISOString(),
    dueDate: addDays(today, 5).toISOString(),
    amount: 12450.75,
    status: 'approved',
    notes: 'April payroll processing fees',
    createdAt: subDays(today, 10).toISOString(),
    updatedAt: subDays(today, 8).toISOString(),
  }
];

export const getInvoiceStatusColor = (status: Invoice['status']): string => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'partially-paid':
      return 'bg-blue-100 text-blue-800';
    case 'approved':
      return 'bg-purple-100 text-purple-800';
    case 'pending-approval':
      return 'bg-yellow-100 text-yellow-800';
    case 'overdue':
      return 'bg-red-100 text-red-800';
    case 'disputed':
      return 'bg-orange-100 text-orange-800';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getInvoiceCategoryLabel = (category: Invoice['category']): string => {
  switch (category) {
    case 'food-supplies':
      return 'Food Supplies';
    case 'utilities':
      return 'Utilities';
    case 'rent':
      return 'Rent';
    case 'marketing':
      return 'Marketing';
    case 'maintenance':
      return 'Maintenance';
    case 'payroll':
      return 'Payroll';
    case 'other':
      return 'Other';
    default:
      return 'Unknown';
  }
};

export const getInvoiceStatusLabel = (status: Invoice['status']): string => {
  switch (status) {
    case 'paid':
      return 'Paid';
    case 'partially-paid':
      return 'Partially Paid';
    case 'approved':
      return 'Approved';
    case 'pending-approval':
      return 'Pending Approval';
    case 'overdue':
      return 'Overdue';
    case 'disputed':
      return 'Disputed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Unknown';
  }
};
