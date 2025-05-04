
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Mail, Phone, MapPin, Package, Calendar, Clock, DollarSign } from 'lucide-react';
import { PurchaseOrder } from '@/types';

// Mock data
const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    supplierId: 'supplier-1',
    supplierName: 'Italian Imports Co.',
    status: 'ordered',
    orderDate: new Date().toISOString(),
    expectedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: 'item-1',
        inventoryItemId: '1',
        name: 'Parmigiano Reggiano',
        quantity: 10,
        unit: 'kg',
        unitPrice: 28.5,
        receivedQuantity: 0,
        notes: ''
      },
      {
        id: 'item-2',
        inventoryItemId: '3',
        name: 'Truffle Oil',
        quantity: 5,
        unit: 'bottle',
        unitPrice: 18.75,
        receivedQuantity: 0,
        notes: ''
      }
    ],
    totalAmount: 285 + 93.75,
    notes: 'Regular monthly order',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    supplierId: 'supplier-1',
    supplierName: 'Italian Imports Co.',
    status: 'received',
    orderDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    expectedDeliveryDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: 'item-5',
        inventoryItemId: '1',
        name: 'Parmigiano Reggiano',
        quantity: 8,
        unit: 'kg',
        unitPrice: 28.5,
        receivedQuantity: 8,
        notes: ''
      }
    ],
    totalAmount: 8 * 28.5,
    notes: '',
    receivedBy: 'Jane Smith',
    receivedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockSupplier = {
  id: 'supplier-1',
  name: 'Italian Imports Co.',
  contactPerson: 'Marco Rossi',
  phone: '+1 (555) 123-4567',
  email: 'marco@italianimports.com',
  address: '123 Cheese Lane, San Francisco, CA 94110',
  productsSupplied: ['Parmigiano Reggiano', 'Truffle Oil', 'Balsamic Vinegar'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const frequentItems = [
  { name: 'Parmigiano Reggiano', totalOrdered: 18, averageCost: 28.5 },
  { name: 'Truffle Oil', totalOrdered: 5, averageCost: 18.75 },
  { name: 'Balsamic Vinegar', totalOrdered: 3, averageCost: 22.50 },
];

const spendingData = {
  thisMonth: 378.75,
  thisYear: 2845.50,
  allTime: 5230.25,
};

interface VendorDashboardProps {
  vendorId: string | null;
}

const VendorDashboard: React.FC<VendorDashboardProps> = ({ vendorId }) => {
  if (!vendorId) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">Please select a vendor to view their dashboard</p>
      </div>
    );
  }

  // Filter orders for this supplier
  const supplierOrders = mockPurchaseOrders.filter(order => order.supplierId === vendorId);
  const upcomingDeliveries = supplierOrders.filter(order => 
    order.status === 'ordered' || order.status === 'shipped'
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl">{mockSupplier.name}</CardTitle>
            <CardDescription>Vendor Profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">{mockSupplier.email}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">{mockSupplier.phone}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">{mockSupplier.address}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Products Supplied</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {mockSupplier.productsSupplied.map((product, index) => (
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
                        {format(new Date(order.expectedDeliveryDate), 'MMM d, yyyy')}
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

export default VendorDashboard;
