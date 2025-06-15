
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Invoice } from '@/types';
import { DollarSign, AlertOctagon, CheckCircle, Hourglass } from 'lucide-react';
import { cn } from "@/lib/utils";

interface InvoiceMetricsProps {
  invoices: Invoice[];
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  variant?: 'default' | 'critical' | 'warning' | 'success';
  subtleText?: string;
}

const variantClasses = {
  default: 'bg-card',
  critical: 'bg-red-50 dark:bg-red-900/20',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20',
  success: 'bg-green-50 dark:bg-green-900/20',
};

const iconVariantClasses = {
    default: 'text-muted-foreground',
    critical: 'text-red-500',
    warning: 'text-yellow-600',
    success: 'text-green-600',
};

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, variant = 'default', subtleText }) => (
  <Card className={cn("transition-shadow hover:shadow-md", variantClasses[variant])}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={cn("h-4 w-4", iconVariantClasses[variant])} />
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Due This Month"
        value={`$${totalDueThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
        icon={DollarSign}
        subtleText={`for ${new Date().toLocaleString('default', { month: 'long' })}`}
        variant="default"
      />
      <MetricCard
        title="Total Overdue"
        value={`$${totalOverdue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
        icon={AlertOctagon}
        variant="critical"
      />
      <MetricCard
        title="Paid This Month"
        value={`$${totalPaidThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
        icon={CheckCircle}
        variant="success"
      />
      <MetricCard
        title="Pending Approvals"
        value={String(pendingApprovals)}
        icon={Hourglass}
        subtleText="invoices awaiting action"
        variant="warning"
      />
    </div>
  );
};

export default InvoiceMetrics;
