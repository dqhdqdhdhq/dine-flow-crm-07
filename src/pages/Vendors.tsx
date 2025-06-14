import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Store, FileText, Calendar, Filter, SlidersHorizontal, Grid, List, MoreHorizontal, Trash2, ClipboardList } from 'lucide-react';
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import VendorsList from '@/components/vendors/VendorsList';
import VendorCards from '@/components/vendors/VendorCards';
import VendorDashboard from '@/components/vendors/VendorDashboard';
import VendorCalendar from '@/components/vendors/VendorCalendar';
import VendorTimeline from '@/components/vendors/VendorTimeline';
import AddVendorDialog from '@/components/vendors/AddVendorDialog';
import AddPurchaseOrderDialog from '@/components/vendors/AddPurchaseOrderDialog';
import { Badge } from '@/components/ui/badge';
import { mockSuppliers, mockPurchaseOrders, mockOrderTemplates } from '@/data/vendorsData';
import { Supplier, PurchaseOrder, OrderTemplate, OrderTemplateItem, OrderStatus } from '@/types';
import { toast } from 'sonner';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { v4 as uuidv4 } from "uuid";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const statusColors: Record<OrderStatus, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
  draft: "secondary",
  ordered: "default",
  shipped: "warning",
  'partially-received': "warning",
  received: "success",
  cancelled: "destructive",
};

const statusTransitions: Record<OrderStatus, OrderStatus[]> = {
    draft: ['ordered', 'cancelled'],
    ordered: ['shipped', 'cancelled'],
    shipped: ['partially-received', 'received'],
    'partially-received': ['received', 'cancelled'],
    received: [],
    cancelled: [],
};

