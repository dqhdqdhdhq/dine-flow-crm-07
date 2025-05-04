
import React from 'react';
import { format } from 'date-fns';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { 
  MoreVertical, 
  FileText, 
  Eye, 
  Edit, 
  CheckSquare, 
  DollarSign, 
  AlertTriangle 
} from 'lucide-react';
import { Invoice } from '@/types';
import { getInvoiceStatusColor, getInvoiceCategoryLabel, getInvoiceStatusLabel } from '@/data/invoicesData';

interface InvoicesTableProps {
  invoices: Invoice[];
  isFiltered?: boolean;
}

const InvoicesTable: React.FC<InvoicesTableProps> = ({ invoices, isFiltered = false }) => {
  return (
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
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.vendorName}</TableCell>
                <TableCell>{getInvoiceCategoryLabel(invoice.category)}</TableCell>
                <TableCell>{format(new Date(invoice.issueDate), 'MMM d, yyyy')}</TableCell>
                <TableCell className={invoice.status === 'overdue' ? 'text-red-600 font-medium' : ''}>
                  {format(new Date(invoice.dueDate), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getInvoiceStatusColor(invoice.status)}`}>
                    {getInvoiceStatusLabel(invoice.status)}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="cursor-pointer">
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>View Document</span>
                      </DropdownMenuItem>
                      {(invoice.status === 'pending-approval') && (
                        <DropdownMenuItem className="cursor-pointer">
                          <CheckSquare className="mr-2 h-4 w-4" />
                          <span>Approve</span>
                        </DropdownMenuItem>
                      )}
                      {(invoice.status === 'approved') && (
                        <DropdownMenuItem className="cursor-pointer">
                          <DollarSign className="mr-2 h-4 w-4" />
                          <span>Mark as Paid</span>
                        </DropdownMenuItem>
                      )}
                      {(invoice.status === 'overdue') && (
                        <DropdownMenuItem className="cursor-pointer">
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          <span>Send Reminder</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                {isFiltered ? 'No invoices match your filters' : 'No invoices found'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoicesTable;
