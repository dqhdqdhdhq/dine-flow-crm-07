
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Minus
} from 'lucide-react';
import { InventoryItem } from '@/types';
import AdjustStockDialog from './AdjustStockDialog';

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

  return (
    <>
      <div className="space-y-6">
        {/* Item Header */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/3">
            <Card>
              <CardContent className="p-6">
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  {item.imageUrl ? (
                     <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Package className="h-16 w-16 text-gray-400" />
                  )}
                </div>
                <h1 className="text-2xl font-bold mb-2">{item.name}</h1>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <Badge variant={stockStatus.variant} className="mb-4">
                  {stockStatus.label}
                </Badge>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">SKU:</span>
                    <span className="font-medium">{item.sku || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Unit:</span>
                    <span className="font-medium">{item.unit}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:w-2/3 space-y-6">
            {/* Stock & Financial Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Package className={`h-8 w-8 mx-auto mb-2 ${stockStatus.color}`} />
                  <p className="text-2xl font-bold">{item.currentStock}</p>
                  <p className="text-sm text-gray-600">Current Stock ({item.unit})</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold">${item.cost}</p>
                  <p className="text-sm text-gray-600">Cost per {item.unit}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold">N/A</p>
                  <p className="text-sm text-gray-600">Average Usage</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="outline" className="gap-2" onClick={() => handleAdjustStock('add')}>
                    <Plus className="h-4 w-4" />
                    Add Stock
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={() => handleAdjustStock('remove')}>
                    <Minus className="h-4 w-4" />
                    Remove Stock
                  </Button>
                  <Button variant="outline" className="gap-2" disabled>
                    <FileText className="h-4 w-4" />
                    Create Order
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={onEdit}>
                    <Package className="h-4 w-4" />
                    Edit Item
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Supplier & Details */}
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Reorder Point</label>
                    <p className="font-medium">{item.lowStockThreshold} {item.unit}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Value</label>
                    <p className="font-medium">${((item.currentStock ?? 0) * (item.cost ?? 0)).toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{activity.quantity}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {activity.user}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
