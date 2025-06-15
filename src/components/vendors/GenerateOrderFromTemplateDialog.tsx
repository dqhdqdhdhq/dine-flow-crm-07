
import React, { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { OrderTemplate, OrderTemplateItem, PurchaseOrder } from '@/types';
import { v4 as uuidv4 } from "uuid";

interface GenerateOrderFromTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: OrderTemplate | null;
  onGenerateOrder: (order: PurchaseOrder) => void;
}

const GenerateOrderFromTemplateDialog: React.FC<GenerateOrderFromTemplateDialogProps> = ({
  open,
  onOpenChange,
  template,
  onGenerateOrder,
}) => {
  const [items, setItems] = useState<OrderTemplateItem[]>([]);

  useEffect(() => {
    if (template) {
      setItems(template.items.map(item => ({ ...item })));
    }
  }, [template]);

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  }, [items]);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.inventoryItemId === itemId ? { ...item, quantity: newQuantity >= 0 ? newQuantity : 0 } : item
      )
    );
  };

  const handleGenerate = () => {
    if (!template) return;

    const newOrder: PurchaseOrder = {
      id: uuidv4(),
      supplierId: template.supplierId,
      supplierName: template.supplierName,
      status: 'draft',
      orderDate: new Date().toISOString(),
      expectedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      items: items.map((item) => ({
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
      templateId: template.id,
      templateName: template.name,
    };
    
    onGenerateOrder(newOrder);
    onOpenChange(false);
  };

  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Generate Order from Template</DialogTitle>
          <DialogDescription>
            Review and confirm the details for the purchase order generated from template "{template.name}".
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <p><strong>Supplier:</strong> {template.supplierName}</p>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="w-[120px]">Quantity</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map(item => (
                        <TableRow key={item.inventoryItemId}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>
                                <Input 
                                    type="number" 
                                    value={item.quantity} 
                                    onChange={(e) => handleQuantityChange(item.inventoryItemId, parseInt(e.target.value, 10) || 0)}
                                    className="h-8"
                                />
                            </TableCell>
                            <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                            <TableCell className="text-right">${(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
        <DialogFooter className="mt-4">
          <div className="flex justify-between items-center w-full">
            <span className="font-bold text-lg">Total: ${totalAmount.toFixed(2)}</span>
            <div>
              <Button variant="outline" onClick={() => onOpenChange(false)} className="mr-2">Cancel</Button>
              <Button onClick={handleGenerate}>Generate Order</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateOrderFromTemplateDialog;
