
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, FileText, Package, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InventoryItems from '@/components/inventory/InventoryItems';
import PurchaseOrders from '@/components/inventory/PurchaseOrders';
import Suppliers from '@/components/inventory/Suppliers';

const Inventory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Inventory & Supplies</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            New Item
          </Button>
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            New Purchase Order
          </Button>
          <Button variant="outline" className="gap-2">
            <Users className="h-4 w-4" />
            New Supplier
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search inventory, orders, suppliers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="items">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="items">
            <Package className="mr-2 h-4 w-4" />
            Inventory Items
          </TabsTrigger>
          <TabsTrigger value="orders">
            <FileText className="mr-2 h-4 w-4" />
            Purchase Orders
          </TabsTrigger>
          <TabsTrigger value="suppliers">
            <Users className="mr-2 h-4 w-4" />
            Suppliers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <InventoryItems searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="orders">
          <PurchaseOrders searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="suppliers">
          <Suppliers searchQuery={searchQuery} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Inventory;
