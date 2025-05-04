
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Invoice } from '@/types';
import { format } from 'date-fns';

interface InvoiceMetricsProps {
  invoices: Invoice[];
}

const InvoiceMetrics: React.FC<InvoiceMetricsProps> = ({ invoices }) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  // Calculate metrics
  const totalDueThisMonth = invoices
    .filter(invoice => {
      const dueDate = new Date(invoice.dueDate);
      return (
        dueDate.getMonth() === currentMonth &&
        dueDate.getFullYear() === currentYear &&
        ['pending-approval', 'approved', 'overdue'].includes(invoice.status)
      );
    })
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const totalOverdue = invoices
    .filter(invoice => invoice.status === 'overdue')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const totalPaidThisMonth = invoices
    .filter(invoice => {
      if (!invoice.paymentDate) return false;
      const paymentDate = new Date(invoice.paymentDate);
      return (
        paymentDate.getMonth() === currentMonth &&
        paymentDate.getFullYear() === currentYear &&
        ['paid', 'partially-paid'].includes(invoice.status)
      );
    })
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const pendingApprovals = invoices
    .filter(invoice => invoice.status === 'pending-approval')
    .length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm font-medium text-muted-foreground mb-1">Due This Month</div>
          <div className="text-2xl font-bold">${totalDueThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm font-medium text-red-500 mb-1">Total Overdue</div>
          <div className="text-2xl font-bold">${totalOverdue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm font-medium text-green-600 mb-1">Paid This Month</div>
          <div className="text-2xl font-bold">${totalPaidThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm font-medium text-yellow-600 mb-1">Pending Approvals</div>
          <div className="text-2xl font-bold">{pendingApprovals}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceMetrics;
