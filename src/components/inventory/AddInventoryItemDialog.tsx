
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuidv4 } from 'uuid';
import { InventoryItem } from '@/types';
import { Image as ImageIcon, X } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  category: z.string().min(2, { message: "Category is required." }),
  unit: z.string().min(1, { message: "Unit is required (e.g., kg, bottle, item)." }),
  currentStock: z.coerce.number().min(0, { message: "Stock cannot be negative." }).default(0),
  cost: z.coerce.number().min(0, { message: "Cost cannot be negative." }).default(0),
  lowStockThreshold: z.coerce.number().min(0, { message: "Threshold cannot be negative." }).optional(),
  sku: z.string().optional(),
  description: z.string().optional(),
  defaultSupplierName: z.string().optional(),
});

type AddItemFormValues = z.infer<typeof formSchema>;

interface AddInventoryItemDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSaveItem: (item: any) => void;
  category?: string | null;
  itemToEdit?: InventoryItem | null;
}

const AddInventoryItemDialog: React.FC<AddInventoryItemDialogProps> = ({
  isOpen,
  onOpenChange,
  onSaveItem,
  category,
  itemToEdit,
}) => {
  const form = useForm<AddItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category: '',
      unit: '',
      currentStock: 0,
      cost: 0,
      lowStockThreshold: 0,
      sku: '',
      description: '',
      defaultSupplierName: '',
    },
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        form.reset({
          ...itemToEdit,
          lowStockThreshold: itemToEdit.lowStockThreshold ?? 0,
          cost: itemToEdit.cost ?? 0,
          currentStock: itemToEdit.currentStock ?? 0,
        });
        if (itemToEdit.imageUrl) {
          setImagePreview(itemToEdit.imageUrl);
          setImageFile(null);
        }
      } else {
        form.reset({
          name: '',
          category: category || '',
          unit: '',
          currentStock: 0,
          cost: 0,
          lowStockThreshold: 0,
          sku: '',
          description: '',
          defaultSupplierName: '',
        });
        setImageFile(null);
        setImagePreview(null);
      }
    } else {
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen, category, form, itemToEdit]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreview) {
      // only revoke if it's a blob url
      if (imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    }
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = (values: AddItemFormValues) => {
    let finalImageUrl = itemToEdit?.imageUrl; // Keep old image by default
    if (imageFile) {
      finalImageUrl = imagePreview ?? undefined;
    } else if (imagePreview === null) {
      finalImageUrl = undefined;
    }

    const itemData = {
      ...values,
      id: itemToEdit?.id || uuidv4(),
      createdAt: itemToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // In a real app, you'd upload the file and save the returned URL
      // For now, we pass the preview URL to be used as the image URL
      imagePreview: finalImageUrl,
    };
    onSaveItem(itemData);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{itemToEdit ? 'Edit Inventory Item' : 'Add New Inventory Item'}</DialogTitle>
          <DialogDescription>
            {itemToEdit ? 'Update the details for this item.' : 'Fill in the details below to add a new item to your inventory.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Image preview and upload controls */}
              <div className="w-full sm:w-32 sm:h-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 relative group">
                {imagePreview ? (
                  <div className="w-full h-full relative">
                    <img src={imagePreview} alt="Item preview" className="w-full h-full object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-1 right-1 bg-white/80 rounded-full p-1 shadow hover:bg-white z-10"
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*"
                  onChange={handleFileChange}
                  aria-label="Upload item image"
                />
                {!imagePreview && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white rounded px-2 py-1 text-xs shadow text-gray-700 opacity-90 group-hover:opacity-100">
                    Choose File
                  </div>
                )}
              </div>
              <div className="flex-grow space-y-4 w-full">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Parmigiano Reggiano" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Aged 24 months, imported from Italy" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Pantry" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU (Stock Keeping Unit)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., PR-24-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="currentStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Stock</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., kg, bottle" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost per Unit</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="28.50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lowStockThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Low Stock Threshold</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="defaultSupplierName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Italian Imports Co." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{itemToEdit ? 'Save Changes' : 'Add Item'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddInventoryItemDialog;
