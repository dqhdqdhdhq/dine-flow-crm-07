
import React from 'react';
import { format } from 'date-fns';
import { Invoice } from '@/types';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { getInvoiceStatusColor, getInvoiceCategoryLabel } from '@/data/invoicesData';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { Eye, CheckCircle, DollarSign, ShieldX, Download } from 'lucide-react';

interface InvoicesTableProps {
  invoices: Invoice[];
  isFiltered: boolean;
  onInvoiceClick: (invoice: Invoice) => void;
}

const InvoicesTable: React.FC<InvoicesTableProps> = ({ invoices, isFiltered, onInvoiceClick }) => {
  const handleAction = (action: string, invoiceId: string) => {
    // In a real app, this would dispatch an action to the backend
    console.log(`Action: ${action} on Invoice ID: ${invoiceId}`);
    // You could show a toast notification here, e.g. toast.success(...)
  };
  
  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <ContextMenu key={invoice.id}>
                  <ContextMenuTrigger asChild>
                    <TableRow onClick={() => onInvoiceClick(invoice)} className="cursor-pointer hover:bg-muted">
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.vendorName}</TableCell>
                      <TableCell>{getInvoiceCategoryLabel(invoice.category)}</TableCell>
                      <TableCell>{format(new Date(invoice.issueDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getInvoiceStatusColor(invoice.status)}`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1).replace('-', ' ')}
                        </span>
                      </TableCell>
                    </TableRow>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-48">
                    <ContextMenuItem onSelect={() => onInvoiceClick(invoice)}>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>View Details</span>
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    {invoice.status === 'pending-approval' && (
                      <ContextMenuItem onSelect={() => handleAction('Approve', invoice.id)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        <span>Approve</span>
                      </ContextMenuItem>
                    )}
                    {(invoice.status === 'approved' || invoice.status === 'overdue') && (
                      <ContextMenuItem onSelect={() => handleAction('Mark as Paid', invoice.id)}>
                        <DollarSign className="mr-2 h-4 w-4" />
                        <span>Mark as Paid</span>
                      </ContextMenuItem>
                    )}
                    {!['disputed', 'cancelled', 'paid', 'partially-paid'].includes(invoice.status) && (
                      <ContextMenuItem onSelect={() => handleAction('Dispute', invoice.id)}>
                        <ShieldX className="mr-2 h-4 w-4" />
                        <span>Dispute Invoice</span>
                      </ContextMenuItem>
                    )}
                    <ContextMenuSeparator />
                    <ContextMenuItem onSelect={() => handleAction('Download PDF', invoice.id)}>
                      <Download className="mr-2 h-4 w-4" />
                      <span>Download PDF</span>
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {isFiltered ? 'No matching invoices found.' : 'No invoices to display.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-xs text-muted-foreground mt-2 px-1">
        {invoices.length} {invoices.length === 1 ? 'invoice' : 'invoices'} {isFiltered ? 'matching filters' : 'total'}
      </div>
    </div>
  );
};

export default InvoicesTable;
