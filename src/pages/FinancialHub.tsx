import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, ChevronDown } from 'lucide-react';
import InvoiceMetrics from '@/components/invoices/InvoiceMetrics';
import InvoiceList from '@/components/invoices/InvoiceList';
import InvoiceFilterBar from '@/components/invoices/InvoiceFilterBar';
import AddInvoiceDialog from '@/components/invoices/AddInvoiceDialog';
import InvoiceDetailView from '@/components/invoices/InvoiceDetailView';
import SpendingsChart from '@/components/invoices/SpendingsChart';
import { mockInvoices } from '@/data/invoicesData';
import { Invoice, InvoiceStatus, InvoiceCategory } from '@/types';
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { differenceInDays } from 'date-fns';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type View = 'action-required' | 'recent-activity' | 'all-invoices';

const FinancialHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<InvoiceCategory | 'all'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [activeView, setActiveView] = useState<View>('action-required');
  const [isChartOpen, setIsChartOpen] = useState(true);

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
      
      <Collapsible open={isChartOpen} onOpenChange={setIsChartOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full flex justify-between items-center px-2 py-1.5 text-lg font-bold tracking-tight">
            Visual Overview
            <ChevronDown className={cn("h-5 w-5 transition-transform", isChartOpen && "rotate-180")} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <SpendingsChart invoices={mockInvoices} />
            </motion.div>
        </CollapsibleContent>
      </Collapsible>
      
      <SegmentedControl
        options={TABS}
        value={activeView}
        onValueChange={(value) => setActiveView(value as View)}
        className="py-2"
      />

      <motion.div
        key={activeView}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeView === 'action-required' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight px-1">Action Required</h3>
            <InvoiceList 
                invoices={actionableInvoices} 
                isFiltered={false}
                onInvoiceClick={handleInvoiceClick}
            />
          </div>
        )}
        {activeView === 'recent-activity' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight px-1">Recent Activity (Last 7 Days)</h3>
            <InvoiceList 
              invoices={recentInvoices} 
              isFiltered={false}
              onInvoiceClick={handleInvoiceClick}
            />
          </div>
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
            <InvoiceList 
              invoices={filteredInvoices} 
              isFiltered={isFiltered}
              onInvoiceClick={handleInvoiceClick}
            />
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
