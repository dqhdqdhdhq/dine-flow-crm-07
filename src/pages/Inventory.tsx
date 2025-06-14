
import React, { useState } from 'react';
import { Search, Plus, Package, AlertTriangle, TrendingDown, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InventoryOverview from '@/components/inventory/InventoryOverview';
import InventoryCategory from '@/components/inventory/InventoryCategory';
import InventoryItemDetail from '@/components/inventory/InventoryItemDetail';

type ViewMode = 'dashboard' | 'category' | 'item-detail';

const Inventory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

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
        <Button className="gap-2 bg-black text-white hover:bg-gray-800 rounded-full px-6">
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
          searchQuery={searchQuery}
          onCategorySelect={handleCategorySelect}
          onItemSelect={handleItemSelect}
        />
      )}

      {viewMode === 'category' && selectedCategory && (
        <InventoryCategory 
          category={selectedCategory}
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
    </div>
  );
};

export default Inventory;
