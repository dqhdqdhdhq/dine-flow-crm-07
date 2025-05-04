
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InvoiceStatus, InvoiceCategory } from '@/types';
import { getInvoiceCategoryLabel, getInvoiceStatusLabel } from '@/data/invoicesData';

interface InvoiceFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: InvoiceStatus | 'all';
  setStatusFilter: (status: InvoiceStatus | 'all') => void;
  categoryFilter: InvoiceCategory | 'all';
  setCategoryFilter: (category: InvoiceCategory | 'all') => void;
}

const InvoiceFilterBar: React.FC<InvoiceFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search invoices by number, vendor, or amount..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <div className="w-40">
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
        
        <div className="w-40">
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
        
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          More Filters
        </Button>
      </div>
    </div>
  );
};

export default InvoiceFilterBar;
