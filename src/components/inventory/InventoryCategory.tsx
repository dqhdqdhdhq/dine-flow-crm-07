
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Package, AlertTriangle } from 'lucide-react';
import { InventoryItem } from '@/types';

interface InventoryCategoryProps {
  category: string;
  searchQuery: string;
  onItemSelect: (itemId: string) => void;
}

const InventoryCategory: React.FC<InventoryCategoryProps> = ({
  category,
  searchQuery,
  onItemSelect
}) => {
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'cost'>('name');
  
  // Mock data filtered by category
  const getCategoryItems = (): InventoryItem[] => {
    const allItems: InventoryItem[] = [
      {
        id: '1',
        name: 'Parmigiano Reggiano',
        description: 'Aged 24 months, imported from Italy',
        sku: 'PR-24-001',
        category: 'Pantry',
        unit: 'kg',
        unitCost: 28.5,
        quantityOnHand: 12,
        reorderPoint: 5,
        reorderQuantity: 10,
        supplierId: 'supplier-1',
        notes: 'Premium quality',
        defaultSupplierId: 'supplier-1',
        defaultSupplierName: 'Italian Imports Co.',
        cost: 28.5,
        currentStock: 12,
        lowStockThreshold: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Cabernet Sauvignon',
        description: 'Vintage 2018, Napa Valley',
        sku: 'CS-18-002',
        category: 'Beverages',
        unit: 'bottle',
        unitCost: 35.0,
        quantityOnHand: 24,
        reorderPoint: 10,
        reorderQuantity: 12,
        supplierId: 'supplier-2',
        notes: 'High demand item',
        defaultSupplierId: 'supplier-2',
        defaultSupplierName: 'Premium Wines',
        cost: 35.0,
        currentStock: 24,
        lowStockThreshold: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Truffle Oil',
        description: 'White truffle infused olive oil',
        sku: 'TO-WH-003',
        category: 'Pantry',
        unit: 'bottle',
        unitCost: 18.75,
        quantityOnHand: 3,
        reorderPoint: 5,
        reorderQuantity: 8,
        supplierId: 'supplier-1',
        notes: 'Specialty item',
        defaultSupplierId: 'supplier-1',
        defaultSupplierName: 'Italian Imports Co.',
        cost: 18.75,
        currentStock: 3,
        lowStockThreshold: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    return allItems.filter(item => 
      item.category === category &&
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const items = getCategoryItems();

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= 0) {
      return { label: 'Out of stock', variant: 'destructive' as const, urgent: true };
    } else if (item.currentStock <= item.lowStockThreshold) {
      return { label: 'Low stock', variant: 'warning' as const, urgent: true };
    } else {
      return { label: 'In stock', variant: 'success' as const, urgent: false };
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    switch (sortBy) {
      case 'stock':
        return a.currentStock - b.currentStock;
      case 'cost':
        return b.cost - a.cost;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="space-y-6">
      {/* Category Header with Sort */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">{items.length} items</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Sort by {sortBy}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy('name')}>Name</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('stock')}>Stock Level</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('cost')}>Cost</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid gap-4">
        {sortedItems.length > 0 ? (
          sortedItems.map((item) => {
            const stockStatus = getStockStatus(item);
            return (
              <Card 
                key={item.id}
                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                onClick={() => onItemSelect(item.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 bg-gray-100 rounded-xl">
                        <Package className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          {stockStatus.urgent && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{item.currentStock} {item.unit}</span>
                          <span>•</span>
                          <span>${item.cost.toFixed(2)} per {item.unit}</span>
                          <span>•</span>
                          <span>{item.defaultSupplierName}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={stockStatus.variant}>
                        {stockStatus.label}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Item</DropdownMenuItem>
                          <DropdownMenuItem>Update Stock</DropdownMenuItem>
                          <DropdownMenuItem>Create Order</DropdownMenuItem>
                          <DropdownMenuItem>View History</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600">Try adjusting your search or add new items to this category.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InventoryCategory;
