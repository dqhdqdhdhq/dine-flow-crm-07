
import React, { useState } from 'react';
import { Shield, FileText } from 'lucide-react';
import InvoiceMetrics from '@/components/invoices/InvoiceMetrics';
import InvoicesTable from '@/components/invoices/InvoicesTable';
import InvoiceFilterBar from '@/components/invoices/InvoiceFilterBar';
import AddInvoiceDialog from '@/components/invoices/AddInvoiceDialog';
import { mockInvoices } from '@/data/invoicesData';
import { Invoice, InvoiceStatus, InvoiceCategory } from '@/types';

const FinancialHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<InvoiceCategory | 'all'>('all');

  // Apply filters
  const filteredInvoices = mockInvoices.filter((invoice) => {
    // Text search
    const matchesSearch = searchQuery === '' || 
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.amount.toString().includes(searchQuery);
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || invoice.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const isFiltered = searchQuery !== '' || statusFilter !== 'all' || categoryFilter !== 'all';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Admin indicator banner */}
      <div className="bg-[#1A1F2C] text-white p-2 rounded-md flex items-center gap-2 mb-4">
        <Shield className="h-4 w-4" />
        <span className="text-sm font-medium">Administrator Access</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-[#9b87f5]" />
          <h1 className="text-3xl font-bold tracking-tight">Financial Hub</h1>
        </div>
        <AddInvoiceDialog />
      </div>

      {/* Metrics Cards */}
      <InvoiceMetrics invoices={mockInvoices} />

      {/* Filter Bar */}
      <InvoiceFilterBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />

      {/* Invoices Table */}
      <InvoicesTable invoices={filteredInvoices} isFiltered={isFiltered} />
    </div>
  );
};

export default FinancialHub;