const OrderManagementList: React.FC<{
  purchaseOrders: PurchaseOrder[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}> = ({ purchaseOrders, onUpdateStatus }) => {
  if (purchaseOrders.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          <p>No purchase orders to manage.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium truncate" style={{maxWidth: '100px'}} title={order.id}>{order.id.substring(0, 8)}...</TableCell>
                <TableCell>{order.supplierName}</TableCell>
                <TableCell>
                  <Badge variant={statusColors[order.status]} className="capitalize">{order.status.replace('-', ' ')}</Badge>
                </TableCell>
                <TableCell>{format(new Date(order.orderDate), "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right">${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {statusTransitions[order.status].length > 0 ? (
                        statusTransitions[order.status].map(newStatus => (
                          <DropdownMenuItem key={newStatus} onClick={() => onUpdateStatus(order.id, newStatus)}>
                            Mark as <span className="capitalize ml-1">{newStatus.replace('-', ' ')}</span>
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <DropdownMenuItem disabled>No actions</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const orderTemplateFormSchema = z.object({
  name: z.string().min(1, "Template name is required."),
  supplierId: z.string({ required_error: "Please select a supplier" }),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      name: z.string().min(1, { message: "Item name is required." }),
      quantity: z.coerce.number().min(1, { message: "Quantity must be at least 1." }),
      unit: z.string().min(1, { message: "Unit is required." }),
      unitPrice: z.coerce.number().min(0.01, { message: "Unit price must be greater than 0." }),
    })
  ).min(1, { message: "At least one item is required." }),
  recurrence: z.object({
      pattern: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
      dayOfWeek: z.coerce.number().optional(),
      dayOfMonth: z.coerce.number().optional(),
  })
});

const AddOrderTemplateDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suppliers: Supplier[];
  onTemplateAdded: (template: OrderTemplate) => void;
}> = ({ open, onOpenChange, suppliers, onTemplateAdded }) => {
  const form = useForm<z.infer<typeof orderTemplateFormSchema>>({
    resolver: zodResolver(orderTemplateFormSchema),
    defaultValues: {
      name: '',
      supplierId: '',
      notes: '',
      items: [{ name: '', quantity: 1, unit: '', unitPrice: 0.01 }],
      recurrence: { pattern: 'weekly', dayOfWeek: 1 }
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });
  
  const recurrencePattern = form.watch('recurrence.pattern');

  function onSubmit(values: z.infer<typeof orderTemplateFormSchema>) {
    const selectedSupplier = suppliers.find(s => s.id === values.supplierId);
    const newTemplate: OrderTemplate = {
      id: uuidv4(),
      name: values.name,
      supplierId: values.supplierId,
      supplierName: selectedSupplier?.name || "Unknown Supplier",
      items: values.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        inventoryItemId: '', // This is a placeholder
      })),
      recurrence: values.recurrence as any, // Simple cast for now
      nextGenerationDate: new Date().toISOString(), // This should be calculated based on recurrence
      autoGenerate: false,
      notes: values.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onTemplateAdded(newTemplate);
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Order Template</DialogTitle>
          <DialogDescription>
            Fill out the form to create a new recurring order template.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Template Name</FormLabel><FormControl><Input placeholder="e.g. Weekly Dairy Order" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="supplierId" render={({ field }) => (
              <FormItem><FormLabel>Supplier</FormLabel><FormControl>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" {...field}>
                  <option value="" disabled>Select a supplier</option>
                  {suppliers.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
                </select>
              </FormControl><FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="recurrence.pattern" render={({ field }) => (
              <FormItem><FormLabel>Frequency</FormLabel><FormControl>
                 <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" {...field}>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </FormControl><FormMessage /></FormItem>
            )}/>
            {recurrencePattern === 'weekly' && (
              <FormField control={form.control} name="recurrence.dayOfWeek" render={({ field }) => (
                <FormItem><FormLabel>Day of the week</FormLabel><FormControl>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" {...field}>
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => <option key={i} value={i}>{day}</option>)}
                  </select>
                </FormControl><FormMessage /></FormItem>
              )}/>
            )}
             {recurrencePattern === 'monthly' && (
              <FormField control={form.control} name="recurrence.dayOfMonth" render={({ field }) => (
                <FormItem><FormLabel>Day of the month</FormLabel><FormControl><Input type="number" min={1} max={31} {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
            )}
            <div>
              <h4 className="text-sm font-medium mb-2">Order Items</h4>
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-2 mb-2 items-end">
                  <FormField control={form.control} name={`items.${index}.name`} render={({ field }) => (<FormItem className="col-span-4"><FormLabel className={index !== 0 ? "sr-only" : undefined}>Item Name</FormLabel><FormControl><Input {...field} placeholder="Item name" /></FormControl><FormMessage /></FormItem>)}/>
                  <FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (<FormItem className="col-span-2"><FormLabel className={index !== 0 ? "sr-only" : undefined}>Qty</FormLabel><FormControl><Input type="number" {...field} placeholder="Qty" /></FormControl><FormMessage /></FormItem>)}/>
                  <FormField control={form.control} name={`items.${index}.unit`} render={({ field }) => (<FormItem className="col-span-2"><FormLabel className={index !== 0 ? "sr-only" : undefined}>Unit</FormLabel><FormControl><Input {...field} placeholder="kg, box" /></FormControl><FormMessage /></FormItem>)}/>
                  <FormField control={form.control} name={`items.${index}.unitPrice`} render={({ field }) => (<FormItem className="col-span-3"><FormLabel className={index !== 0 ? "sr-only" : undefined}>Price/Unit</FormLabel><FormControl><Input type="number" {...field} placeholder="$ per unit" step="0.01" /></FormControl><FormMessage /></FormItem>)}/>
                  <Button type="button" variant="ghost" size="icon" className="col-span-1" onClick={() => remove(index)} disabled={fields.length <= 1}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', quantity: 1, unit: '', unitPrice: 0.01 })} className="mt-2"><Plus className="h-4 w-4 mr-2" /> Add Item</Button>
            </div>
            <FormField control={form.control} name="notes" render={({ field }) => (<FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea placeholder="Notes for this template" {...field} /></FormControl><FormMessage /></FormItem>)}/>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Create Template</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const OrderTemplatesList: React.FC<{
  templates: OrderTemplate[];
  onGenerateOrder: (template: OrderTemplate) => void;
}> = ({ templates, onGenerateOrder }) => {
  if (templates.length === 0) {
    return <div className="text-center text-muted-foreground py-12">No templates created yet. Get started by creating one.</div>
  }

  const formatRecurrence = (template: OrderTemplate) => {
    const { pattern, dayOfMonth, dayOfWeek } = template.recurrence;
    switch(pattern) {
      case 'daily': return 'Daily';
      case 'weekly': return `Weekly on ${['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'][dayOfWeek || 0]}`;
      case 'monthly': return `Monthly on day ${dayOfMonth}`;
      case 'yearly': return 'Yearly';
      default: return 'Custom';
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {templates.map(template => (
        <Card key={template.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-start">
              {template.name}
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardTitle>
            <CardDescription>{template.supplierName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-medium">{formatRecurrence(template)}</p>
            <p className="text-muted-foreground">Next: {format(new Date(template.nextGenerationDate), "MMM d, yyyy")}</p>
            <p className="text-muted-foreground">{template.items.length} items</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => onGenerateOrder(template)}>
              <Plus className="mr-2 h-4 w-4" />
              Generate Order
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
};

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
  const [orderTemplates, setOrderTemplates] = useState<OrderTemplate[]>(mockOrderTemplates);
  
  // Dialog states
  const [addVendorDialogOpen, setAddVendorDialogOpen] = useState(false);
  const [addPurchaseOrderDialogOpen, setAddPurchaseOrderDialogOpen] = useState(false);
  const [addTemplateDialogOpen, setAddTemplateDialogOpen] = useState(false);
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

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setPurchaseOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order
      )
    );
    toast.success(`Order status updated to ${status}.`);
  };

  const handleAddOrderTemplate = (newTemplate: OrderTemplate) => {
    setOrderTemplates(prev => [newTemplate, ...prev]);
    toast.success(`Template "${newTemplate.name}" created successfully.`);
  };

  const handleGenerateOrderFromTemplate = (template: OrderTemplate) => {
    const totalAmount = template.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    
    const newOrder: PurchaseOrder = {
      id: uuidv4(),
      supplierId: template.supplierId,
      supplierName: template.supplierName,
      status: 'draft',
      orderDate: new Date().toISOString(),
      expectedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now, can be improved
      items: template.items.map((item) => ({
        ...item,
        id: uuidv4(),
        inventoryItemId: item.inventoryItemId || `generic-${uuidv4()}`,
        receivedQuantity: 0,
        notes: '',
      })),
      totalAmount,
      notes: `Generated from template: ${template.name}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    handleAddPurchaseOrder(newOrder);
    toast.info(`New draft PO created from template "${template.name}".`);
    setSelectedVendor(template.supplierId);
    setActiveTab('manage-orders');
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
    if (activeTab === 'templates') {
      return (
        <Button className="gap-2" onClick={() => setAddTemplateDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Template
        </Button>
      )
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
          <TabsList className="grid w-full sm:w-auto sm:grid-cols-6">
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
            <TabsTrigger value="templates">
              <FileText className="mr-2 h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="manage-orders">
              <ClipboardList className="mr-2 h-4 w-4" />
              Manage Orders
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

        <TabsContent value="templates">
          <OrderTemplatesList templates={orderTemplates} onGenerateOrder={handleGenerateOrderFromTemplate} />
        </TabsContent>

        <TabsContent value="manage-orders">
          <OrderManagementList purchaseOrders={purchaseOrders} onUpdateStatus={handleUpdateOrderStatus} />
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
      
      <AddOrderTemplateDialog
        open={addTemplateDialogOpen}
        onOpenChange={setAddTemplateDialogOpen}
        suppliers={suppliers}
        onTemplateAdded={handleAddOrderTemplate}
      />
    </div>
  );
};

export default Vendors;
