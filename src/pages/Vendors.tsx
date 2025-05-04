
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Store, FileText, Calendar, Filter, SlidersHorizontal } from 'lucide-react';
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
import VendorDashboard from '@/components/vendors/VendorDashboard';
import VendorCalendar from '@/components/vendors/VendorCalendar';
import VendorTimeline from '@/components/vendors/VendorTimeline';
import { Badge } from '@/components/ui/badge';

const Vendors: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    contactPerson: true,
    contactInfo: true,
    productsSupplied: true,
  });

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
        <div className="flex gap-2">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Vendor
          </Button>
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            New Purchase Order
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search vendors..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
        </div>
      </div>

      <Tabs defaultValue="list">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="list">
            <Store className="mr-2 h-4 w-4" />
            Vendors List
          </TabsTrigger>
          <TabsTrigger value="dashboard">
            <Store className="mr-2 h-4 w-4" />
            Vendor Dashboard
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <FileText className="mr-2 h-4 w-4" />
            Timeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <VendorsList 
            searchQuery={searchQuery} 
            onSelectVendor={(vendorId) => setSelectedVendor(vendorId)}
            statusFilter={statusFilter}
            visibleColumns={visibleColumns}
          />
        </TabsContent>

        <TabsContent value="dashboard">
          <VendorDashboard vendorId={selectedVendor} />
        </TabsContent>

        <TabsContent value="calendar">
          <VendorCalendar />
        </TabsContent>

        <TabsContent value="timeline">
          <VendorTimeline vendorId={selectedVendor} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Vendors;
