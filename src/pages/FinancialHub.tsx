import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, ChevronDown, Search } from 'lucide-react';
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
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";

type View = 'action-required' | 'recent-activity' | 'all-invoices';

type Activity = {
  action: string;
  user: string;
  timestamp: string;
};

const FinancialHub: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [activities, setActivities] = useState<Record<string, Activity[]>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<InvoiceCategory | 'all'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [activeView, setActiveView] = useState<View>('action-required');
  const [isChartOpen, setIsChartOpen] = useState(true);

  const applySearch = (invoices: Invoice[], query: string) => {
    if (query === '') return invoices;
    const lowerCaseQuery = query.toLowerCase();
    return invoices.filter((invoice) => 
      invoice.invoiceNumber.toLowerCase().includes(lowerCaseQuery) ||
      invoice.vendorName.toLowerCase().includes(lowerCaseQuery) ||
      invoice.amount.toString().includes(query)
    );
  }

  const filteredInvoices = useMemo(() => {
    const baseInvoices = invoices.filter((invoice) => {
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || invoice.category === categoryFilter;
      return matchesStatus && matchesCategory;
    });
    return applySearch(baseInvoices, searchQuery);
  }, [invoices, searchQuery, statusFilter, categoryFilter]);

  const actionableInvoices = useMemo(() => {
    const baseInvoices = invoices.filter(invoice => 
      ['pending-approval', 'overdue', 'disputed'].includes(invoice.status)
    ).sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    return applySearch(baseInvoices, searchQuery);
  }, [invoices, searchQuery]);

  const recentInvoices = useMemo(() => {
    const today = new Date();
    const baseInvoices = invoices
        .filter(invoice => differenceInDays(today, new Date(invoice.updatedAt)) <= 7)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return applySearch(baseInvoices, searchQuery);
  }, [invoices, searchQuery]);

  const handleInvoiceClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailViewOpen(true);
  };

  const closeDetailView = () => {
    setIsDetailViewOpen(false);
    // Give sheet time to close before clearing data
    setTimeout(() => setSelectedInvoice(null), 300);
  };

  const handleUpdateInvoice = (updatedInvoice: Invoice, action: string) => {
    setInvoices(prevInvoices => 
      prevInvoices.map(inv => (inv.id === updatedInvoice.id ? updatedInvoice : inv))
    );
    if (selectedInvoice && selectedInvoice.id === updatedInvoice.id) {
      setSelectedInvoice(updatedInvoice);
    }
    
    const newActivity: Activity = {
      action,
      user: 'Admin', // In a real app, this would be the logged-in user
      timestamp: new Date().toISOString(),
    };

    setActivities(prev => ({
        ...prev,
        [updatedInvoice.id]: [...(prev[updatedInvoice.id] || []), newActivity]
    }));
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
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <InvoiceMetrics invoices={invoices} />
      </motion.div>
      
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by vendor, invoice #, or amount..."
          className="w-full pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="w-full overflow-x-auto pb-2 no-scrollbar">
        <SegmentedControl
          options={TABS}
          value={activeView}
          onValueChange={(value) => setActiveView(value as View)}
          className="py-2 min-w-max"
        />
      </div>

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
                isFiltered={searchQuery !== ''}
                onInvoiceClick={handleInvoiceClick}
            />
          </div>
        )}
        {activeView === 'recent-activity' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight px-1">Recent Activity (Last 7 Days)</h3>
            <InvoiceList 
              invoices={recentInvoices} 
              isFiltered={searchQuery !== ''}
              onInvoiceClick={handleInvoiceClick}
            />
          </div>
        )}
        {activeView === 'all-invoices' && (
          <div className="space-y-4">
            <InvoiceFilterBar 
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
            />
            <InvoiceList 
              invoices={filteredInvoices} 
              isFiltered={searchQuery !== '' || statusFilter !== 'all' || categoryFilter !== 'all'}
              onInvoiceClick={handleInvoiceClick}
            />
          </div>
        )}
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
              <SpendingsChart invoices={invoices} />
            </motion.div>
        </CollapsibleContent>
      </Collapsible>

      <InvoiceDetailView 
        invoice={selectedInvoice}
        isOpen={isDetailViewOpen}
        onClose={closeDetailView}
        onUpdateInvoice={handleUpdateInvoice}
        activities={selectedInvoice ? activities[selectedInvoice.id] || [] : []}
      />

      <motion.div
        initial={{ scale: 0, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <AddInvoiceDialog />
      </motion.div>
      <Toaster richColors position="bottom-right" />
    </div>
  );
};

export default FinancialHub;
