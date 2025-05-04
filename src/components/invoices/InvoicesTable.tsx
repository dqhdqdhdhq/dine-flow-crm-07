
import React from 'react';
import { format } from 'date-fns';
import { Invoice } from '@/types';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { getInvoiceStatusColor, getInvoiceCategoryLabel } from '@/data/invoicesData';

interface InvoicesTableProps {
  invoices: Invoice[];
  isFiltered: boolean;
  onInvoiceClick: (invoice: Invoice) => void;
}

const InvoicesTable: React.FC<InvoicesTableProps> = ({ invoices, isFiltered, onInvoiceClick }) => {
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
                <TableRow key={invoice.id} onClick={() => onInvoiceClick(invoice)} className="cursor-pointer hover:bg-muted">
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {isFiltered ? 'No matching invoices found.' : 'No invoices available.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-xs text-muted-foreground mt-2">
        {invoices.length} {invoices.length === 1 ? 'invoice' : 'invoices'} {isFiltered ? 'matching filters' : 'total'}
      </div>
    </div>
  );
};

export default InvoicesTable;
