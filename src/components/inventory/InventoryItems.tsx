import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { InventoryItem } from '@/types';

// Mock data for demonstration
const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Parmigiano Reggiano',
    description: 'Aged 24 months, imported from Italy',
    sku: 'PR-24-001',
    category: 'Cheese',
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
    category: 'Wine',
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
    category: 'Oil',
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

interface InventoryItemsProps {
  searchQuery: string;
}

const InventoryItems: React.FC<InventoryItemsProps> = ({ searchQuery }) => {
  const filteredItems = mockInventoryItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.defaultSupplierName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= 0) {
      return { label: 'Out of stock', color: 'destructive' };
    } else if (item.currentStock <= item.lowStockThreshold) {
      return { label: 'Low stock', color: 'warning' };
    } else {
      return { label: 'In stock', color: 'success' };
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Default Supplier</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const stockStatus = getStockStatus(item);
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    </TableCell>
                    <TableCell>{item.defaultSupplierName}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>${item.cost.toFixed(2)}</TableCell>
                    <TableCell>{item.currentStock} {item.unit}</TableCell>
                    <TableCell>
                      <Badge variant={stockStatus.color as "default" | "secondary" | "destructive" | "outline"}>
                        {stockStatus.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Update Stock</DropdownMenuItem>
                          <DropdownMenuItem>Create Order</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No inventory items found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default InventoryItems;
