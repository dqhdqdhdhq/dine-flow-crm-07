import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InventoryOverview from '@/components/inventory/InventoryOverview';
import InventoryItemDetail from '@/components/inventory/InventoryItemDetail';
import AddInventoryItemDialog from '@/components/inventory/AddInventoryItemDialog';
import { toast } from 'sonner';
import { InventoryItem } from '@/types';
import InventoryItemsList from '@/components/inventory/InventoryItemsList';

type ViewMode = 'dashboard' | 'category' | 'item-detail';

const initialInventory: InventoryItem[] = [
  {
    id: 'item-1',
    name: 'Organic Tomatoes',
    category: 'Fresh Produce',
    currentStock: 50,
    unit: 'kg',
    cost: 2.5,
    lowStockThreshold: 10,
    imageUrl: 'https://images.unsplash.com/photo-1591115765942-e613f2b45e7f?q=80&w=300&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: "Ripe organic tomatoes, perfect for salads and sauces.",
    sku: "FP-TOM-001"
  },
  {
    id: 'item-2',
    name: 'Parmigiano Reggiano',
    category: 'Pantry',
    currentStock: 20,
    unit: 'wheel',
    cost: 300,
    lowStockThreshold: 5,
    imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=300&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: "Aged 24 months, imported from Italy.",
    sku: "PAN-CHE-001"
  }
];

const Inventory: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(initialInventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setViewMode('category');
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItemId(itemId);
    setViewMode('item-detail');
  };

  const handleBack = () => {
    if (viewMode === 'item-detail') {
      setViewMode('category');
      setSelectedItemId(null);
    } else if (viewMode === 'category') {
      setViewMode('dashboard');
      setSelectedCategory(null);
    }
  };

  const handleAddItem = (item: Omit<InventoryItem, 'imageUrl'> & { imagePreview?: string | null }) => {
    console.log('New item to be added:', item);
    const newItem: InventoryItem = {
      ...item,
      imageUrl: item.imagePreview || undefined,
    };
    
    // Clean up properties that are not part of InventoryItem
    delete (newItem as any).imagePreview;
    delete (newItem as any).imageFile;

    setInventoryItems(prevItems => [...prevItems, newItem]);
    toast.success(`${item.name} has been added to inventory.`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {viewMode !== 'dashboard' && (
            <Button variant="ghost" onClick={handleBack} className="p-2">
              ←
            </Button>
          )}
          <h1 className="text-3xl font-bold tracking-tight">
            {viewMode === 'dashboard' && 'Inventory'}
            {viewMode === 'category' && selectedCategory}
            {viewMode === 'item-detail' && 'Item Details'}
          </h1>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="gap-2 bg-black text-white hover:bg-gray-800 rounded-full px-6"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Universal Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Search inventory, orders, suppliers..."
          className="pl-10 rounded-full border-gray-200 bg-gray-50 focus:bg-white transition-colors"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Dynamic Content based on view mode */}
      {viewMode === 'dashboard' && (
        <InventoryOverview 
          inventoryItems={inventoryItems}
          searchQuery={searchQuery}
          onCategorySelect={handleCategorySelect}
          onItemSelect={handleItemSelect}
        />
      )}

      {viewMode === 'category' && selectedCategory && (
        <InventoryItemsList
          items={
            selectedCategory === 'Low Stock'
              ? inventoryItems.filter(item => 
                  (item.currentStock ?? 0) < (item.lowStockThreshold ?? 0)
                )
              : selectedCategory === 'Pending Orders'
              ? [] // No data model for this yet
              : inventoryItems.filter(item => item.category === selectedCategory)
          }
          searchQuery={searchQuery}
          onItemSelect={handleItemSelect}
        />
      )}

      {viewMode === 'item-detail' && selectedItemId && (
        <InventoryItemDetail 
          itemId={selectedItemId}
          onBack={handleBack}
        />
      )}

      <AddInventoryItemDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddItem={handleAddItem}
        category={selectedCategory}
      />
    </div>
  );
};

export default Inventory;
