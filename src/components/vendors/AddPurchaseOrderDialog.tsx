import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { 
  Dialog,
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Supplier, PurchaseOrder, OrderStatus } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Form schema validation
const purchaseOrderFormSchema = z.object({
  supplierId: z.string({ required_error: "Please select a supplier" }),
  orderDate: z.date({ required_error: "Order date is required" }),
  expectedDeliveryDate: z.date({ required_error: "Expected delivery date is required" }),
  status: z.enum(['draft', 'ordered', 'shipped', 'partially-received', 'received', 'cancelled'] as const, {
    required_error: "Please select an order status",
  }).default('draft'),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      name: z.string().min(1, { message: "Item name is required." }),
      quantity: z.number().min(1, { message: "Quantity must be at least 1." }),
      unit: z.string().min(1, { message: "Unit is required." }),
      unitPrice: z.number().min(0.01, { message: "Unit price must be greater than 0." }),
    })
  ).min(1, { message: "At least one item is required." }),
});

interface AddPurchaseOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suppliers: Supplier[];
  onOrderAdded?: (order: PurchaseOrder) => void;
}

const AddPurchaseOrderDialog: React.FC<AddPurchaseOrderDialogProps> = ({ 
  open, 
  onOpenChange,
  suppliers,
  onOrderAdded
}) => {
  const [items, setItems] = useState<{ name: string; quantity: number; unit: string; unitPrice: number }[]>([
    { name: '', quantity: 1, unit: '', unitPrice: 0 }
  ]);

  const form = useForm<z.infer<typeof purchaseOrderFormSchema>>({
    resolver: zodResolver(purchaseOrderFormSchema),
    defaultValues: {
      supplierId: '',
      orderDate: new Date(),
      expectedDeliveryDate: new Date(),
      status: 'draft',
      notes: '',
      items: [{ name: '', quantity: 1, unit: '', unitPrice: 0 }]
    },
  });

  // Watch for supplier selection changes
  const selectedSupplierId = form.watch('supplierId');
  const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId);

  const addItem = () => {
    const currentItems = form.getValues('items') || [];
    form.setValue('items', [...currentItems, { name: '', quantity: 1, unit: '', unitPrice: 0 }]);
    setItems([...items, { name: '', quantity: 1, unit: '', unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues('items') || [];
    if (currentItems.length > 1) {
      const newItems = currentItems.filter((_, i) => i !== index);
      form.setValue('items', newItems);
      setItems(items.filter((_, i) => i !== index));
    }
  };

  function onSubmit(values: z.infer<typeof purchaseOrderFormSchema>) {
    // Calculate total amount
    const totalAmount = values.items.reduce(
      (sum, item) => sum + (item.quantity * item.unitPrice), 
      0
    );
    
    // Create a new purchase order
    const newOrder: PurchaseOrder = {
      id: `${Date.now()}`,
      supplierId: values.supplierId,
      supplierName: selectedSupplier?.name || "Unknown Supplier",
      status: values.status,
      orderDate: values.orderDate.toISOString(),
      expectedDeliveryDate: values.expectedDeliveryDate.toISOString(),
      items: values.items.map((item, index) => ({
        id: `item-${Date.now()}-${index}`,
        inventoryItemId: `${Date.now()}-${index}`, // This would typically come from inventory selection
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        receivedQuantity: 0,
        notes: ''
      })),
      totalAmount,
      notes: values.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Call the callback to add the order
    if (onOrderAdded) {
      onOrderAdded(newOrder);
    }
    
    // Show success notification
    toast.success("Purchase order created successfully");
    
    // Close the dialog
    onOpenChange(false);
    
    // Reset form
    form.reset();
    setItems([{ name: '', quantity: 1, unit: '', unitPrice: 0 }]);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
          <DialogDescription>
            Fill out the form to create a new purchase order.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="supplierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      {...field}
                    >
                      <option value="" disabled>Select a supplier</option>
                      {suppliers.map(supplier => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="orderDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Order Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="expectedDeliveryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expected Delivery Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Status</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      {...field}
                    >
                      <option value="draft">Draft</option>
                      <option value="ordered">Ordered</option>
                      <option value="shipped">Shipped</option>
                      <option value="partially-received">Partially Received</option>
                      <option value="received">Received</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <h4 className="text-sm font-medium mb-2">Order Items</h4>
              {items.map((_, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-end">
                  <FormField
                    control={form.control}
                    name={`items.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="col-span-4">
                        <FormLabel className={index !== 0 ? "sr-only" : undefined}>Item Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Item name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel className={index !== 0 ? "sr-only" : undefined}>Qty</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={e => field.onChange(Number(e.target.value))}
                            min={1}
                            placeholder="Qty" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`items.${index}.unit`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel className={index !== 0 ? "sr-only" : undefined}>Unit</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="kg, box, etc." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`items.${index}.unitPrice`}
                    render={({ field }) => (
                      <FormItem className="col-span-3">
                        <FormLabel className={index !== 0 ? "sr-only" : undefined}>Price per Unit</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={e => field.onChange(Number(e.target.value))}
                            min={0.01}
                            step={0.01}
                            placeholder="$ per unit" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="col-span-1"
                    onClick={() => removeItem(index)}
                    disabled={items.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addItem} 
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any special instructions or notes for this order" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Purchase Order</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPurchaseOrderDialog;
