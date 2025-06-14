
import React, { useEffect } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Supplier, OrderTemplate } from '@/types';

const orderTemplateFormSchema = z.object({
  name: z.string().min(1, "Template name is required."),
  supplierId: z.string({ required_error: "Please select a supplier" }).min(1, "Please select a supplier"),
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

type EditOrderTemplateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suppliers: Supplier[];
  editingTemplate: OrderTemplate | null;
  onTemplateUpdated: (template: OrderTemplate) => void;
};

const EditOrderTemplateDialog: React.FC<EditOrderTemplateDialogProps> = ({ open, onOpenChange, suppliers, editingTemplate, onTemplateUpdated }) => {
  const form = useForm<z.infer<typeof orderTemplateFormSchema>>({
    resolver: zodResolver(orderTemplateFormSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    if (editingTemplate) {
      form.reset({
        name: editingTemplate.name,
        supplierId: editingTemplate.supplierId,
        notes: editingTemplate.notes || '',
        items: editingTemplate.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.unitPrice,
        })),
        recurrence: {
          pattern: editingTemplate.recurrence.pattern,
          dayOfWeek: editingTemplate.recurrence.dayOfWeek,
          dayOfMonth: editingTemplate.recurrence.dayOfMonth,
        },
      });
    }
  }, [editingTemplate, open, form]);
  
  const recurrencePattern = form.watch('recurrence.pattern');

  function onSubmit(values: z.infer<typeof orderTemplateFormSchema>) {
    if (!editingTemplate) return;

    const selectedSupplier = suppliers.find(s => s.id === values.supplierId);
    const updatedTemplate: OrderTemplate = {
      ...editingTemplate,
      name: values.name,
      supplierId: values.supplierId,
      supplierName: selectedSupplier?.name || "Unknown Supplier",
      items: values.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        inventoryItemId: '', // This should be preserved if it exists
      })),
      recurrence: values.recurrence as any,
      notes: values.notes,
      updatedAt: new Date().toISOString(),
    };
    onTemplateUpdated(updatedTemplate);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Order Template</DialogTitle>
          <DialogDescription>
            Update the details for your recurring order template.
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
              <Button type="submit">Update Template</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrderTemplateDialog;
