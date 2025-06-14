
import React from 'react';
import { InventoryItem } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';

interface InventoryItemsListProps {
  items: InventoryItem[];
  searchQuery: string;
  onItemSelect: (itemId: string) => void;
}

const InventoryItemsList: React.FC<InventoryItemsListProps> = ({ items, searchQuery, onItemSelect }) => {
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 bg-gray-50 rounded-lg">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No items found</h3>
        <p className="mt-1 text-sm text-gray-500">Try adjusting your search or add new items to this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredItems.map(item => (
        <Card 
          key={item.id} 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 flex flex-col"
          onClick={() => onItemSelect(item.id)}
        >
          <CardHeader className="p-0 relative">
            <div className="aspect-[4/3] w-full">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-t-lg" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-t-lg">
                  <Package className="h-16 w-16 text-gray-300" />
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-grow">
            <CardTitle className="text-lg font-semibold truncate" title={item.name}>{item.name}</CardTitle>
            <p className="text-sm text-gray-500">{item.category}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold">{item.currentStock ?? item.quantityOnHand ?? 'N/A'} <span className="font-normal text-gray-600">{item.unit}</span></p>
            </div>
            {item.lowStockThreshold !== undefined && (item.currentStock ?? item.quantityOnHand ?? 0) < item.lowStockThreshold && (
              <Badge variant="destructive" className="text-xs">Low Stock</Badge>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default InventoryItemsList;
