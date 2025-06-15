import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Invoice } from '@/types';
import { Button } from '@/components/ui/button';
import { getInvoiceStatusColor, getInvoiceCategoryLabel, getInvoiceStatusLabel } from '@/data/invoicesData';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar, Tag, DollarSign, FileText, Briefcase, Hash, MoreVertical, CheckCircle, ShieldX, Download, History, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

interface Activity {
  action: string;
  user: string;
  timestamp: string;
}

interface InvoiceDetailViewProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateInvoice: (invoice: Invoice, action: string) => void;
  activities: Activity[];
}

const DetailRow: React.FC<{ icon: React.ElementType, label: string, value: string | React.ReactNode }> = ({ icon: Icon, label, value }) => (
    <div className="flex items-start justify-between py-3">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Icon className="h-4 w-4" />
            <span>{label}</span>
        </div>
        <div className="text-sm font-medium text-right">{value}</div>
    </div>
);

const getActionVerb = (action: string) => {
    switch(action) {
        case 'Approve': return 'approved';
        case 'Dispute': return 'disputed';
        case 'Mark as Paid': return 'marked as paid';
        default: return `performed: ${action}`;
    }
}

const ActivityItem: React.FC<{ activity: Activity }> = ({ activity }) => (
    <div className="flex items-start gap-4 py-2">
        <div className="flex-shrink-0">
            <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                <User className="h-5 w-5 text-muted-foreground" />
            </div>
        </div>
        <div>
            <p className="text-sm">
                <span className="font-semibold">{activity.user}</span>
                <span className="text-muted-foreground"> {getActionVerb(activity.action)} this invoice.</span>
            </p>
            <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
            </p>
        </div>
    </div>
);


const ActivityHistory: React.FC<{ activities: Activity[] }> = ({ activities }) => {
    if (!activities) return null;

    return (
        <div className="py-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                <History className="h-4 w-4" />
                <span>Activity History</span>
            </div>
            {activities.length === 0 ? (
                 <p className="text-sm text-muted-foreground text-center py-4">No activity yet.</p>
            ) : (
                <div className="space-y-2">
                    {[...activities].reverse().map((activity, index) => (
                        <ActivityItem key={index} activity={activity} />
                    ))}
                </div>
            )}
        </div>
    );
};


const InvoiceDetailView: React.FC<InvoiceDetailViewProps> = ({ invoice, isOpen, onClose, onUpdateInvoice, activities }) => {
  if (!invoice) return null;

  const handleAction = (action: string) => {
    if (!invoice) return;

    let updatedInvoice: Invoice = { ...invoice, updatedAt: new Date().toISOString() };
    let toastMessage = "";

    switch (action) {
      case 'Approve':
        updatedInvoice.status = 'approved';
        toastMessage = `Invoice #${invoice.invoiceNumber} has been approved.`;
        break;
      case 'Mark as Paid':
        updatedInvoice.status = 'paid';
        updatedInvoice.paymentDate = new Date().toISOString();
        toastMessage = `Invoice #${invoice.invoiceNumber} marked as paid.`;
        break;
      case 'Dispute':
        updatedInvoice.status = 'disputed';
        toastMessage = `Invoice #${invoice.invoiceNumber} has been disputed.`;
        break;
      case 'Download PDF':
        toast.info(`Downloading PDF for invoice #${invoice.invoiceNumber}...`);
        return;
      default:
        return;
    }

    onUpdateInvoice(updatedInvoice, action);
    toast.success(toastMessage);
    onClose();
  };

  const statusLabel = getInvoiceStatusLabel(invoice.status);
  const statusColor = getInvoiceStatusColor(invoice.status);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-6">
          <SheetTitle className="text-2xl">Invoice {invoice.invoiceNumber}</SheetTitle>
          <SheetDescription>
            From {invoice.vendorName}
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 px-6">
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Badge className={`${statusColor} hover:${statusColor} text-sm`}>{statusLabel}</Badge>
                    <div className="text-3xl font-bold text-right">${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                </div>
                
                <Separator />

                <DetailRow icon={Briefcase} label="Vendor" value={invoice.vendorName} />
                <DetailRow icon={Hash} label="Invoice #" value={invoice.invoiceNumber} />
                <DetailRow icon={Tag} label="Category" value={getInvoiceCategoryLabel(invoice.category)} />
                
                <Separator />
                
                <DetailRow icon={Calendar} label="Issue Date" value={format(new Date(invoice.issueDate), 'MMM dd, yyyy')} />
                <DetailRow icon={Calendar} label="Due Date" value={format(new Date(invoice.dueDate), 'MMM dd, yyyy')} />
                {invoice.paymentDate && <DetailRow icon={DollarSign} label="Payment Date" value={format(new Date(invoice.paymentDate), 'MMM dd, yyyy')} />}
                
                <Separator />

                {invoice.notes && (
                  <div className="py-3">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                          <FileText className="h-4 w-4" />
                          <span>Notes</span>
                      </div>
                      <p className="text-sm bg-muted/50 p-3 rounded-md">{invoice.notes}</p>
                  </div>
                )}
                
                <Separator />
                <ActivityHistory activities={activities} />

            </div>
        </ScrollArea>
        <SheetFooter className="p-6 bg-muted/30 border-t">
          <Button variant="outline" asChild>
            <SheetClose>Close</SheetClose>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                Take Action
                <MoreVertical className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {invoice.status === 'pending-approval' && (
                <DropdownMenuItem onSelect={() => handleAction('Approve')}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span>Approve</span>
                </DropdownMenuItem>
              )}
              {(invoice.status === 'approved' || invoice.status === 'overdue') && (
                <DropdownMenuItem onSelect={() => handleAction('Mark as Paid')}>
                  <DollarSign className="mr-2 h-4 w-4" />
                  <span>Mark as Paid</span>
                </DropdownMenuItem>
              )}
              {!['disputed', 'cancelled', 'paid', 'partially-paid'].includes(invoice.status) && (
                <DropdownMenuItem onSelect={() => handleAction('Dispute')}>
                  <ShieldX className="mr-2 h-4 w-4" />
                  <span>Dispute Invoice</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => handleAction('Download PDF')}>
                <Download className="mr-2 h-4 w-4" />
                <span>Download PDF</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default InvoiceDetailView;
