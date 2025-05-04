
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { PurchaseOrder } from '@/types';

// Mock data for demonstration
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
      }
    ],
    totalAmount: 285,
    notes: 'Regular monthly order',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    supplierId: 'supplier-2',
    supplierName: 'Premium Wines',
    status: 'shipped',
    orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expectedDeliveryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: 'item-3',
        inventoryItemId: '2',
        name: 'Cabernet Sauvignon',
        quantity: 12,
        unit: 'bottle',
        unitPrice: 35.0,
        receivedQuantity: 0,
        notes: ''
      }
    ],
    totalAmount: 12 * 35,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    supplierId: 'supplier-3',
    supplierName: 'Local Produce',
    status: 'ordered',
    orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expectedDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: 'item-4',
        inventoryItemId: '4',
        name: 'Organic Tomatoes',
        quantity: 20,
        unit: 'kg',
        unitPrice: 4.5,
        receivedQuantity: 0,
        notes: ''
      }
    ],
    totalAmount: 20 * 4.5,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const VendorCalendar: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Find all orders with expected delivery on the selected date
  const selectedDateOrders = mockPurchaseOrders.filter(order => {
    if (!date) return false;
    const deliveryDate = new Date(order.expectedDeliveryDate);
    return deliveryDate.getDate() === date.getDate() && 
           deliveryDate.getMonth() === date.getMonth() && 
           deliveryDate.getFullYear() === date.getFullYear();
  });

  // Find all dates that have expected deliveries
  const deliveryDates = mockPurchaseOrders.map(order => {
    const date = new Date(order.expectedDeliveryDate);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Delivery Calendar</CardTitle>
          <CardDescription>Select a date to view expected deliveries</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiers={{
              delivery: deliveryDates,
            }}
            modifiersStyles={{
              delivery: {
                fontWeight: 'bold',
                textDecoration: 'underline',
                color: 'var(--primary)',
              },
            }}
          />
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>
            Deliveries for {date ? format(date, 'MMMM d, yyyy') : 'Selected Date'}
          </CardTitle>
          <CardDescription>
            {selectedDateOrders.length} {selectedDateOrders.length === 1 ? 'delivery' : 'deliveries'} expected
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedDateOrders.length > 0 ? (
            <div className="space-y-4">
              {selectedDateOrders.map((order) => (
                <div key={order.id} className="border rounded-md p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h4 className="text-lg font-medium">PO-{order.id}</h4>
                      <p className="text-sm text-muted-foreground">{order.supplierName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        order.status === 'shipped' ? 'default' : 'secondary'
                      }>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span>{item.quantity} {item.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">No deliveries scheduled for this date</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorCalendar;
