import React, { useEffect } from 'react';
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
import { toast } from 'sonner';
import { Supplier } from '@/types';

// Form schema validation
const vendorFormSchema = z.object({
  name: z.string().min(2, { message: "Vendor name must be at least 2 characters." }),
  contactPerson: z.string().min(2, { message: "Contact person must be at least 2 characters." }),
  phone: z.string().min(5, { message: "Phone number must be valid." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  productsSupplied: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending']).default('active'),
});

interface AddVendorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVendorAdded?: (vendor: Supplier) => void;
  editingVendor?: Supplier | null;
}

const AddVendorDialog: React.FC<AddVendorDialogProps> = ({ 
  open, 
  onOpenChange,
  onVendorAdded,
  editingVendor
}) => {
  const form = useForm<z.infer<typeof vendorFormSchema>>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      productsSupplied: '',
      status: 'active',
    },
  });

  // Reset form when editing vendor changes
  useEffect(() => {
    if (editingVendor && open) {
      form.reset({
        name: editingVendor.name,
        contactPerson: editingVendor.contactPerson,
        phone: editingVendor.phone,
        email: editingVendor.email,
        address: editingVendor.address,
        productsSupplied: editingVendor.productsSupplied.join(', '),
        status: editingVendor.status || 'active',
      });
    } else if (!editingVendor && open) {
      form.reset({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        productsSupplied: '',
        status: 'active',
      });
    }
  }, [editingVendor, open, form]);

  function onSubmit(values: z.infer<typeof vendorFormSchema>) {
    // Process the products supplied string into an array
    const productsArray = values.productsSupplied 
      ? values.productsSupplied.split(',').map(product => product.trim())
      : [];
    
    // Create a new vendor object or update existing one
    const vendorData: Supplier = {
      id: editingVendor?.id || `supplier-${Date.now()}`,
      name: values.name,
      contactPerson: values.contactPerson,
      phone: values.phone,
      email: values.email,
      address: values.address,
      status: values.status,
      productsSupplied: productsArray,
      createdAt: editingVendor?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Call the callback to add/update the vendor
    if (onVendorAdded) {
      onVendorAdded(vendorData);
    }
    
    // Show success notification
    toast.success(editingVendor ? "Vendor updated successfully" : "Vendor added successfully");
    
    // Close the dialog
    onOpenChange(false);
    
    // Reset form
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{editingVendor ? 'Edit Vendor' : 'Add New Vendor'}</DialogTitle>
          <DialogDescription>
            {editingVendor 
              ? 'Update the vendor information below.'
              : 'Fill out the form below to add a new vendor to your system.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Italian Imports Co." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="contact@italianimpco.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="123 Supplier St, City, State, ZIP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="productsSupplied"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Products Supplied</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter products separated by commas (e.g., Olive Oil, Pasta, Cheese)" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      {...field}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingVendor ? 'Update Vendor' : 'Add Vendor'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVendorDialog;
