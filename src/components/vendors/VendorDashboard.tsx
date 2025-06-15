import React from 'react';
import { PurchaseOrder, Supplier } from '@/types';
import VendorProfileCard from './dashboard/VendorProfileCard';
import SpendingOverviewCard from './dashboard/SpendingOverviewCard';
import UpcomingDeliveriesCard from './dashboard/UpcomingDeliveriesCard';
import FrequentItemsCard from './dashboard/FrequentItemsCard';
import RecentOrdersList from './dashboard/RecentOrdersList';
import VendorStatsCards from './dashboard/VendorStatsCards';

interface VendorDashboardProps {
  vendorId: string | null;
  purchaseOrders: PurchaseOrder[];
  suppliers: Supplier[];
}

const VendorDashboard: React.FC<VendorDashboardProps> = ({ 
  vendorId,
  purchaseOrders,
  suppliers 
}) => {
  if (!vendorId) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">Please select a vendor to view their dashboard</p>
      </div>
    );
  }

  const selectedSupplier = suppliers.find(s => s.id === vendorId);
  
  if (!selectedSupplier) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">Vendor not found</p>
      </div>
    );
  }

  const supplierOrders = purchaseOrders.filter(order => order.supplierId === vendorId);
  const upcomingDeliveries = supplierOrders.filter(order => 
    new Date(order.expectedDeliveryDate) >= new Date() && (order.status === 'ordered' || order.status === 'shipped')
  ).sort((a, b) => new Date(a.expectedDeliveryDate).getTime() - new Date(b.expectedDeliveryDate).getTime());

  const spendingData = {
    thisMonth: calculateSpending(supplierOrders, 30),
    thisYear: calculateSpending(supplierOrders, 365),
    allTime: calculateSpending(supplierOrders, Infinity),
  };

  const frequentItems = getFrequentlyOrderedItems(supplierOrders);

  return (
    <div className="space-y-6 animate-fade-in">
      <VendorStatsCards orders={supplierOrders} />
      <VendorProfileCard supplier={selectedSupplier} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SpendingOverviewCard spendingData={spendingData} />
        <UpcomingDeliveriesCard deliveries={upcomingDeliveries} />
        <FrequentItemsCard items={frequentItems} />
      </div>
      <RecentOrdersList orders={supplierOrders} />
    </div>
  );
};

// Helper function to calculate spending for different time periods
function calculateSpending(orders: PurchaseOrder[], daysPeriod: number): number {
  const now = new Date();
  const startDate = new Date();
  startDate.setDate(now.getDate() - daysPeriod);
  
  return orders
    .filter(order => {
      const orderDate = new Date(order.orderDate);
      return daysPeriod === Infinity || orderDate >= startDate;
    })
    .reduce((total, order) => total + order.totalAmount, 0);
}

// Helper function to get frequently ordered items
function getFrequentlyOrderedItems(orders: PurchaseOrder[]): { name: string; totalOrdered: number; averageCost: number }[] {
  const itemsMap: Record<string, { totalQuantity: number; totalCost: number; count: number }> = {};
  
  // Collect data for each item
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!itemsMap[item.name]) {
        itemsMap[item.name] = { totalQuantity: 0, totalCost: 0, count: 0 };
      }
      itemsMap[item.name].totalQuantity += item.quantity;
      itemsMap[item.name].totalCost += item.quantity * item.unitPrice;
      itemsMap[item.name].count += 1;
    });
  });
  
  // Transform to array and sort by total quantity
  return Object.entries(itemsMap)
    .map(([name, data]) => ({
      name,
      totalOrdered: data.totalQuantity,
      averageCost: data.totalCost / data.totalQuantity
    }))
    .sort((a, b) => b.totalOrdered - a.totalOrdered)
    .slice(0, 5); // Get top 5 most frequent items
}

export default VendorDashboard;
