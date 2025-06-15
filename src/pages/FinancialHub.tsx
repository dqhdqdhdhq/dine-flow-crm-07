
import React, { useState, useMemo } from 'react';
import { Shield, FileText } from 'lucide-react';
import InvoiceMetrics from '@/components/invoices/InvoiceMetrics';
import InvoicesTable from '@/components/invoices/InvoicesTable';
import InvoiceFilterBar from '@/components/invoices/InvoiceFilterBar';
import AddInvoiceDialog from '@/components/invoices/AddInvoiceDialog';
import InvoiceDetailView from '@/components/invoices/InvoiceDetailView';
import { mockInvoices } from '@/data/invoicesData';
import { Invoice, InvoiceStatus, InvoiceCategory } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';

const FinancialHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<InvoiceCategory | 'all'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

  const filteredInvoices = useMemo(() => mockInvoices.filter((invoice) => {
    const matchesSearch = searchQuery === '' || 
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.amount.toString().includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || invoice.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  }), [searchQuery, statusFilter, categoryFilter]);

  const actionableInvoices = useMemo(() => mockInvoices.filter(invoice => 
    ['pending-approval', 'overdue', 'disputed'].includes(invoice.status)
  ).sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()), []);


  const isFiltered = searchQuery !== '' || statusFilter !== 'all' || categoryFilter !== 'all';

  const handleInvoiceClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailViewOpen(true);
  };

  const closeDetailView = () => {
    setIsDetailViewOpen(false);
    // Give sheet time to close before clearing data
    setTimeout(() => setSelectedInvoice(null), 300);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Hub</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-secondary text-secondary-foreground p-2 rounded-md flex items-center gap-2 text-xs font-medium">
            <Shield className="h-4 w-4" />
            <span>Admin Access</span>
          </div>
          <AddInvoiceDialog />
        </div>
      </div>

      <InvoiceMetrics invoices={mockInvoices} />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[300px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="all">All Invoices</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
            <Card>
                <CardContent className="p-4 sm:p-6">
                    <h3 className="text-lg font-semibold mb-4">Actionable Invoices</h3>
                    <InvoicesTable 
                        invoices={actionableInvoices} 
                        isFiltered={false}
                        onInvoiceClick={handleInvoiceClick}
                    />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="all" className="mt-4 space-y-4">
          <InvoiceFilterBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
          />
          <Card>
            <CardContent className="p-0">
              <InvoicesTable 
                invoices={filteredInvoices} 
                isFiltered={isFiltered}
                onInvoiceClick={handleInvoiceClick}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <InvoiceDetailView 
        invoice={selectedInvoice}
        isOpen={isDetailViewOpen}
        onClose={closeDetailView}
      />
    </div>
  );
};

export default FinancialHub;
