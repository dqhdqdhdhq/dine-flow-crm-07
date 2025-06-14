
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
  },
  {
    id: 'item-3',
    name: 'Truffle Oil',
    category: 'Pantry',
    currentStock: 3, // Low stock
    unit: 'bottle',
    cost: 18.75,
    lowStockThreshold: 5,
    imageUrl: 'https://images.unsplash.com/photo-1541533848939-f8fa25c9405a?q=80&w=300&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: "White truffle infused olive oil.",
    sku: "PAN-OIL-002"
  },
  {
    id: 'item-4',
    name: 'Cabernet Sauvignon',
    category: 'Beverages',
    currentStock: 24,
    unit: 'bottle',
    cost: 35.0,
    lowStockThreshold: 10,
    imageUrl: 'https://images.unsplash.com/photo-1584916201218-6e3407871b77?q=80&w=300&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: "Vintage 2018, Napa Valley.",
    sku: "BEV-WIN-001"
  },
  {
      id: 'item-5',
      name: 'Organic Avocados',
      category: 'Fresh Produce',
      currentStock: 4, // Low Stock
      unit: 'piece',
      cost: 1.5,
      lowStockThreshold: 5,
      imageUrl: 'https://images.unsplash.com/photo-1587915598503-a4474c1dfa0d?q=80&w=300&auto=format&fit=crop',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: 'Creamy and delicious organic avocados.',
      sku: 'FP-AVO-002',
  },
];

const Inventory: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(initialInventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);

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

  const handleOpenAddDialog = () => {
    setItemToEdit(null);
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (item: InventoryItem) => {
    setItemToEdit(item);
    setIsAddDialogOpen(true);
  };
  
  const handleSaveItem = (itemData: any) => {
    const itemExists = inventoryItems.some(i => i.id === itemData.id);
    
    const finalItem: InventoryItem = {
      ...itemData,
      imageUrl: itemData.imagePreview,
    };
    delete (finalItem as any).imagePreview;

    if (itemExists) {
      setInventoryItems(prev =>
        prev.map(i => (i.id === finalItem.id ? finalItem : i))
      );
      toast.success(`${finalItem.name} has been updated.`);
    } else {
      setInventoryItems(prev => [...prev, finalItem]);
      toast.success(`${finalItem.name} has been added to inventory.`);
    }
    setItemToEdit(null);
  };

  const handleStockUpdate = (itemId: string, quantityChange: number) => {
    let itemName = '';
    setInventoryItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          itemName = item.name;
          const newStock = (item.currentStock ?? 0) + quantityChange;
          return { 
            ...item, 
            currentStock: newStock < 0 ? 0 : newStock, 
            updatedAt: new Date().toISOString() 
          };
        }
        return item;
      })
    );
    toast.success(`Stock for ${itemName} has been updated.`);
  };

  const selectedItem = inventoryItems.find(item => item.id === selectedItemId);

  return (
    <div className="space-y-6 animate-fade-in">
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
          onClick={handleOpenAddDialog}
          className="gap-2 bg-black text-white hover:bg-gray-800 rounded-full px-6"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

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
              ? []
              : inventoryItems.filter(item => item.category === selectedCategory)
          }
          searchQuery={searchQuery}
          onItemSelect={handleItemSelect}
        />
      )}

      {viewMode === 'item-detail' && selectedItemId && selectedItem && (
        <InventoryItemDetail 
          item={selectedItem}
          onBack={handleBack}
          onEdit={() => handleOpenEditDialog(selectedItem)}
          onStockUpdate={handleStockUpdate}
        />
      )}

      <AddInventoryItemDialog
        isOpen={isAddDialogOpen}
        onOpenChange={(isOpen) => {
          setIsAddDialogOpen(isOpen);
          if (!isOpen) {
            setItemToEdit(null);
          }
        }}
        onSaveItem={handleSaveItem}
        category={selectedCategory}
        itemToEdit={itemToEdit}
      />
    </div>
  );
};

export default Inventory;
