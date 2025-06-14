import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  Clock,
  User,
  FileText,
  Plus,
  Minus,
  MoreHorizontal
} from 'lucide-react';
import { InventoryItem } from '@/types';
import AdjustStockDialog from './AdjustStockDialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from "@/components/ui/progress";

interface InventoryItemDetailProps {
  item: InventoryItem;
  onBack: () => void;
  onEdit: () => void;
  onStockUpdate: (itemId: string, quantityChange: number, reason?: string) => void;
}

const InventoryItemDetail: React.FC<InventoryItemDetailProps> = ({
  item,
  onBack,
  onEdit,
  onStockUpdate
}) => {
  const [isAdjustStockOpen, setIsAdjustStockOpen] = useState(false);
  const [stockAction, setStockAction] = useState<'add' | 'remove'>('add');

  // Mock data for recent activity. In a real app, this would come from a database.
  const recentActivity = [
    { date: '2024-01-20', action: 'Stock Updated', quantity: '+5 kg', user: 'John Smith' },
    { date: '2024-01-15', action: 'Order Received', quantity: '+10 kg', user: 'System' },
    { date: '2024-01-10', action: 'Stock Used', quantity: '-3 kg', user: 'Kitchen' },
  ];

  const handleAdjustStock = (action: 'add' | 'remove') => {
    setStockAction(action);
    setIsAdjustStockOpen(true);
  };

  const handleConfirmStockAdjustment = (quantity: number, reason?: string) => {
    const change = stockAction === 'add' ? quantity : -quantity;
    onStockUpdate(item.id, change, reason);
  };
  
  const getStockStatus = () => {
    const stock = item.currentStock ?? 0;
    const threshold = item.lowStockThreshold ?? 0;
    if (stock <= 0) {
      return { label: 'Out of Stock', variant: 'destructive' as const, color: 'text-red-600' };
    } else if (stock <= threshold) {
      return { label: 'Low Stock', variant: 'destructive' as const, color: 'text-orange-600' };
    } else {
      return { label: 'In Stock', variant: 'success' as const, color: 'text-green-600' };
    }
  };

  const stockStatus = getStockStatus();
  const stockPercentage = Math.min(((item.currentStock ?? 0) / ((item.lowStockThreshold > 0 ? item.lowStockThreshold : 1) * 2)) * 100, 100);

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Image and primary info */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-0">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {item.imageUrl ? (
                     <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="h-24 w-24 text-gray-300" />
                  )}
                </div>
                <div className="p-6">
                  <h1 className="text-3xl font-bold leading-tight">{item.name}</h1>
                  <p className="text-md text-gray-500">{item.category}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Stock, Actions, and Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Stock Status</CardTitle>
                <Badge variant={stockStatus.variant} className="capitalize">{stockStatus.label}</Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold">{item.currentStock}</p>
                  <p className="text-lg text-gray-500">{item.unit}</p>
                </div>
                <Progress value={stockPercentage} className="mt-4 h-2" />
                <p className="text-xs text-gray-500 mt-2">
                  {stockStatus.label !== 'In Stock' 
                    ? `Threshold is ${item.lowStockThreshold} ${item.unit}.` 
                    : `Well above threshold of ${item.lowStockThreshold} ${item.unit}.`}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => handleAdjustStock('remove')}>
                  <Minus />
                  Remove Stock
                </Button>
                <Button onClick={() => handleAdjustStock('add')}>
                  <Plus />
                  Add Stock
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5" />
                      <span className="sr-only">More actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onEdit}>
                      <Package className="mr-2 h-4 w-4" />
                      <span>Edit Item</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Create Order</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>

            <Accordion type="multiple" className="w-full rounded-lg border bg-card shadow-lg">
              <AccordionItem value="details" className="border-b">
                <AccordionTrigger className="px-6 py-4 text-base hover:no-underline">Item Details</AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <Separator />
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                      <div>
                        <p className="text-gray-500">SKU</p>
                        <p className="font-medium">{item.sku || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Unit</p>
                        <p className="font-medium">{item.unit}</p>
                      </div>
                       <div>
                        <p className="text-gray-500">Cost per Unit</p>
                        <p className="font-medium">${item.cost?.toFixed(2) || '0.00'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total Stock Value</p>
                        <p className="font-medium">${((item.currentStock ?? 0) * (item.cost ?? 0)).toFixed(2)}</p>
                      </div>
                       <div>
                        <p className="text-gray-500">Last Updated</p>
                        <p className="font-medium">{new Date(item.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="activity" className="border-b-0">
                <AccordionTrigger className="px-6 py-4 text-base hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-3">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-md bg-gray-50 text-sm">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${activity.quantity.startsWith('+') ? 'bg-green-500' : 'bg-red-500'}`} />
                            <div>
                              <p className="font-medium">{activity.action}</p>
                              <p className="text-xs text-gray-500">{activity.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${activity.quantity.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{activity.quantity}</p>
                            <p className="text-xs text-gray-500 flex items-center justify-end gap-1">
                              <User className="h-3 w-3" />
                              {activity.user}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">No recent activity for this item.</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      <AdjustStockDialog
        isOpen={isAdjustStockOpen}
        onOpenChange={setIsAdjustStockOpen}
        onConfirm={handleConfirmStockAdjustment}
        item={item}
        action={stockAction}
      />
    </>
  );
};

export default InventoryItemDetail;
