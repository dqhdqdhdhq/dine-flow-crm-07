
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import InvoiceMetrics from '@/components/invoices/InvoiceMetrics';
import InvoicesTable from '@/components/invoices/InvoicesTable';
import InvoiceFilterBar from '@/components/invoices/InvoiceFilterBar';
import AddInvoiceDialog from '@/components/invoices/AddInvoiceDialog';
import InvoiceDetailView from '@/components/invoices/InvoiceDetailView';
import { mockInvoices } from '@/data/invoicesData';
import { Invoice, InvoiceStatus, InvoiceCategory } from '@/types';
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Card, CardContent } from '@/components/ui/card';
import { differenceInDays } from 'date-fns';

type View = 'action-required' | 'recent-activity' | 'all-invoices';

const FinancialHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<InvoiceCategory | 'all'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [activeView, setActiveView] = useState<View>('action-required');

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

  const recentInvoices = useMemo(() => {
    const today = new Date();
    return mockInvoices
        .filter(invoice => differenceInDays(today, new Date(invoice.updatedAt)) <= 7)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, []);

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

  const TABS: { label: string; value: View }[] = [
    { label: "Action Required", value: "action-required" },
    { label: "Recent Activity", value: "recent-activity" },
    { label: "All Invoices", value: "all-invoices" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Financial Hub</h1>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Admin Access</span>
          </div>
          {/* Will be replaced by a FAB */}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <InvoiceMetrics invoices={mockInvoices} />
      </motion.div>
      
      <SegmentedControl
        options={TABS}
        value={activeView}
        onValueChange={(value) => setActiveView(value)}
        className="py-2"
      />

      <motion.div
        key={activeView}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeView === 'action-required' && (
          <Card className="bg-card/80 dark:bg-card/60 backdrop-blur-xl">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">Action Required</h3>
              <InvoicesTable 
                  invoices={actionableInvoices} 
                  isFiltered={false}
                  onInvoiceClick={handleInvoiceClick}
              />
            </CardContent>
          </Card>
        )}
        {activeView === 'recent-activity' && (
          <Card className="bg-card/80 dark:bg-card/60 backdrop-blur-xl">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity (Last 7 Days)</h3>
              <InvoicesTable 
                invoices={recentInvoices} 
                isFiltered={false}
                onInvoiceClick={handleInvoiceClick}
              />
            </CardContent>
          </Card>
        )}
        {activeView === 'all-invoices' && (
          <div className="space-y-4">
            <InvoiceFilterBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
            />
            <Card className="bg-card/80 dark:bg-card/60 backdrop-blur-xl">
              <CardContent className="p-0">
                <InvoicesTable 
                  invoices={filteredInvoices} 
                  isFiltered={isFiltered}
                  onInvoiceClick={handleInvoiceClick}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>

      <InvoiceDetailView 
        invoice={selectedInvoice}
        isOpen={isDetailViewOpen}
        onClose={closeDetailView}
      />

      <motion.div
        initial={{ scale: 0, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <AddInvoiceDialog />
      </motion.div>
    </div>
  );
};

export default FinancialHub;
