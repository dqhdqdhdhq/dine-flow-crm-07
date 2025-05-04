
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Mail, Phone, MapPin, Package, Calendar, Clock, DollarSign } from 'lucide-react';
import { PurchaseOrder, Supplier } from '@/types';

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

  // Find the selected supplier
  const selectedSupplier = suppliers.find(s => s.id === vendorId);
  
  if (!selectedSupplier) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">Vendor not found</p>
      </div>
    );
  }

  // Filter orders for this supplier
  const supplierOrders = purchaseOrders.filter(order => order.supplierId === vendorId);
  const upcomingDeliveries = supplierOrders.filter(order => 
    order.status === 'ordered' || order.status === 'shipped'
  );

  // Calculate spending data
  const spendingData = {
    thisMonth: calculateSpending(supplierOrders, 30),
    thisYear: calculateSpending(supplierOrders, 365),
    allTime: calculateSpending(supplierOrders, Infinity),
  };

  // Get frequently ordered items
  const frequentItems = getFrequentlyOrderedItems(supplierOrders);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl">{selectedSupplier.name}</CardTitle>
            <CardDescription>Vendor Profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">{selectedSupplier.email}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">{selectedSupplier.phone}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">{selectedSupplier.address}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Products Supplied</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedSupplier.productsSupplied.map((product, index) => (
                        <Badge key={index} variant="secondary">{product}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending Overview</CardTitle>
            <CardDescription>Financial summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">This Month</span>
                <span className="font-medium">${spendingData.thisMonth.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">This Year</span>
                <span className="font-medium">${spendingData.thisYear.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">All Time</span>
                <span className="font-medium">${spendingData.allTime.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deliveries</CardTitle>
            <CardDescription>Expected deliveries from this vendor</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingDeliveries.length > 0 ? (
              <div className="space-y-3">
                {upcomingDeliveries.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h4 className="font-medium">PO-{order.id}</h4>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(order.expectedDeliveryDate), "MMM d, yyyy")}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {order.items.length} items, ${order.totalAmount.toFixed(2)}
                      </div>
                    </div>
                    <Badge variant={order.status === 'shipped' ? 'default' : 'secondary'}>
                      {order.status === 'shipped' ? 'Shipped' : 'Ordered'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">No upcoming deliveries</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Frequently Ordered Items</CardTitle>
            <CardDescription>Most common products from this vendor</CardDescription>
          </CardHeader>
          <CardContent>
            {frequentItems.length > 0 ? (
              <div className="space-y-3">
                {frequentItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">Total ordered: {item.totalOrdered}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${item.averageCost.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">per unit</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">No order history</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Order history with this vendor</CardDescription>
        </CardHeader>
        <CardContent>
          {supplierOrders.length > 0 ? (
            <div className="space-y-4">
              {supplierOrders.map((order) => (
                <div key={order.id} className="border rounded-md p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                    <div>
                      <h4 className="text-lg font-medium">PO-{order.id}</h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Ordered: {format(new Date(order.orderDate), 'MMM d, yyyy')}</span>
                        <Clock className="h-3 w-3 ml-3 mr-1" />
                        <span>Expected: {format(new Date(order.expectedDeliveryDate), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        order.status === 'received' ? 'success' : 
                        order.status === 'partially-received' ? 'warning' :
                        order.status === 'cancelled' ? 'destructive' :
                        order.status === 'shipped' ? 'default' : 'secondary'
                      }>
                        {order.status === 'received' ? 'Received' : 
                         order.status === 'partially-received' ? 'Partially Received' :
                         order.status === 'cancelled' ? 'Cancelled' :
                         order.status === 'shipped' ? 'Shipped' : 'Ordered'}
                      </Badge>
                      <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span>{item.quantity} {item.unit} × ${item.unitPrice.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">No order history</p>
          )}
        </CardContent>
      </Card>
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
