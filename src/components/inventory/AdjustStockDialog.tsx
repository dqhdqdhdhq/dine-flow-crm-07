
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { InventoryItem } from '@/types';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  quantity: z.coerce.number().positive({ message: "Quantity must be a positive number." }),
  reason: z.string().optional(),
});

type AdjustStockFormValues = z.infer<typeof formSchema>;

interface AdjustStockDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (quantity: number, reason?: string) => void;
  item: InventoryItem;
  action: 'add' | 'remove';
}

const AdjustStockDialog: React.FC<AdjustStockDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  item,
  action,
}) => {
  const form = useForm<AdjustStockFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 0,
      reason: '',
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({ quantity: 0, reason: '' });
    }
  }, [isOpen, form]);

  const onSubmit = (values: AdjustStockFormValues) => {
    onConfirm(values.quantity, values.reason);
    onOpenChange(false);
  };

  const actionText = action === 'add' ? 'Add to' : 'Remove from';
  const title = `${actionText} Stock`;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {actionText} stock for <strong>{item.name}</strong>. Current stock: {item.currentStock} {item.unit}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity ({item.unit})</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., New delivery, Spoilage" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Confirm</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdjustStockDialog;
