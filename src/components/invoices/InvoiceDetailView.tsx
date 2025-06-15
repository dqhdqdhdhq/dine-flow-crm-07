
import React from 'react';
import { format } from 'date-fns';
import { Invoice, InvoiceStatus } from '@/types';
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
import { Calendar, User, Tag, DollarSign, FileText, Briefcase, Hash } from 'lucide-react';

interface InvoiceDetailViewProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
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


const InvoiceDetailView: React.FC<InvoiceDetailViewProps> = ({ invoice, isOpen, onClose }) => {
  if (!invoice) return null;

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

                <div className="py-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                        <FileText className="h-4 w-4" />
                        <span>Description</span>
                    </div>
                    <p className="text-sm bg-muted/50 p-3 rounded-md">{invoice.description}</p>
                </div>
            </div>
        </ScrollArea>
        <SheetFooter className="p-6 bg-muted/30 border-t">
          <Button variant="outline" asChild>
            <SheetClose>Close</SheetClose>
          </Button>
          <Button>Take Action</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default InvoiceDetailView;
