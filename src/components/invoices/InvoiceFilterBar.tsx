
import React, { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { InvoiceStatus, InvoiceCategory } from '@/types';
import { getInvoiceCategoryLabel, getInvoiceStatusLabel } from '@/data/invoicesData';

interface InvoiceFilterBarProps {
  statusFilter: InvoiceStatus | 'all';
  setStatusFilter: (status: InvoiceStatus | 'all') => void;
  categoryFilter: InvoiceCategory | 'all';
  setCategoryFilter: (category: InvoiceCategory | 'all') => void;
}

const InvoiceFilterBar: React.FC<InvoiceFilterBarProps> = ({
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="space-y-2 rounded-lg border px-4 py-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h4 className="text-md font-semibold">
            Filter by
          </h4>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0 group">
            <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="data-[state=open]:pt-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <Select 
              value={statusFilter} 
              onValueChange={(value) => setStatusFilter(value as InvoiceStatus | 'all')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending-approval">{getInvoiceStatusLabel('pending-approval')}</SelectItem>
                <SelectItem value="approved">{getInvoiceStatusLabel('approved')}</SelectItem>
                <SelectItem value="paid">{getInvoiceStatusLabel('paid')}</SelectItem>
                <SelectItem value="partially-paid">{getInvoiceStatusLabel('partially-paid')}</SelectItem>
                <SelectItem value="overdue">{getInvoiceStatusLabel('overdue')}</SelectItem>
                <SelectItem value="disputed">{getInvoiceStatusLabel('disputed')}</SelectItem>
                <SelectItem value="cancelled">{getInvoiceStatusLabel('cancelled')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <Select 
              value={categoryFilter} 
              onValueChange={(value) => setCategoryFilter(value as InvoiceCategory | 'all')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="food-supplies">{getInvoiceCategoryLabel('food-supplies')}</SelectItem>
                <SelectItem value="utilities">{getInvoiceCategoryLabel('utilities')}</SelectItem>
                <SelectItem value="rent">{getInvoiceCategoryLabel('rent')}</SelectItem>
                <SelectItem value="marketing">{getInvoiceCategoryLabel('marketing')}</SelectItem>
                <SelectItem value="maintenance">{getInvoiceCategoryLabel('maintenance')}</SelectItem>
                <SelectItem value="payroll">{getInvoiceCategoryLabel('payroll')}</SelectItem>
                <SelectItem value="other">{getInvoiceCategoryLabel('other')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default InvoiceFilterBar;
