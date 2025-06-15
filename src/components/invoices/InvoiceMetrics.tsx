import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Invoice } from '@/types';
import { DollarSign, AlertOctagon, CheckCircle, Hourglass } from 'lucide-react';
import { format } from 'date-fns';

interface InvoiceMetricsProps {
  invoices: Invoice[];
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  colorClassName?: string;
  subtleText?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, colorClassName, subtleText }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 text-muted-foreground ${colorClassName}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {subtleText && <p className="text-xs text-muted-foreground">{subtleText}</p>}
    </CardContent>
  </Card>
);

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Due This Month"
        value={`$${totalDueThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
        icon={DollarSign}
        subtleText={`for ${new Date().toLocaleString('default', { month: 'long' })}`}
      />
      <MetricCard
        title="Total Overdue"
        value={`$${totalOverdue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
        icon={AlertOctagon}
        colorClassName="text-red-500"
      />
      <MetricCard
        title="Paid This Month"
        value={`$${totalPaidThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
        icon={CheckCircle}
        colorClassName="text-green-600"
      />
      <MetricCard
        title="Pending Approvals"
        value={String(pendingApprovals)}
        icon={Hourglass}
        colorClassName="text-yellow-600"
        subtleText="invoices awaiting action"
      />
    </div>
  );
};

export default InvoiceMetrics;
