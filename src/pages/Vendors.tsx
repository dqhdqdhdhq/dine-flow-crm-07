
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Store, FileText, Calendar, Filter, SlidersHorizontal, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import VendorsList from '@/components/vendors/VendorsList';
import VendorCards from '@/components/vendors/VendorCards';
import VendorDashboard from '@/components/vendors/VendorDashboard';
import VendorCalendar from '@/components/vendors/VendorCalendar';
import VendorTimeline from '@/components/vendors/VendorTimeline';
import AddVendorDialog from '@/components/vendors/AddVendorDialog';
import AddPurchaseOrderDialog from '@/components/vendors/AddPurchaseOrderDialog';
import { Badge } from '@/components/ui/badge';
import { mockSuppliers, mockPurchaseOrders } from '@/data/vendorsData';
import { Supplier, PurchaseOrder } from '@/types';
import { toast } from 'sonner';

const Vendors: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [showSearch, setShowSearch] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [editingVendor, setEditingVendor] = useState<Supplier | null>(null);
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    contactPerson: true,
    contactInfo: true,
    productsSupplied: true,
  });
  
  // State for sample data
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  
  // Dialog states
  const [addVendorDialogOpen, setAddVendorDialogOpen] = useState(false);
  const [addPurchaseOrderDialogOpen, setAddPurchaseOrderDialogOpen] = useState(false);
  const [selectedVendorForPO, setSelectedVendorForPO] = useState<string | null>(null);

  // Status filter options for vendors
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(current => 
      current.includes(status)
        ? current.filter(s => s !== status)
        : [...current, status]
    );
  };

  // Column visibility toggle
  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };
  
  // Handle adding a new vendor
  const handleAddVendor = (newVendor: Supplier) => {
    if (editingVendor) {
      setSuppliers(prev => prev.map(v => v.id === editingVendor.id ? newVendor : v));
      toast.success(`Vendor ${newVendor.name} updated successfully`);
      setEditingVendor(null);
    } else {
      setSuppliers(prev => [newVendor, ...prev]);
      toast.success(`Vendor ${newVendor.name} added successfully`);
    }
  };
  
  // Handle adding a new purchase order
  const handleAddPurchaseOrder = (newOrder: PurchaseOrder) => {
    setPurchaseOrders(prev => [newOrder, ...prev]);
    toast.success(`Purchase order for ${newOrder.supplierName} created successfully`);
    setSelectedVendorForPO(null);
  };

  // Handle vendor card actions
  const handleViewDashboard = (vendorId: string) => {
    setSelectedVendor(vendorId);
    setActiveTab('dashboard');
    toast.success('Switched to vendor dashboard');
  };

  const handleEditVendor = (vendor: Supplier) => {
    setEditingVendor(vendor);
    setAddVendorDialogOpen(true);
  };

  const handleCreatePurchaseOrder = (vendorId: string) => {
    setSelectedVendorForPO(vendorId);
    setAddPurchaseOrderDialogOpen(true);
  };

  const handleViewOrderHistory = (vendorId: string) => {
    setSelectedVendor(vendorId);
    setActiveTab('timeline');
    toast.success('Switched to order history');
  };

  // Get primary action based on context
  const getPrimaryAction = () => {
    if (selectedVendor && activeTab === 'dashboard') {
      return (
        <Button className="gap-2" onClick={() => handleCreatePurchaseOrder(selectedVendor)}>
          <FileText className="h-4 w-4" />
          Create Purchase Order
        </Button>
      );
    }
    return (
      <Button className="gap-2" onClick={() => setAddVendorDialogOpen(true)}>
        <Plus className="h-4 w-4" />
        Add Vendor
      </Button>
    );
  };

  const hasActiveFilters = statusFilter.length > 0 || searchQuery.length > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
          {selectedVendor && (
            <Badge variant="secondary" className="text-sm">
              {suppliers.find(s => s.id === selectedVendor)?.name} selected
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!showSearch && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowSearch(true)}
              className="gap-2"
            >
              <Search className="h-4 w-4" />
              Search
            </Button>
          )}
          {getPrimaryAction()}
        </div>
      </div>

      {/* Smart Search & Filters */}
      {(showSearch || hasActiveFilters) && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search vendors..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => {
                if (!searchQuery) setShowSearch(false);
              }}
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <Filter className="h-4 w-4" />
                  Filter
                  {statusFilter.length > 0 && (
                    <Badge variant="secondary" className="ml-1 px-1 py-0 h-5">
                      {statusFilter.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem disabled className="font-medium">Filter by Status</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes('active')}
                  onCheckedChange={() => handleStatusFilterChange('active')}
                >
                  Active
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes('inactive')}
                  onCheckedChange={() => handleStatusFilterChange('inactive')}
                >
                  Inactive
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes('pending')}
                  onCheckedChange={() => handleStatusFilterChange('pending')}
                >
                  Pending Approval
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter([])}>
                  Clear Filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter([]);
                  setShowSearch(false);
                }}
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="list">
              <Store className="mr-2 h-4 w-4" />
              Vendors
            </TabsTrigger>
            <TabsTrigger value="dashboard">
              <Store className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="timeline">
              <FileText className="mr-2 h-4 w-4" />
              Timeline
            </TabsTrigger>
          </TabsList>

          {/* View Mode Toggle - only show in list tab */}
          {activeTab === 'list' && (
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('cards')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              
              {viewMode === 'list' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 gap-1">
                      <SlidersHorizontal className="h-4 w-4" />
                      Columns
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem disabled className="font-medium">Toggle Columns</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.name}
                      onCheckedChange={() => toggleColumn('name')}
                    >
                      Vendor Name
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.contactPerson}
                      onCheckedChange={() => toggleColumn('contactPerson')}
                    >
                      Contact Person
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.contactInfo}
                      onCheckedChange={() => toggleColumn('contactInfo')}
                    >
                      Contact Info
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.productsSupplied}
                      onCheckedChange={() => toggleColumn('productsSupplied')}
                    >
                      Products Supplied
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </div>

        <TabsContent value="list">
          {viewMode === 'cards' ? (
            <VendorCards 
              searchQuery={searchQuery} 
              onSelectVendor={(vendorId) => setSelectedVendor(vendorId)}
              statusFilter={statusFilter}
              suppliers={suppliers}
              selectedVendor={selectedVendor}
              onViewDashboard={handleViewDashboard}
              onEditVendor={handleEditVendor}
              onCreatePurchaseOrder={handleCreatePurchaseOrder}
              onViewOrderHistory={handleViewOrderHistory}
            />
          ) : (
            <VendorsList 
              searchQuery={searchQuery} 
              onSelectVendor={(vendorId) => setSelectedVendor(vendorId)}
              statusFilter={statusFilter}
              visibleColumns={visibleColumns}
              suppliers={suppliers}
            />
          )}
        </TabsContent>

        <TabsContent value="dashboard">
          <VendorDashboard 
            vendorId={selectedVendor} 
            purchaseOrders={purchaseOrders}
            suppliers={suppliers}
          />
        </TabsContent>

        <TabsContent value="calendar">
          <VendorCalendar purchaseOrders={purchaseOrders} />
        </TabsContent>

        <TabsContent value="timeline">
          <VendorTimeline 
            vendorId={selectedVendor} 
            purchaseOrders={purchaseOrders}
            suppliers={suppliers}
          />
        </TabsContent>
      </Tabs>
      
      {/* Dialogs */}
      <AddVendorDialog 
        open={addVendorDialogOpen} 
        onOpenChange={(open) => {
          setAddVendorDialogOpen(open);
          if (!open) setEditingVendor(null);
        }}
        onVendorAdded={handleAddVendor}
        editingVendor={editingVendor}
      />
      
      <AddPurchaseOrderDialog 
        open={addPurchaseOrderDialogOpen}
        onOpenChange={setAddPurchaseOrderDialogOpen}
        suppliers={suppliers}
        onOrderAdded={handleAddPurchaseOrder}
        preSelectedVendorId={selectedVendorForPO}
      />
    </div>
  );
};

export default Vendors;
