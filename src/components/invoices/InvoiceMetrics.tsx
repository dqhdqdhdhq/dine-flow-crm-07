
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Invoice } from '@/types';
import { DollarSign, AlertOctagon, CheckCircle, Hourglass } from 'lucide-react';
import { cn } from "@/lib/utils";
import AnimatedCounter from '@/components/ui/AnimatedCounter';

interface InvoiceMetricsProps {
  invoices: Invoice[];
}

interface MetricCardProps {
  title: string;
  value: string | JSX.Element;
  icon: React.ElementType;
  variant?: 'default' | 'critical' | 'warning' | 'success';
  subtleText?: string;
}

const variantClasses = {
  default: 'bg-card',
  critical: 'bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-200 !border-rose-200 dark:!border-rose-900',
  warning: 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 !border-amber-200 dark:!border-amber-900',
  success: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 !border-emerald-200 dark:!border-emerald-900',
};

const iconVariantClasses = {
    default: 'text-muted-foreground',
    critical: 'text-rose-500 dark:text-rose-400',
    warning: 'text-amber-500 dark:text-amber-400',
    success: 'text-emerald-500 dark:text-emerald-400',
};

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, variant = 'default', subtleText }) => (
  <Card className={cn("transition-shadow hover:shadow-lg", variantClasses[variant])}>
    <CardHeader className="flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-5 w-5", iconVariantClasses[variant])} />
    </CardHeader>
    <CardContent className="p-4 pt-0">
      <div className="text-3xl font-bold tracking-tight">{value}</div>
      {subtleText && <p className="text-xs text-muted-foreground mt-1">{subtleText}</p>}
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
        value={<AnimatedCounter value={totalDueThisMonth} prefix="$" />}
        icon={DollarSign}
        subtleText={`for ${new Date().toLocaleString('default', { month: 'long' })}`}
        variant="default"
      />
      <MetricCard
        title="Total Overdue"
        value={<AnimatedCounter value={totalOverdue} prefix="$" />}
        icon={AlertOctagon}
        variant="critical"
      />
      <MetricCard
        title="Paid This Month"
        value={<AnimatedCounter value={totalPaidThisMonth} prefix="$" />}
        icon={CheckCircle}
        variant="success"
      />
      <MetricCard
        title="Pending Approvals"
        value={<AnimatedCounter value={pendingApprovals} fractionDigits={0} />}
        icon={Hourglass}
        subtleText="invoices awaiting action"
        variant="warning"
      />
    </div>
  );
};

export default InvoiceMetrics;
